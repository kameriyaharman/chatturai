// Preview server for Railway (zero dependencies).
// Serves the prerendered React pages from dist/, and forwards everything that still
// lives on the PHP server (CSS, images, contact backend, admin, booking funnel)
// to the live site — so the preview looks and works exactly like production will.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.mjs';

const ORIGIN = process.env.LEGACY_ORIGIN || 'https://chatturai.com';
const PORT = process.env.PORT || 3000;
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const ROUTES = new Set(['/home-1', '/home-2', '/home-3', '/home-4', '/versions', '/portfolio', '/about-us', '/contact', '/privacy-policy', '/terms-condition']);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json' };

function sendFile(res, file, status = 200) {
  const ext = path.extname(file);
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };
  headers['Cache-Control'] = file.includes(`${path.sep}react-assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(status, headers);
  fs.createReadStream(file).pipe(res);
}

async function proxy(req, res, url) {
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await new Promise((ok) => {
    const chunks = []; req.on('data', (c) => chunks.push(c)); req.on('end', () => ok(Buffer.concat(chunks)));
  });
  const headers = {};
  for (const h of ['cookie', 'content-type', 'accept', 'user-agent', 'accept-language']) if (req.headers[h]) headers[h] = req.headers[h];
  const up = await fetch(ORIGIN + url.pathname + url.search, { method: req.method, headers, body, redirect: 'manual' });
  const out = {};
  up.headers.forEach((v, k) => {
    if (['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie'].includes(k)) return;
    out[k] = k === 'location' ? v.replace(ORIGIN, '') : v;
  });
  // keep Yii's cookies (CSRF/session) working on the preview domain
  const cookies = up.headers.getSetCookie?.() || [];
  if (cookies.length) out['set-cookie'] = cookies.map((c) => c.replace(/;\s*domain=[^;]+/i, ''));
  res.writeHead(up.status, out);
  res.end(Buffer.from(await up.arrayBuffer()));
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname.replace(/\/+$/, '') || '/';

    // enquiry API (contact + book-a-call leads, admin panel)
    if (p.startsWith('/api/')) return await handleApi(req, res, url);

    // form backends → Yii on the live server (same as .htaccess rule 1)
    if ((p === '/contact' || p === '/book-a-call') && (req.method === 'POST' || url.searchParams.get('legacy') === '1')) return await proxy(req, res, url);

    // React pages
    if (p === '/') return sendFile(res, path.join(DIST, 'index.html'));
    if (ROUTES.has(p)) return sendFile(res, path.join(DIST, p.slice(1) + '.html'));
    if (p === '/book-a-call') return sendFile(res, path.join(DIST, 'book-a-call.html'));
    if (p === '/admin' || p.startsWith('/admin/')) return sendFile(res, path.join(DIST, 'admin.html'));

    // React's own JS bundle
    const file = path.join(DIST, path.normalize(url.pathname));
    if (file.startsWith(DIST) && url.pathname.startsWith('/react-assets/') && fs.existsSync(file)) return sendFile(res, file);

    // everything else (themes/, media/, assets/, admin, book-a-call, …) → live PHP site
    return await proxy(req, res, url);
  } catch (e) {
    console.error(e);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Upstream error');
  }
}).listen(PORT, () => console.log(`chatturai preview on :${PORT} → legacy ${ORIGIN}`));
