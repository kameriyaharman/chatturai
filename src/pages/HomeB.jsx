// Version 2 — Kinetic: rotating words, giant marquee, horizontal film scroll
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lines, VideoModal } from '../components/Chrome2';
import { FILMS, HERO_SRC, HERO_POSTER, REEL_FULL, STRIP, Craft, Pricing, Studio } from './Home2';

const WORDS = ['brands.', 'writers.', 'producers.'];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="vb-rot" aria-live="polite">
      {WORDS.map((w, k) => <span key={w} className={k === i ? 'on' : k === (i + WORDS.length - 1) % WORDS.length ? 'out' : ''}>{w}</span>)}
    </span>
  );
}

/* Vertical scroll drives a horizontal film rail */
function Rail({ onPlay }) {
  const wrap = useRef(null);
  const track = useRef(null);
  useEffect(() => {
    const w = wrap.current, t = track.current;
    if (!w || !t) return;
    let raf = 0;
    const size = () => { w.style.height = `${t.scrollWidth - window.innerWidth + window.innerHeight}px`; };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = w.getBoundingClientRect();
        const max = t.scrollWidth - window.innerWidth;
        const p = Math.max(0, Math.min(1, -r.top / (w.offsetHeight - window.innerHeight)));
        t.style.transform = `translate3d(${-p * max}px,0,0)`;
      });
    };
    const onResize = () => { size(); on(); };
    size(); on();
    const imgs = [...t.querySelectorAll('img')];
    imgs.forEach((im) => im.addEventListener('load', onResize));
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', onResize); imgs.forEach((im) => im.removeEventListener('load', onResize)); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="vb-rail" ref={wrap}>
      <div className="vb-sticky">
        <div className="vb-track" ref={track}>
          <div className="vb-intro">
            <Lines lines={['Selected', 'work']} />
            <p>Keep scrolling. Every one of these started as words in a document.</p>
          </div>
          {FILMS.map((f) => (
            <article key={f.title} className="vb-card">
              <button className="vb-img" onClick={() => onPlay(f)} aria-label={`Play ${f.title}`}><img src={f.img} alt="" loading="lazy" /><i aria-hidden="true"></i></button>
              <div className="vb-meta"><h3>{f.title}</h3><span>{f.kind}</span></div>
              <p>{f.note}</p>
            </article>
          ))}
          <div className="vb-more">
            <Link to="/portfolio" className="btn btn-lime">See all 18 films</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeB() {
  const frame = useRef(null);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
    f.src = HERO_SRC;
  }, []);

  return (
    <main className="vb">
      <section className="vb-hero">
        <div className="hero3-media"><img src={HERO_POSTER} alt="" /><iframe ref={frame} title="Showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe></div>
        <div className="vb-shade"></div>
        <div className="vb-giant" aria-hidden="true"><div>{[0, 1].map((k) => <span key={k}>ChatturAi&nbsp;·&nbsp;ChatturAi&nbsp;·&nbsp;</span>)}</div></div>
        <div className="shell vb-copy">
          <h1 className="title">Cinematic AI films for <Rotator /></h1>
          <div className="vb-row">
            <p>You bring what you have written. We build everything after it.</p>
            <div className="hero3-actions">
              <button type="button" className="reel-btn" onClick={() => setVideo({ src: REEL_FULL, title: 'Showreel' })}><i aria-hidden="true"></i>Play showreel</button>
              <Link className="btn btn-lime" to="/contact">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="vb-ticker" aria-hidden="true">
        <div>{[0, 1].map((k) => <span key={k}>{['Treatment', 'Shot design', 'Character', 'World', 'Generation', 'Edit', 'Colour', 'Sound', 'Score'].map((w) => <em key={w}>{w}</em>)}</span>)}</div>
      </div>

      <Rail onPlay={(f) => setVideo(f)} />

      <div className="vb-stills" aria-hidden="true">
        {STRIP.slice(0, 8).map((s, i) => <img key={i} src={s} alt="" loading="lazy" style={{ '--i': i }} data-r="scale" />)}
      </div>

      <Craft />
      <Pricing />
      <Studio />

      {video && <VideoModal src={video.src} title={video.title} onClose={() => setVideo(null)} />}
    </main>
  );
}
