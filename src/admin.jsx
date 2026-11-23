import { StrictMode, useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { API_BASE } from './api';
import './admin.css';

const TOKEN_KEY = 'chatturai_admin_token';
const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

async function api(path, opts = {}) {
  const r = await fetch(API_BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401) { const e = new Error(data.error || 'Login required'); e.auth = true; throw e; }
  if (!r.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const fmtWhen = (iso) => {
  const d = new Date(iso);
  const mins = (Date.now() - d) / 60000;
  if (mins < 1) return 'just now';
  if (mins < 60) return `${Math.floor(mins)} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined });
};
const fmtFull = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const digits = (s) => (s || '').replace(/[^0-9]/g, '');

function Brand() {
  return (
    <a className="brand" href="/">
      <img src="/themes/advanced/img/logo.svg" alt="ChatturAi" />
      <b>CHATTURAI</b>
    </a>
  );
}

/* ══ LOGIN ══ */
function Login({ onIn }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await fetch(API_BASE + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Login failed');
      setToken(d.token); onIn();
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="login grain">
      <form className="login-card" onSubmit={submit}>
        <Brand />
        <h1 className="dsp">Enquiries</h1>
        <p>Sign in to see who wants to make a film with you.</p>
        <label className="field">
          <span className="eyebrow">Password</span>
          <input className="input" type="password" autoFocus autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {err && <div className="error">{err}</div>}
        <button className="cta" disabled={busy || !pw}>{busy ? 'Signing in…' : 'Sign in'} <span className="dot">→</span></button>
      </form>
    </div>
  );
}

/* ══ ONE ENQUIRY ══ */
function Row({ e, open, onToggle, onStatus }) {
  const book = e.source === 'book-a-call';
  const phone = digits(e.phone);
  const details = e.details && typeof e.details === 'object' ? Object.entries(e.details).filter(([, v]) => v) : [];
  return (
    <div className={open ? 'row open' : 'row'}>
      <button className="row-h" onClick={onToggle} aria-expanded={open}>
        <span className={`pip ${e.status}`} title={e.status}></span>
        <span className="who"><b>{e.name}</b><span>{e.email}</span></span>
        <span className="what">{e.subject && <strong>{e.subject} · </strong>}{e.message || (book ? (e.details?.Budget || '') : '')}</span>
        <span className={book ? 'tag book' : 'tag'}>{book ? 'Book a call' : 'Contact'}</span>
        <span className="when" title={fmtFull(e.created_at)}>{fmtWhen(e.created_at)}</span>
        <span className="chev" aria-hidden="true">›</span>
      </button>
      {open && (
        <div className="detail">
          <div>
            {e.subject && <div className="eyebrow" style={{ marginBottom: 10 }}>{e.subject}</div>}
            <div className={e.message ? 'msg' : 'msg empty'}>{e.message || 'No message.'}</div>
            <dl className="kv">
              <dt>Email</dt><dd>{e.email}</dd>
              {e.phone && <><dt>Phone</dt><dd>{e.phone}</dd></>}
              {details.map(([k, v]) => <FragmentKV key={k} k={k} v={String(v)} />)}
              <dt>Received</dt><dd>{fmtFull(e.created_at)}</dd>
            </dl>
          </div>
          <div className="side">
            <div className="eyebrow">Reply</div>
            <div className="actions">
              <a className="act" href={`mailto:${e.email}?subject=${encodeURIComponent('Re: ' + (e.subject || 'Your enquiry with ChatturAi'))}`}>✉ Email</a>
              {phone && <a className="act" href={`https://wa.me/${phone}`} target="_blank" rel="noopener">WhatsApp</a>}
              {phone && <a className="act" href={`tel:+${phone}`}>Call</a>}
            </div>
            <div className="eyebrow" style={{ marginTop: 10 }}>Status</div>
            <div className="status">
              {['new', 'contacted', 'closed'].map((s) => (
                <button key={s} className={e.status === s ? 'on' : ''} onClick={() => onStatus(e.id, s)}>{s[0].toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
            <div className="meta" style={{ marginTop: 10 }}>
              #{e.id}{e.page_url ? <><br />{e.page_url}</> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const FragmentKV = ({ k, v }) => <><dt>{k}</dt><dd>{v}</dd></>;

/* ══ DASHBOARD ══ */
function Enquiries({ onOut }) {
  const [data, setData] = useState({ rows: [], counts: {}, bySource: {} });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [at, setAt] = useState(null);

  const load = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      if (source) p.set('source', source);
      if (q.trim()) p.set('q', q.trim());
      const d = await api('/api/admin/enquiries?' + p);
      setData(d); setErr(''); setAt(new Date());
    } catch (x) {
      if (x.auth) { setToken(''); onOut(); } else setErr(x.message);
    } finally { setLoading(false); }
  }, [source, q, onOut]);

  useEffect(() => { const t = setTimeout(load, q ? 300 : 0); return () => clearTimeout(t); }, [load, q]);
  useEffect(() => { const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);

  const changeStatus = async (id, s) => {
    setData((d) => ({ ...d, rows: d.rows.map((r) => (r.id === id ? { ...r, status: s } : r)) }));
    try { await api(`/api/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status: s }) }); load(); }
    catch (x) { setErr(x.message); load(); }
  };

  const rows = useMemo(() => (status ? data.rows.filter((r) => r.status === status) : data.rows), [data.rows, status]);
  const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
  const stats = [['', 'All', total], ['new', 'New', data.counts.new || 0], ['contacted', 'Contacted', data.counts.contacted || 0], ['closed', 'Closed', data.counts.closed || 0]];

  return (
    <div className="grain" style={{ minHeight: '100vh' }}>
      <div className="top">
        <div className="wrap top-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Brand /><span className="label">Admin</span></div>
          <div className="top-r">
            <span className="updated">{at ? `updated ${at.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
            <button className="ghost" onClick={() => { setToken(''); onOut(); }}>Log out</button>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Contact form · Book a call</div>
          <h1 className="dsp">Enquiries</h1>
          <div className="stats">
            {stats.map(([k, label, n]) => (
              <button key={label} className={`stat ${k}${status === k ? ' on' : ''}`} onClick={() => setStatus(k)}>
                <span className="eyebrow">{label}</span><b>{n}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="bar">
          <div className="seg">
            {[['', 'All'], ['contact', `Contact ${data.bySource.contact || 0}`], ['book-a-call', `Book a call ${data.bySource['book-a-call'] || 0}`]].map(([k, l]) => (
              <button key={k} className={source === k ? 'on' : ''} onClick={() => setSource(k)}>{l}</button>
            ))}
          </div>
          <input className="search" type="search" placeholder="Search name, email, phone, message…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {err && <div className="error" style={{ margin: '0 0 14px' }}>{err}</div>}

        <div className="list">
          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              <div className="dsp">{total ? 'Nothing here' : 'No enquiries yet'}</div>
              <p>{total ? 'Try a different filter or search.' : 'New Contact and Book-a-call submissions will show up here.'}</p>
            </div>
          ) : rows.map((e) => (
            <Row key={e.id} e={e} open={open === e.id} onToggle={() => setOpen(open === e.id ? null : e.id)} onStatus={changeStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminApp() {
  const [inside, setInside] = useState(() => !!getToken());
  return inside ? <Enquiries onOut={() => setInside(false)} /> : <Login onIn={() => setInside(true)} />;
}

createRoot(document.getElementById('root')).render(<StrictMode><AdminApp /></StrictMode>);
