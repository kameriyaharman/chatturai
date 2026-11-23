import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES, flag, guessCountry } from '../countries';
import { CALENDLY } from '../components/Bits';
import { saveEnquiry } from '../api';

/*
 * The form is still handled by the existing PHP (Yii) backend, exactly as before:
 *  1. GET  /contact?legacy=1  → Yii renders its contact page; we read the _csrf token from it
 *  2. POST /contact           → Yii validates, saves/emails the enquiry (same as the old site)
 * .htaccess routes both of these to index.php; every other /contact GET is the React page.
 */

const EMAIL_RE = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
const PHONE_RE = /((\+[0-9]{6})|0)?[0-9]{7}/;

// Same rules + messages as the Yii ActiveForm on the old page
function validateField(name, raw) {
  const v = (raw || '').trim();
  switch (name) {
    case 'full_name':
      if (!v) return 'Please enter your Full Name here.';
      if (v.length > 150) return 'Full Name should contain at most 150 characters.';
      return '';
    case 'email':
      if (!v) return 'Please enter your Email here.';
      if (v.length > 150) return 'Email should contain at most 150 characters.';
      if (!EMAIL_RE.test(v)) return 'Email is not a valid email address.';
      return '';
    case 'phone_number':
      if (!v) return 'Please enter your Phone Number here.';
      if (v.length < 10) return 'Phone Number should contain at least 10 characters.';
      if (v.length > 13) return 'Phone Number should contain at most 13 characters.';
      if (!PHONE_RE.test(v)) return 'Phone Number is invalid.';
      return '';
    case 'subject':
      return v ? '' : 'Please enter your Subject here.';
    case 'message':
      return v ? '' : 'Please enter your Message here.';
    default:
      return '';
  }
}
const FIELDS = ['full_name', 'email', 'phone_number', 'subject', 'message'];

async function submitToYii(values) {
  // 1. fresh CSRF token (also sets Yii's _csrf cookie)
  const page = await fetch('/contact?legacy=1', { credentials: 'same-origin', cache: 'no-store' });
  const html = await page.text();
  const m = html.match(/name="_csrf"\s+value="([^"]+)"/);
  if (!m) throw new Error('csrf');

  const body = new URLSearchParams();
  body.append('_csrf', m[1]);
  for (const [k, v] of Object.entries(values)) body.append(`Contact[${k}]`, v);

  // 2. post exactly what the old form posted
  const res = await fetch('/contact', {
    method: 'POST',
    body,
    credentials: 'same-origin',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });

  // Yii redirects after a successful save (PRG pattern)
  if (res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) return { ok: true };

  const out = await res.text();
  const success = (out.match(/var success_msg = "([^"]*)"/) || [])[1];
  const error = (out.match(/var error_msg = "([^"]*)"/) || [])[1];
  if (success) return { ok: true };

  // server-side field errors re-rendered by Yii
  const fieldErrors = {};
  for (const f of FIELDS) {
    const id = f === 'phone_number' ? 'fPhone' : `contact-${f}`;
    const re = new RegExp(`id="${id}"[\\s\\S]*?<div class="invalid-feedback">([^<]*)</div>`);
    const e = (out.match(re) || [])[1];
    if (e && e.trim()) fieldErrors[f] = e.trim();
  }
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };
  if (error) return { ok: false, message: error };
  if (res.ok) return { ok: true };
  return { ok: false, message: 'Something went wrong. Please try again, or email contact@chatturai.com.' };
}

