import { useEffect, useRef, useState } from 'react';
import { COUNTRIES, flag, guessCountry } from '../countries';
import { saveEnquiry } from '../api';

const CONCEPT = [['Written', "Yes, it's written down"], ['In progress', "It's in progress"], ['Not written', "Not yet, I'd like you to build it with me"]];
const PURPOSE = [['Launch', 'A launch'], ['Brand film', 'A brand film'], ['Investor or pitch', 'Investor or pitch'], ['Campaign', 'A campaign'], ['Feature film', 'A feature film'], ['Something else', 'Something else']];
const BUDGET = [['$3,000 to $6,000', '$3,000 to $6,000'], ['$6,000 to $10,000', '$6,000 to $10,000'], ['$10,000+', '$10,000+'], ['Feature, $30,000+', 'Feature film, $30,000+']];
const REQUIRED = ['name', 'email', 'country_code', 'phone', 'brand', 'concept', 'purpose', 'budget', 'timing'];

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ChatturAi">
      <defs>
        <clipPath id="ckF"><rect x="0" y="0" width="338" height="500" /></clipPath>
        <clipPath id="ctF"><rect x="0" y="0" width="500" height="212" /></clipPath>
        <mask id="mkF">
          <rect width="500" height="500" fill="#fff" />
          <g clipPath="url(#ctF)"><circle cx="251.5" cy="251" r="155.6" fill="none" stroke="#000" strokeWidth="12.8" /></g>
        </mask>
      </defs>
      <g mask="url(#mkF)">
        <g clipPath="url(#ckF)"><circle cx="251.5" cy="251" r="121" fill="none" stroke="#CDF000" strokeWidth="53" /></g>
        <circle cx="251.5" cy="251" r="46" fill="#CDF000" />
        <path d="M347 398 L347 140 Q351 120 399 103 L399 398 Z" fill="#CDF000" />
      </g>
    </svg>
  );
}

function Options({ name, items }) {
  return (
    <div className="opts">
      {items.map(([v, label]) => (
        <label className="opt" key={v}><input type="radio" name={name} value={v} /><span>{label}</span></label>
      ))}
    </div>
  );
}

