import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageFor } from '../seo';
import { Nav2, Footer2 } from './Chrome2';
import { Nav5, End5 } from './Chrome5';

/* Page plumbing: body class, title, scroll reset, pixel, scroll reveals, hero parallax */
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
      if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
    }
    first.current = false;
  }, [pathname]);

  // reveal anything marked data-r (and edit-timeline tracks) as it scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const scan = () => document.querySelectorAll('[data-r]:not(.in), .track:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  // hero parallax: --hp goes 0 → 1 over the first screen of scroll
  useEffect(() => {
    const hero = document.querySelector('.hero3');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => hero.style.setProperty('--hp', Math.min(1, window.scrollY / window.innerHeight).toFixed(3))); };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [pathname]);
}

export default function Layout() {
  usePageEffects();
  const { pathname } = useLocation();
  if (pageFor(pathname).body.includes('v5')) {
    return (
      <>
        <Nav5 />
        <Outlet />
        <End5 />
      </>
    );
  }
  return (
    <>
      <Nav2 />
      <Outlet />
      <Footer2 />
    </>
  );
}
