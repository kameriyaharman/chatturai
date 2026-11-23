import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { pageFor } from '../seo';
import { Nav2, Footer2 } from './Chrome2';

/* ══ NAV + MOBILE MENU (was nav.js) ══ */
function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  // home.js: nav gets "stuck" class after 40px of scroll
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onMenuClick = (e) => {
    if (e.target.tagName === 'A' || e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {/* ══ NAV ══ */}
      <nav className={stuck ? 'nav stuck' : 'nav'} id="nav">
        <div className="wrap nav-in">
          <Link className="brand" to="/">
            <img src="/themes/advanced/img/logo.svg" width="30" height="30" alt="ChatturAi" />
            <b>CHATTURAI</b>
          </Link>
          <div className="links">
            <Link to="/portfolio">Work</Link>
            <Link to="/about-us">About us</Link>
            <Link className="cta-s" to="/contact">Talk to us</Link>
          </div>
          <button
            className={open ? 'burger on' : 'burger'}
            id="burger"
            aria-label="Menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen((o) => !o)}
          >
            <span></span><span></span>
          </button>
        </div>
      </nav>
      <div className="menu" id="menu" hidden={!open} onClick={onMenuClick}>
        <div className="menu-in">
          <Link to="/">Home</Link>
          <Link to="/portfolio">Work</Link>
          <Link to="/about-us">About us</Link>
          <Link to="/contact">Talk to us</Link>
          <div className="menu-foot">
            <a href="mailto:contact@chatturai.com">contact@chatturai.com</a>
            <span>India</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══ 07 · FOOTER ══ */
function Footer() {
  return (
    <footer className="grain">
      <div className="wrap rel">
        <div className="foot-top">
          <div>
            <div className="eyebrow">Reach us at</div>
            <a className="foot-mail" href="mailto:contact@chatturai.com">contact@chatturai.com</a>
          </div>
          <div className="foot-cols">
            <div className="fc">
              <b>Site</b>
              <Link to="/">Home</Link>
              <Link to="/portfolio">Work</Link>
              <Link to="/about-us">About us</Link>
              <Link to="/contact">Talk to us</Link>
            </div>
            <div className="fc">
              <b>Elsewhere</b>
              <a href="https://www.instagram.com/chatturai_official/" target="_blank" rel="noopener">Instagram</a>
              <a href="https://www.linkedin.com/in/nitish-kalra-b21182132/" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://www.youtube.com/channel/UCrGMhxRbUX2yg54XFSbaKSQ" target="_blank" rel="noopener">YouTube</a>
            </div>
          </div>
        </div>
        <div className="foot-bot">
          <span>ChatturAi · Cinematic AI films</span>
          <span>India</span>
          <span>© All rights reserved</span>
        </div>
        <div className="foot-legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-condition">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

/* ══ Page plumbing: body class, title, scroll, reveal-on-scroll (home.js), pixel ══ */
function usePageEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const page = pageFor(pathname);
    document.body.className = page.body;
    document.title = page.title;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', page.description);

    if (!first.current) {
      if (!hash) window.scrollTo(0, 0);
      // Old site fired a PageView on every page load — keep that on SPA navigation
      if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
    }
    first.current = false;

    // home.js: .rv elements fade in when they enter the viewport
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    document.querySelectorAll('.rv').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 3, 2) * 80 + 'ms';
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
}

export default function Layout() {
  usePageEffects();
  const { pathname } = useLocation();
  if (pageFor(pathname).body === 'v2') {
    return (
      <>
        <Nav2 />
        <Outlet />
        <Footer2 />
      </>
    );
  }
  return (
    <>
      <Nav />
      <div id="notifications"></div>
      <Outlet />
      <Footer />
    </>
  );
}