function Field({ name, id, placeholder, type = 'text', textarea, values, errors, touched, onChange, onBlur, extra }) {
  const err = errors[name];
  const state = touched[name] ? (err ? ' is-invalid' : ' is-valid') : '';
  const common = {
    id, name: `Contact[${name}]`, placeholder,
    value: values[name],
    'aria-required': 'true',
    'aria-invalid': err ? 'true' : undefined,
    onChange: (e) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    ...extra,
  };
  const container = name === 'phone_number' ? 'field-fPhone' : `field-contact-${name}`;
  return (
    <div className={`mb-3 ${container} required`}>
      {textarea
        ? <textarea className={`text-area w-input${state}`} rows="5" {...common}></textarea>
        : <input type={type} className={`text-field w-input${state}`} {...common} />}
      <div className="invalid-feedback">{err || ''}</div>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState({ full_name: '', email: '', phone_number: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [dial, setDial] = useState('+1');
  const [iso, setIso] = useState('US');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

  // pick the visitor's country code from their timezone (as before)
  useEffect(() => {
    const g = guessCountry();
    const match = COUNTRIES.find((c) => c[0] === g);
    if (match) { setDial('+' + match[1]); setIso(match[0]); }
  }, []);

  const onDial = (e) => {
    const o = e.target.options[e.target.selectedIndex];
    setDial(e.target.value);
    setIso(o.getAttribute('data-iso'));
  };

  const onChange = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (touched[name]) setErrors((s) => ({ ...s, [name]: validateField(name, v) }));
  };
  const onBlur = (name) => {
    setTouched((s) => ({ ...s, [name]: true }));
    setErrors((s) => ({ ...s, [name]: validateField(name, values[name]) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const errs = {};
    FIELDS.forEach((f) => { const m = validateField(f, values[f]); if (m) errs[f] = m; });
    setErrors(errs);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
    setFormError('');
    if (Object.keys(errs).length) {
      const first = FIELDS.find((f) => errs[f]);
      const el = document.getElementById(first === 'phone_number' ? 'fPhone' : `contact-${first}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBusy(true);
    // save to the enquiry admin (runs alongside the existing Yii submission)
    const saved = saveEnquiry({
      source: 'contact',
      name: values.full_name.trim(), email: values.email.trim(),
      phone: `${dial} ${values.phone_number.trim()}`,
      subject: values.subject.trim(), message: values.message.trim(),
    });
    try {
      let r;
      try { r = await submitToYii({ ...values, country_code: dial }); }
      catch { r = { ok: false, message: 'Something went wrong. Please try again, or email contact@chatturai.com.' }; }
      // if Yii is unreachable but the lead is safely stored, still treat it as sent
      if (!r.ok && !r.fieldErrors && (await saved)) r = { ok: true };
      if (r.ok) {
        setSent(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (r.fieldErrors) {
        setErrors(r.fieldErrors);
      } else {
        setFormError(r.message);
      }
    } catch (err) {
      setFormError('Something went wrong. Please try again, or email contact@chatturai.com.');
    } finally {
      setBusy(false);
    }
  };

  const fp = { values, errors, touched, onChange, onBlur };

  return (
    <>
      <style type="text/css">{`
  .invalid-feedback {
    color: #d81515;
}
`}</style>
      <header className="grain">
        <div className="wrap rel">
          <h1 className="dsp">Talk to us.</h1>
          <p className="lede">Whatever stage it is at. A concept, a script, a rough thought you have not written down yet. Tell us what you are trying to make and we will come back with an honest answer on what it takes.</p>
        </div>
      </header>
      <section>
        <div className="wrap">
          <form id="contactForm" className="contact-form" action="/contact" method="post" onSubmit={onSubmit} noValidate style={sent ? { display: 'none' } : undefined}>
            <div className="q" data-q="name">
              <label htmlFor="fName">Your name <span className="req">*</span></label>
              <Field name="full_name" id="contact-full_name" placeholder="Full Name*" {...fp} />
              <div className="err">We need a name to reply to.</div>
            </div>
            <div className="q" data-q="email">
              <label htmlFor="fEmail">Email <span className="req">*</span></label>
              <div className="hint">Work or personal, whichever you actually read.</div>
              <Field name="email" id="contact-email" placeholder="Email*" {...fp} />
              <div className="err">Please enter a working email address.</div>
            </div>
            <div className="q" data-q="phone">
              <label htmlFor="fPhone">Phone number <span className="req">*</span></label>
              <div className="hint">We only use it if email goes nowhere.</div>
              <div className="phone">
                <div className="dialbox">
                  <span className="dialview" id="dialView">{flag(iso)}{'  '}{dial}</span>
                  <svg className="chev" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="#8C877D" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                  <select id="fDial" name="Contact[country_code]" aria-label="Country code" value={dial} onChange={onDial}>
                    {COUNTRIES.map(([i, code, name]) => (
                      <option key={i} value={'+' + code} data-iso={i}>{flag(i)}{'  '}{name}{'  +'}{code}</option>
                    ))}
                  </select>
                </div>
                <Field name="phone_number" id="fPhone" placeholder="Phone Number*" {...fp} extra={{ autoComplete: 'tel', inputMode: 'numeric' }} />
              </div>
              <div className="err">Please enter a valid phone number.</div>
            </div>
            <div className="q" data-q="message">
              <label htmlFor="fMessage">Subject <span className="req">*</span></label>
              <Field name="subject" id="contact-subject" placeholder="Subject*" {...fp} />
            </div>
            <div className="q" data-q="message">
              <label htmlFor="fMessage">What are you trying to make? <span className="req">*</span></label>
              <div className="hint">In as much or as little detail as you like. What it is for, who is going to watch it, and roughly when you need it. If you already have something written, say so and we will ask for it.</div>
              <Field name="message" id="contact-message" placeholder="Write your message here...*" textarea {...fp} />
              <div className="err">Tell us a little about what you have in mind.</div>
            </div>
            <div className="actions">
              <button type="submit" className="cta" id="send" disabled={busy}>{busy ? 'Sending…' : <>Send <span className="dot">→</span></>}</button>
              <span className="note">We read everything and reply within a working day.</span>
            </div>
            {formError && <div className="invalid-feedback" role="alert">{formError}</div>}
            <div className="alt">
              <b>Already know what you want made?</b>
              <p>If you have a concept ready and you would rather talk it through, <a href={CALENDLY} target="_blank" rel="noopener">book a twenty minute call</a> instead. You bring the concept, we tell you what it takes to build and what it costs.</p>
            </div>
          </form>
          <div className={sent ? 'sent on' : 'sent'} id="sent">
            <div className="tick">✓</div>
            <h2 className="dsp">Thanks. It's with us.</h2>
            <p>We read every message ourselves and come back within a working day, usually with a question or two before anything else.</p>
            <p className="u-co1"><Link className="u-co2" to="/portfolio">See the work while you wait →</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
