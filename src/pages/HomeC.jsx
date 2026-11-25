// Version 3 — Bento: the whole studio on one screen, then the details
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lines, VideoModal, CountUp } from '../components/Chrome2';
import { CALENDLY, TEAM } from '../components/Bits';
import { FILMS, HERO_SRC, HERO_POSTER, REEL_FULL, PLANS, Craft } from './Home2';

export default function HomeC() {
  const frame = useRef(null);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
    f.src = HERO_SRC;
  }, []);

  return (
    <main className="vc">
      <section className="shell vc-bento">
        <div className="vc-t vc-reel" data-r="scale">
          <img src={HERO_POSTER} alt="" />
          <iframe ref={frame} title="Showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe>
          <div className="vc-reel-in">
            <h1 className="title">For brands, writers and producers.</h1>
            <button type="button" className="reel-btn" onClick={() => setVideo({ src: REEL_FULL, title: 'Showreel' })}><i aria-hidden="true"></i>Play showreel</button>
          </div>
        </div>
        <Link to="/contact" className="vc-t vc-lime" data-r="scale" style={{ '--i': 1 }}>
          <span>Have a script or a concept?</span>
          <b className="title">Talk to us</b>
          <i aria-hidden="true">↗</i>
        </Link>
        <div className="vc-t vc-stat" data-r="scale" style={{ '--i': 2 }}>
          <CountUp to={100} suffix="+" /><span>films delivered since 2025</span>
        </div>
        <div className="vc-t vc-price" data-r="scale" style={{ '--i': 3 }}>
          <span>Brand films from</span><b className="title tnum">$3,000</b><span>Delivered in 15 days</span>
        </div>
        <div className="vc-t vc-team" data-r="scale" style={{ '--i': 4 }}>
          <div className="vc-faces">{TEAM.map(([f, n]) => <img key={n} src={`https://chatturai.com/media/team/${f}`} alt={n} />)}</div>
          <span>Ten people. A real film crew, with AI as one tool.</span>
        </div>
        <div className="vc-t vc-quote" data-r="scale" style={{ '--i': 5 }}>
          <p>"More expensive than my other option. And I still came back."</p>
          <span>Carlos Reyes, Nashville</span>
        </div>
      </section>

      <section className="shell sec vc-work">
        <div className="sec-head">
          <Lines lines={['Selected work']} />
          <p data-r="">Brand films, feature trailers and reels.</p>
        </div>
        <div className="vc-grid">
          {FILMS.map((f, i) => (
            <button key={f.title} className="vc-film" onClick={() => setVideo(f)} data-r="" style={{ '--i': i }}>
              <img src={f.img} alt="" loading="lazy" />
              <span className="vc-film-cap"><b>{f.title}</b><small>{f.kind}</small></span>
              <span className="vc-film-note">{f.note}</span>
            </button>
          ))}
          <Link to="/portfolio" className="vc-film vc-all" data-r="" style={{ '--i': 3 }}>
            <b className="title">18</b><span>See all films, trailers and reels ↗</span>
          </Link>
        </div>
      </section>

      <Craft />

      <section className="shell sec">
        <div className="sec-head"><Lines lines={['What we take on']} /><p data-r="">Starting prices. The exact quote comes after we read your script.</p></div>
        <div className="vc-plans">
          {PLANS.map((p, i) => (
            <div key={p.name} className={p.hot ? 'vc-t vc-plan hot' : 'vc-t vc-plan'} data-r="" style={{ '--i': i }}>
              <h3>{p.name}</h3>
              <b className="title tnum">{p.price}</b>
              <ul>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
          <a className="vc-t vc-call" href={CALENDLY} target="_blank" rel="noopener" data-r="" style={{ '--i': 3 }}>
            <span>Already know what you want made?</span><b>Book a 20 minute call ↗</b>
          </a>
        </div>
      </section>

      {video && <VideoModal src={video.src} title={video.title} onClose={() => setVideo(null)} />}
    </main>
  );
}
