// Version 1 — Editorial: paper-first, magazine typography, framed showreel
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lines, VideoModal } from '../components/Chrome2';
import { CALENDLY, TEAM } from '../components/Bits';
import { FILMS, HERO_SRC, HERO_POSTER, REEL_FULL, PLANS, Craft } from './Home2';

export function useBodyFlag(flag) {
  useEffect(() => {
    document.body.classList.add(flag);
    return () => document.body.classList.remove(flag);
  }, [flag]);
}

export default function HomeA() {
  const frame = useRef(null);
  const [reel, setReel] = useState(false);
  const [film, setFilm] = useState(null);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
    f.src = HERO_SRC;
  }, []);

  return (
    <main className="va">
      <section className="va-hero shell">
        <div className="va-meta" data-r="fade">
          <span>ChatturAi Studio</span><span>Cinematic AI films</span><span>India, working worldwide</span>
        </div>
        <Lines as="h1" className="title" lines={['For brands,', 'writers and', 'producers.']} />
        <div className="va-sub">
          <p data-r="">You bring what you have written. <br />We build everything after it.</p>
          <div className="va-cta" data-r="" style={{ '--i': 1 }}>
            <Link className="btn btn-ink" to="/contact">Talk to us</Link>
            <a className="va-link" href={CALENDLY} target="_blank" rel="noopener">Book a 20 minute call</a>
          </div>
        </div>
        <div className="va-window" data-r="scale">
          <img src={HERO_POSTER} alt="" />
          <iframe ref={frame} title="ChatturAi showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe>
          <button className="va-play" onClick={() => setReel(true)}><i aria-hidden="true"></i>Watch the showreel with sound</button>
        </div>
      </section>

      <section className="va-work shell">
        <div className="va-head">
          <Lines lines={['Selected work']} />
          <Link className="va-link" to="/portfolio" data-r="">All 18 films</Link>
        </div>
        <div className="va-films">
          {FILMS.map((f, i) => (
            <article key={f.title} className={i === 0 ? 'va-film big' : 'va-film'} data-r="" style={{ '--i': i }}>
              <button className="va-thumb" onClick={() => setFilm(f)} aria-label={`Play ${f.title}`}>
                <img src={f.img} alt="" loading="lazy" />
                <span className="va-badge">Play</span>
              </button>
              <div className="va-cap">
                <span className="va-kind">{f.kind}</span>
                <h3>{f.title}</h3>
                <p>{f.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="va-dark"><Craft /></div>

      <section className="va-quote shell">
        <blockquote data-r="">"You guys were actually more expensive than my other option. And I still came back."</blockquote>
        <p data-r="" style={{ '--i': 1 }}>Carlos Reyes, Nashville, on his first call</p>
      </section>

      <section className="va-price shell">
        <div className="va-head"><Lines lines={['What we take on']} /></div>
        <div className="va-rows">
          {PLANS.map((p, i) => (
            <div className="va-row" key={p.name} data-r="" style={{ '--i': i }}>
              <h3>{p.name}</h3>
              <span>{p.items.join(' · ')}</span>
              <b className="tnum"><small>from</small>{p.price}</b>
            </div>
          ))}
        </div>
        <p className="va-note" data-r="">Starting prices, not fixed prices. Your exact quote comes on the call, after we read your script.</p>
      </section>

      <section className="va-team shell">
        <div className="va-head"><Lines lines={['The studio']} /><p data-r="">Ten people. These are the five you will speak to.</p></div>
        <div className="va-people">
          {TEAM.map(([file, name, role], i) => (
            <figure key={name} data-r="" style={{ '--i': i }}>
              <img src={`https://chatturai.com/media/team/${file}`} alt={name} loading="lazy" />
              <figcaption><b>{name}</b>{role}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {reel && <VideoModal src={REEL_FULL} title="ChatturAi showreel" onClose={() => setReel(false)} />}
      {film && <VideoModal src={film.src} title={film.title} onClose={() => setFilm(null)} />}
    </main>
  );
}
