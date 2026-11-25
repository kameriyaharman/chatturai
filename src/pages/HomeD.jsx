// Version 4 — Director's Cut: full-screen scenes that stack over each other as you scroll
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { VideoModal } from '../components/Chrome2';
import { FILMS, HERO_SRC, HERO_POSTER, REEL_FULL, Craft, Pricing, Studio } from './Home2';

/* each scene dims and shrinks a little as the next one slides over it */
function useSceneDepth() {
  useEffect(() => {
    const scenes = [...document.querySelectorAll('.vd-scene')];
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => scenes.forEach((s, i) => {
        const next = scenes[i + 1];
        if (!next) return;
        const r = next.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, 1 - r.top / window.innerHeight));
        s.style.setProperty('--d', p.toFixed(3));
      }));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);
}

export default function HomeD() {
  useSceneDepth();
  const frame = useRef(null);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
    f.src = HERO_SRC;
  }, []);

  return (
    <main className="vd">
      <div className="vd-stack">
        <section className="vd-scene vd-open">
          <div className="hero3-media"><img src={HERO_POSTER} alt="" /><iframe ref={frame} title="Showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe></div>
          <div className="vd-shade"></div>
          <div className="vd-slate" aria-hidden="true"><span>Scene 01</span><span>Take 1</span><span>ChatturAi</span></div>
          <div className="shell vd-copy">
            <h1 className="title vd-title"><span>For brands,</span> <span>writers and</span> <span>producers.</span></h1>
            <p>You bring what you have written. We build everything after it.</p>
            <div className="hero3-actions">
              <button type="button" className="reel-btn" onClick={() => setVideo({ src: REEL_FULL, title: 'Showreel' })}><i aria-hidden="true"></i>Play showreel</button>
              <Link className="btn btn-lime" to="/contact">Talk to us</Link>
            </div>
          </div>
          <div className="vd-hint" aria-hidden="true">Scroll for the next scene</div>
        </section>

        {FILMS.map((f, i) => (
          <section className="vd-scene vd-film" key={f.title}>
            <img className="vd-bg" src={f.img} alt="" loading="lazy" />
            <div className="vd-shade"></div>
            <div className="vd-slate" aria-hidden="true"><span>{`Scene 0${i + 2}`}</span><span>{f.kind}</span><span>ChatturAi</span></div>
            <div className="shell vd-copy">
              <h2 className="title">{f.title}</h2>
              <p>{f.note}</p>
              <div className="hero3-actions">
                <button type="button" className="reel-btn" onClick={() => setVideo(f)}><i aria-hidden="true"></i>Play the film</button>
                {i === FILMS.length - 1 && <Link className="btn btn-ghost" to="/portfolio">See all 18 films</Link>}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="vd-after">
        <Craft />
        <Pricing />
        <Studio />
      </div>

      {video && <VideoModal src={video.src} title={video.title} onClose={() => setVideo(null)} />}
    </main>
  );
}
