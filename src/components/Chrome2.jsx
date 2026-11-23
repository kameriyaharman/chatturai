import { useEffect, useRef, useState } from 'react';
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
            <Link className="btn btn-lime" to="/contact">Talk to us</Link>
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
        <div className="band-marquee" aria-hidden="true">
          <div>{[0, 1].map((k) => (
            <span key={k}><span>Brand films</span><span>Feature films</span><span>Trailers</span><span>Reels</span><span>Concept development</span><span>Brand films</span><span>Feature films</span><span>Trailers</span><span>Reels</span><span>Concept development</span></span>
          ))}</div>
        </div>
        <div className="shell">
          <Lines as="h2" className="title" lines={['Tell us the idea.', 'We build everything', 'after it.']} />
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

/* Headline that rises in line by line when scrolled into view */
export function Lines({ as: Tag = 'h2', lines, className = 'title', style }) {
  return (
    <Tag className={className} style={style} data-r="lines">
      {lines.map((l, i) => <span className="ln" key={i} style={{ '--l': i }}><span>{l}</span></span>)}
    </Tag>
  );
}

/* Count up to a number when it scrolls into view */
export function CountUp({ to, suffix = '' }) {
  const el = useRef(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now(); const dur = 1600;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [to]);
  return <b ref={el} className="tnum">{n}{suffix}</b>;
}

/* Full-screen video player */
export function VideoModal({ src, title, vertical, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="modal-x" onClick={onClose} aria-label="Close video">✕</button>
      <div className={vertical ? 'modal-frame v' : 'modal-frame'}>
        <iframe src={src} title={title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>
      </div>
    </div>
  );
}
