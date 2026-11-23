import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CALENDLY } from './Bits';

export function Nav2() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
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
      <header className={scrolled || open ? 'nav2 scrolled' : 'nav2'}>
        <div className="shell nav2-in">
          <Link className="mark" to="/" onClick={() => setOpen(false)}>
            <img src="/themes/advanced/img/logo.svg" width="28" height="28" alt="" />
            <span>ChatturAi</span>
          </Link>
          <nav className="nav2-links" aria-label="Main">
            <NavLink to="/portfolio" className={cls}>Work</NavLink>
            <NavLink to="/about-us" className={cls}>Studio</NavLink>
            <Link className="btn btn-lit" to="/contact">Talk to us</Link>
          </nav>
          <button className={open ? 'burger2 on' : 'burger2'} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span></span><span></span>
          </button>
        </div>
      </header>
      <div className="sheet" hidden={!open} onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <Link to="/">Home</Link>
        <Link to="/portfolio">Work</Link>
        <Link to="/about-us">Studio</Link>
        <Link to="/contact">Talk to us</Link>
        <div className="sheet-foot">
          <a href="mailto:contact@chatturai.com">contact@chatturai.com</a><br />India, working worldwide
        </div>
      </div>
    </>
  );
}

export function Footer2() {
  return (
    <>
      <section className="band">
        <div className="shell">
          <h2 className="title">Tell us the idea. We build everything after it.</h2>
          <div className="band-row">
            <p>Whatever stage it is at, a concept, a script or a rough thought. Write to <a className="mail" href="mailto:contact@chatturai.com">contact@chatturai.com</a> or start here.</p>
            <div className="btns">
              <Link className="btn btn-ink" to="/contact">Talk to us</Link>
              <a className="btn btn-line" href={CALENDLY} target="_blank" rel="noopener">Book a 20 minute call</a>
            </div>
          </div>
        </div>
      </section>
      <footer className="foot3">
        <div className="shell foot3-in">
          <span>© ChatturAi · Cinematic AI films · India, working worldwide</span>
          <nav aria-label="Footer">
            <Link to="/portfolio">Work</Link>
            <Link to="/about-us">Studio</Link>
            <Link to="/contact">Talk to us</Link>
            <a href="https://www.instagram.com/chatturai_official/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.linkedin.com/in/nitish-kalra-b21182132/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://www.youtube.com/channel/UCrGMhxRbUX2yg54XFSbaKSQ" target="_blank" rel="noopener">YouTube</a>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-condition">Terms</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
