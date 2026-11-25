import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CALENDLY } from './Bits';

export function Nav5() {
  const [up, setUp] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setUp(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const k = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);
  const cls = ({ isActive }) => (isActive ? 'on' : undefined);
  return (
    <>
      <header className={up || open ? 'n5 up' : 'n5'}>
        <div className="wrap n5-in">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            <img src="/themes/advanced/img/logo.svg" alt="" width="28" height="28" />
            <span>ChatturAi</span>
          </Link>
          <nav className="n5-links" aria-label="Main">
            <NavLink to="/portfolio" className={cls}>Work</NavLink>
            <NavLink to="/about-us" className={cls}>Studio</NavLink>
            <a href={CALENDLY} target="_blank" rel="noopener">Book a call</a>
            <Link to="/contact" className="b b-ink">Send your script</Link>
          </nav>
          <button className={open ? 'burger5 on' : 'burger5'} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span></span><span></span></button>
        </div>
      </header>
      <div className="sheet5" hidden={!open} onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <Link to="/">Home</Link>
        <Link to="/portfolio">Work</Link>
        <Link to="/about-us">Studio</Link>
        <Link to="/contact">Send your script</Link>
        <small>contact@chatturai.com · India, working worldwide</small>
      </div>
    </>
  );
}

export function End5() {
  return (
    <section className="end5">
      <div className="wrap">
        <span className="fade">FADE OUT.</span>
        <h2 data-r="">Every film here started as a page. Send us yours.</h2>
        <div className="row" data-r="" style={{ '--i': 1 }}>
          <Link to="/contact" className="b b-ink">Send your script</Link>
          <a href={CALENDLY} target="_blank" rel="noopener" className="b b-line">Book a 20 minute call</a>
          <a className="mail tlink" style={{ backgroundImage: 'none' }} href="mailto:contact@chatturai.com">contact@chatturai.com</a>
        </div>
        <div className="foot5">
          <span className="out">THE END · ChatturAi, India, working worldwide</span>
          <nav aria-label="Footer">
            <Link to="/portfolio">Work</Link>
            <Link to="/about-us">Studio</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://www.instagram.com/chatturai_official/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.linkedin.com/in/nitish-kalra-b21182132/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://www.youtube.com/channel/UCrGMhxRbUX2yg54XFSbaKSQ" target="_blank" rel="noopener">YouTube</a>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-condition">Terms</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
