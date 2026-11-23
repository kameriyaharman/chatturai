// Enquiry API: stores Contact + Book-a-call leads, serves them to the admin panel.
// Storage: SQLite file on a Railway volume (DATA_DIR, default ./data).
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'enquiries.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    source TEXT NOT NULL,
    name TEXT, email TEXT, phone TEXT, subject TEXT, message TEXT,
    details TEXT, status TEXT NOT NULL DEFAULT 'new',
    page_url TEXT, user_agent TEXT, ip TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_enq_created ON enquiries(created_at);
`);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update('chatturai:' + ADMIN_PASSWORD).digest('hex');
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://chatturai.com,https://www.chatturai.com')
  .split(',').map((s) => s.trim()).filter(Boolean);
const SOURCES = new Set(['contact', 'book-a-call']);
const STATUSES = new Set(['new', 'contacted', 'closed']);

/* ── helpers ── */
const clip = (v, n) => (v == null ? '' : String(v)).trim().slice(0, n);
function json(res, status, data, extra = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  res.end(JSON.stringify(data));
}
function readBody(req, limit = 64 * 1024) {
  return new Promise((ok, fail) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) { fail(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { fail(new Error('bad json')); } });
    req.on('error', fail);
  });
}
function clientIp(req) {
  return clip((req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress, 64);
}
function cors(req) {
  const o = req.headers.origin;
  if (!o) return {};
  const host = req.headers.host;
  const ok = ALLOWED_ORIGINS.includes(o) || (host && o === `https://${host}`) || /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/.test(o);
  return ok ? { 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS', Vary: 'Origin' } : {};
}

/* ── simple rate limit for public submissions: 8 per IP per 10 min ── */
const hits = new Map();
function limited(ip) {
  const now = Date.now(); const arr = (hits.get(ip) || []).filter((t) => now - t < 600000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 8;
}

/* ── admin tokens: HMAC-signed expiry, 7 days ── */
const sign = (s) => crypto.createHmac('sha256', SECRET).update(s).digest('base64url');
function makeToken() { const exp = String(Date.now() + 7 * 864e5); return `${exp}.${sign(exp)}`; }
function authed(req) {
  const t = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [exp, sig] = t.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = sign(exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}
const failedLogins = new Map();

/* ── routes ── */
export async function handleApi(req, res, url) {
  const h = cors(req);
  if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
  const p = url.pathname;

  // public: save an enquiry
  if (p === '/api/enquiries' && req.method === 'POST') {
    const ip = clientIp(req);
    if (limited(ip)) return json(res, 429, { ok: false, error: 'Too many requests' }, h);
    let b; try { b = await readBody(req); } catch { return json(res, 400, { ok: false, error: 'Bad request' }, h); }
    if (b.website) return json(res, 200, { ok: true }, h); // honeypot: silently ignore bots
    const source = SOURCES.has(b.source) ? b.source : 'contact';
    const name = clip(b.name, 150), email = clip(b.email, 150);
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(res, 422, { ok: false, error: 'Name and a valid email are required' }, h);
    const details = b.details && typeof b.details === 'object' ? JSON.stringify(b.details).slice(0, 8000) : null;
    const r = db.prepare(`INSERT INTO enquiries (source,name,email,phone,subject,message,details,page_url,user_agent,ip)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(source, name, email, clip(b.phone, 40), clip(b.subject, 300), clip(b.message, 8000),
      details, clip(b.page_url, 500), clip(req.headers['user-agent'], 300), ip);
    return json(res, 201, { ok: true, id: Number(r.lastInsertRowid) }, h);
  }

  // admin: login
  if (p === '/api/admin/login' && req.method === 'POST') {
    const ip = clientIp(req);
    const f = (failedLogins.get(ip) || []).filter((t) => Date.now() - t < 900000);
    if (f.length >= 10) return json(res, 429, { ok: false, error: 'Too many attempts. Try again in 15 minutes.' }, h);
    let b; try { b = await readBody(req, 4096); } catch { return json(res, 400, { ok: false }, h); }
    const given = Buffer.from(String(b.password || ''));
    const want = Buffer.from(ADMIN_PASSWORD);
    const ok = ADMIN_PASSWORD && given.length === want.length && crypto.timingSafeEqual(given, want);
    if (!ok) { f.push(Date.now()); failedLogins.set(ip, f); return json(res, 401, { ok: false, error: 'Wrong password' }, h); }
    failedLogins.delete(ip);
    return json(res, 200, { ok: true, token: makeToken() }, h);
  }

  if (p.startsWith('/api/admin/')) {
    if (!authed(req)) return json(res, 401, { ok: false, error: 'Login required' }, h);

    if (p === '/api/admin/enquiries' && req.method === 'GET') {
      const where = []; const args = [];
      const src = url.searchParams.get('source'); if (SOURCES.has(src)) { where.push('source = ?'); args.push(src); }
      const st = url.searchParams.get('status'); if (STATUSES.has(st)) { where.push('status = ?'); args.push(st); }
      const q = clip(url.searchParams.get('q'), 100);
      if (q) { where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ? OR details LIKE ?)'); args.push(...Array(6).fill(`%${q}%`)); }
      const w = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const rows = db.prepare(`SELECT * FROM enquiries ${w} ORDER BY id DESC LIMIT 500`).all(...args)
        .map((r) => ({ ...r, details: r.details ? JSON.parse(r.details) : null }));
      const counts = Object.fromEntries(db.prepare(`SELECT status, COUNT(*) c FROM enquiries GROUP BY status`).all().map((r) => [r.status, r.c]));
      const bySource = Object.fromEntries(db.prepare(`SELECT source, COUNT(*) c FROM enquiries GROUP BY source`).all().map((r) => [r.source, r.c]));
      return json(res, 200, { ok: true, rows, counts, bySource }, h);
    }

    const m = p.match(/^\/api\/admin\/enquiries\/(\d+)$/);
    if (m && req.method === 'PATCH') {
      let b; try { b = await readBody(req, 4096); } catch { return json(res, 400, { ok: false }, h); }
      if (!STATUSES.has(b.status)) return json(res, 422, { ok: false, error: 'Invalid status' }, h);
      db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(b.status, Number(m[1]));
      return json(res, 200, { ok: true }, h);
    }
  }

  return json(res, 404, { ok: false, error: 'Not found' }, h);
}