export default function BookACall() {
  const form = useRef(null);
  const [bad, setBad] = useState({});
  const [dial, setDial] = useState('+1');
  const [iso, setIso] = useState('US');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const g = guessCountry();
    const match = COUNTRIES.find((c) => c[0] === g);
    if (match) { setDial('+' + match[1]); setIso(match[0]); }
  }, []);

  const val = (n) => {
    const el = form.current.elements[n];
    if (!el) return '';
    if (el.length && el[0] && el[0].type === 'radio') {
      for (let i = 0; i < el.length; i++) if (el[i].checked) return el[i].value;
      return '';
    }
    return (el.value || '').trim();
  };

  const validate = () => {
    const b = {}; let first = null;
    REQUIRED.forEach((k) => {
      const v = val(k);
      const good = k === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) : v.length > 0;
      if (!good) { b[k] = true; if (!first) first = k; }
    });
    setBad(b);
    if (first) {
      const el = form.current.querySelector(`[data-q="${first === 'country_code' ? 'phone' : first}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return !first;
  };

  const clear = (e) => {
    const box = e.target.closest('.q');
    if (box && bad[box.dataset.q]) setBad((s) => ({ ...s, [box.dataset.q]: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const fullName = val('name'), email = val('email'), phone = val('phone');
    const parts = fullName.split(/\s+/);
    if (typeof window.metaEvent === 'function') {
      window.metaEvent('Lead', { email, phone, first_name: parts[0], last_name: parts.slice(1).join(' ') });
    }
    try {
      sessionStorage.setItem('chatturai_user', JSON.stringify({ email, phone, first_name: parts[0], last_name: parts.slice(1).join(' ') }));
    } catch { /* ignore */ }

    // 1) save the lead to the new enquiry admin
    const lead = saveEnquiry({
      source: 'book-a-call',
      name: fullName, email, phone: `${dial} ${phone}`,
      subject: val('purpose'),
      message: val('tried'),
      details: {
        'Website / Instagram': val('brand'), 'Concept written?': val('concept'), 'Film for': val('purpose'),
        Budget: val('budget'), 'When needed': val('timing'), 'Tried it themselves?': val('tried'),
      },
      website: val('website'),
    });

    // 2) the existing booking flow (Yii saves it and returns the Calendly page to go to)
    try {
      const page = await fetch('/book-a-call?legacy=1', { credentials: 'same-origin', cache: 'no-store' });
      const token = ((await page.text()).match(/name="_csrf"\s+value="([^"]+)"/) || [])[1] || '';
      const fd = new FormData(form.current);
      fd.delete('website');
      fd.set('_csrf', token);
      const res = await fetch('/site/save-booking', { method: 'POST', body: fd, credentials: 'same-origin' });
      const response = await res.json();
      await lead;
      if (response.success) {
        setTimeout(() => { window.location.href = response.redirect; }, 3000); // user sees the loader for 3 sec
      } else {
        setLoading(false);
        console.log(response.errors);
        alert('Unable to save booking.');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('Something went wrong.');
    }
  };

  const q = (k) => (bad[k] || (k === 'phone' && bad.country_code) ? 'q bad' : 'q');

  return (
    <>
      {/* ══ HEADER ══ */}
      <header className="grain">
        <div className="wrap rel">
          <a className="brand" href="/">
            <Logo />
            <b>CHATTURAI</b>
          </a>
          <div className="steps">
            <div className="step on" id="s1"><i></i></div>
            <div className="step" id="s2"><i></i></div>
            <div className="step" id="s3"><i></i></div>
          </div>
          <div className="steplabels">
            <span className="on" id="l1">01 · Your details</span>
            <span id="l2">02 · Pick a time</span>
            <span id="l3">03 · Confirmed</span>
          </div>
        </div>
      </header>

      {/* ══ STEP 1 · FORM ══ */}
      <section>
        <div className="wrap">
          <form id="form" method="post" ref={form} onSubmit={onSubmit} onInput={clear} onChange={clear} noValidate>
            {/* honeypot: hidden from people, bots fill it */}
            <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            <div className={q('name')} data-q="name">
              <label htmlFor="fName">Your name <span className="req">*</span></label>
              <input type="text" id="fName" name="name" autoComplete="name" placeholder="First and last" />
              <div className="err">We need a name for the call.</div>
            </div>
            <div className={q('email')} data-q="email">
              <label htmlFor="fEmail">Email <span className="req">*</span></label>
              <div className="hint">This is where the calendar invite goes. Work or personal, whichever you actually read.</div>
              <input type="email" id="fEmail" name="email" autoComplete="email" placeholder="name@email.com" />
              <div className="err">Please enter a working email address.</div>
            </div>
            <div className={q('phone')} data-q="phone">
              <label htmlFor="fPhone">Phone number <span className="req">*</span></label>
              <div className="hint">We only use it if something goes wrong with the call.</div>
              <div className="phone">
                <div className="dialbox">
                  <span className="dialview" id="dialView">{flag(iso)}{'  '}{dial}</span>
                  <svg className="chev" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="#8C877D" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                  <select id="fDial" name="country_code" aria-label="Country code" value={dial}
                    onChange={(e) => { setDial(e.target.value); setIso(e.target.options[e.target.selectedIndex].getAttribute('data-iso')); }}>
                    {COUNTRIES.map(([i, code, name]) => (
                      <option key={i} value={'+' + code} data-iso={i}>{flag(i)}{'  '}{name}{'  +'}{code}</option>
                    ))}
                  </select>
                </div>
                <input type="tel" id="fPhone" name="phone" autoComplete="tel" inputMode="numeric" placeholder="Phone number" />
              </div>
              <div className="err">Please enter a valid phone number.</div>
            </div>
            <div className={q('brand')} data-q="brand">
              <label htmlFor="fBrand">Website or Instagram <span className="req">*</span></label>
              <div className="hint">Anywhere we can look at the brand before the call. If there is nothing public yet, just write "nothing yet".</div>
              <input type="text" id="fBrand" name="brand" placeholder="yourbrand.com  ·  @yourbrand  ·  nothing yet" />
              <div className="err">Give us a link, or write "nothing yet".</div>
            </div>
            <div className={q('concept')} data-q="concept">
              <div className="lab">Do you already have a concept written? <span className="req">*</span></div>
              <div className="hint">There is no wrong answer. It just changes how we structure the call.</div>
              <Options name="concept" items={CONCEPT} />
              <div className="err">Pick the one that's closest.</div>
            </div>
            <div className={q('purpose')} data-q="purpose">
              <div className="lab">What is this film for? <span className="req">*</span></div>
              <Options name="purpose" items={PURPOSE} />
              <div className="err">Pick the closest one.</div>
            </div>
            <div className={q('budget')} data-q="budget">
              <div className="lab">Budget <span className="req">*</span></div>
              <div className="hint">Cinematic brand films start at $3,000. Full features start at $30,000. The exact number comes after we read your concept, so pick the range you are working within.</div>
              <Options name="budget" items={BUDGET} />
              <div className="err">Pick a range so we can quote properly.</div>
            </div>
            <div className={q('timing')} data-q="timing">
              <label htmlFor="fTiming">When do you need it? <span className="req">*</span></label>
              <input type="text" id="fTiming" name="timing" placeholder="A date, a month, or 'no fixed deadline'" />
              <div className="err">Even a rough answer helps.</div>
            </div>
            <div className="q" data-q="tried">
              <label htmlFor="fTried">Have you tried making it yourself? What happened?</label>
              <div className="hint">Optional, but it tells us a lot about where to start.</div>
              <textarea id="fTried" name="tried" style={{ minHeight: '90px' }} placeholder="Tools you tried, quotes you got, where it stalled…"></textarea>
            </div>
            <div className="actions">
              <button type="submit" className="cta" id="next">Next <span className="dot">→</span></button>
              <span className="note">The calendar opens next. Nothing is booked yet.</span>
            </div>
          </form>
        </div>
      </section>

      <footer className="grain">
        <div className="wrap rel">
          <div className="foot">
            <span>ChatturAi</span><span>Cinematic brand films from $3,000</span><span>Delivered in 15 days</span>
          </div>
        </div>
      </footer>

      <div id="pageLoader" className={loading ? 'page-loader show' : 'page-loader'}>
        <div className="loader-box">
          <div className="spinner"></div>
          <h3>Please wait...</h3>
          <p>Saving your details &amp; loading calendar.</p>
        </div>
      </div>
    </>
  );
}
