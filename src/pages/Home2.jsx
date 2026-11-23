import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CALENDLY, TEAM } from '../components/Bits';

const REEL_ID = 'BSLUOz3mUM3EUbX22Zbf00mZBKC029cZBhPVbZsIAavCY';
const HERO_SRC = `https://player.mux.com/${REEL_ID}?metadata-video-title=showreel&video-title=showreel&autoplay=true&muted=true&loop=true&controls=false`;
const REEL_FULL = `https://player.mux.com/${REEL_ID}?metadata-video-title=showreel&video-title=showreel&autoplay=true`;
const HERO_POSTER = `https://image.mux.com/${REEL_ID}/thumbnail.webp?time=0&width=1920`;

const FILMS = [
  { title: 'The Promise', kind: 'Brand film', img: '/media/img/decath_promise.png',
    src: 'https://player.mux.com/9ePbcwpZJGkcscFAVV8EB01fx3aHY8wR01ExJvtYpqiMs?metadata-video-title=The%20Promise&video-title=The%20Promise&autoplay=true',
    note: 'An emotionally heavy ascent up a treacherous snowy peak. The hardest part was keeping harsh snow dynamics and raw facial expressions consistent from shot to shot.' },
  { title: 'The Face-Off', kind: 'Nike spec ad', img: '/media/img/nike_shoes.jpg',
    src: 'https://player.mux.com/nNq5wLb00Kb9ihFatUZRG2T02LkAiwf3deENHgo1x8vmA?metadata-video-title=The%20Face-Off&video-title=The%20Face-Off&autoplay=true',
    note: 'A high-speed rivalry between two shoes racing to be picked by a player, each with its own personality and believable motion physics across extreme environments.' },
  { title: 'The Double Magic', kind: 'AI cosmetics ad', img: '/media/img/beauty.jpg',
    src: 'https://player.mux.com/meomhCyllhtuY3xZadHeu7TXu02CpN3vGI4PBPpuKtiw?metadata-video-title=The%20Double%20Magic&video-title=The%20Double%20Magic&autoplay=true',
    note: 'A hyper-realistic cosmetics commercial. Glossy jelly, melting butter and flawless skin close-ups all had to read as photographed.' },
];

const STRIP = Array.from({ length: 14 }, (_, i) => `/media/t/t_${i + 1}.png`);
const CRAFTS = ['Treatment', 'Shot design', 'Storyboard', 'Character', 'World', 'Cinemato­graphy', 'Generation', 'Edit', 'Colour', 'Sound', 'Score', 'Voice'];
const PLANS = [
  { name: 'Brand films', price: '$3,000', items: ['1 to 3 minutes', 'Delivered in 15 days', 'Two revision rounds built in'], hot: true },
  { name: 'Feature films', price: '$30,000', items: ['60 to 90 minutes', 'Timelines in months', 'Original score and world building'] },
  { name: 'Concept development', price: '$750', items: ['A 1 to 3 minute script', 'Treatment and shot design', 'Credited against the film'] },
];

function Hero() {
  const frame = useRef(null);
  const [reel, setReel] = useState(false);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
    f.src = HERO_SRC;
  }, []);
  useEffect(() => {
    if (!reel) return;
    const k = (e) => e.key === 'Escape' && setReel(false);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [reel]);

  return (
    <section className="hero3" aria-label="Showreel">
      <div className="hero3-media">
        <img src={HERO_POSTER} alt="" fetchPriority="high" />
        <iframe ref={frame} title="ChatturAi showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe>
      </div>
      <div className="hero3-shade"></div>
      <div className="hero3-tag"><i></i>Cinematic AI films</div>
      <div className="hero3-in">
        <div className="shell">
          <h1 className="title">
            <span className="ln"><span>For brands,</span></span>
            <span className="ln"><span>writers and</span></span>
            <span className="ln"><span>producers.</span></span>
          </h1>
          <div className="hero3-row">
            <p>You bring what you have written. We build everything after it.</p>
            <div className="hero3-actions">
              <button type="button" className="reel-btn" onClick={() => setReel(true)}><i aria-hidden="true"></i>Play showreel</button>
              <Link className="btn btn-lime" to="/contact">Talk to us</Link>
            </div>
          </div>
        </div>
      </div>
      {reel && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Showreel" onClick={(e) => e.target === e.currentTarget && setReel(false)}>
          <button className="modal-x" onClick={() => setReel(false)} aria-label="Close showreel">✕</button>
          <div className="modal-frame">
            <iframe src={REEL_FULL} title="ChatturAi showreel" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )}
    </section>
  );
}

function Filmstrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-track">
        {[...STRIP, ...STRIP].map((src, i) => <img key={i} src={src} alt="" loading="lazy" decoding="async" />)}
      </div>
    </div>
  );
}

function Work() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(null);
  const pick = (i) => { setActive(i); if (playing !== i) setPlaying(null); };
  const f = FILMS[active];
  return (
    <section className="sec" id="work">
      <div className="shell">
        <div className="sec-head">
          <h2 className="title">Selected work</h2>
          <p>Brand films, feature trailers and reels. Every one of them started as words in a document.</p>
        </div>
        <div className="viewer">
          <div className="viewer-list">
            {FILMS.map((x, i) => (
              <button key={x.title} type="button" className={i === active ? 'vi on' : 'vi'} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)} aria-pressed={i === active}>
                <h3>{x.title}</h3>
                <span className="k">{x.kind}</span>
                <p>{x.note}</p>
              </button>
            ))}
          </div>
          <div className="viewer-stage">
            {FILMS.map((x, i) => <img key={x.title} src={x.img} alt="" className={i === active ? 'on' : ''} loading={i ? 'lazy' : undefined} />)}
            {playing === active ? (
              <iframe src={f.src} title={f.title} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>
            ) : (
              <button type="button" className="stage-play" onClick={() => setPlaying(active)} aria-label={`Play ${f.title}`}>
                <span><i aria-hidden="true"></i>Play {f.title}</span>
              </button>
            )}
          </div>
        </div>
        <div className="viewer-foot">
          <Link className="btn btn-ghost" to="/portfolio">See all 18 films</Link>
          <span>Brand films, feature trailers and reels</span>
        </div>
      </div>
    </section>
  );
}

function Craft() {
  return (
    <section className="sec craft" id="craft">
      <div className="shell">
        <h2 className="title">Made with AI.<span>Not by AI.</span></h2>
        <div className="timeline" role="img" aria-label="Twelve crafts on an edit timeline. Generation is the only one the tools do.">
          <div className="ruler" aria-hidden="true">
            {CRAFTS.map((_, i) => <span key={i} className="tnum">{`00:${String(i * 5).padStart(2, '0')}`}</span>)}
          </div>
          <div className="track">
            <div className="playhead" aria-hidden="true"></div>
            {CRAFTS.map((c) => <div key={c} className={c === 'Generation' ? 'clip ai' : 'clip'}>{c}</div>)}
          </div>
          <div className="track-label"><span>Twelve crafts go into every film</span><b>The tools do one</b></div>
        </div>
        <div className="cols">
          <div className="copy">
            <p>People do the other eleven. Character consistency and world consistency are where almost every AI video falls apart: a face that shifts between shots, a jacket that changes colour, a room that isn't the same room. Holding those still is the work.</p>
          </div>
          <div className="copy">
            <p>What disappeared was the trucks, the crew, the locations and the six week schedule. What did not disappear was the treatment, the shot design, the grade, the mix and the score.</p>
            <p><strong>You describe the place. We build it.</strong> Nothing is shot by you, and nothing needs to exist before we start.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Voice() {
  const [play, setPlay] = useState(false);
  return (
    <section className="sec">
      <div className="shell">
        <div className="voice">
          <img src="/media/img/testimonials.png" alt="" loading="lazy" />
          <div className="voice-shade"></div>
          {play && <iframe src="https://player.mux.com/SjU4vrR02H1fMBVEWqxvbCPF02qlXJMYfD3kZi8vk2vt4?metadata-video-title=1&video-title=1&thumbnail-time=2&autoplay=true" title="Client testimonial" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>}
          <div className="voice-in">
            <blockquote>You guys were actually more expensive than my other option. And I still came back.</blockquote>
            <p className="more">"The whole story just got put together, and I could never have done that myself. I couldn't have done that story myself in any other way."</p>
            <div className="voice-foot">
              <button type="button" className="reel-btn" onClick={() => setPlay(true)}><i aria-hidden="true"></i>Watch the testimonial</button>
              <cite>Carlos Reyes <span>· Nashville</span></cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="sec paper">
      <div className="shell">
        <div className="sec-head">
          <h2 className="title">What we take on</h2>
          <p>Starting prices, not fixed prices. Your exact quote comes on the call, after we read your script.</p>
        </div>
        <div className="plans">
          {PLANS.map((p) => (
            <div key={p.name} className={p.hot ? 'plan hot' : 'plan'}>
              <h3>{p.name}</h3>
              <span className="from">Starts from</span>
              <div className="price tnum">{p.price}</div>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <Link className={p.hot ? 'btn btn-ink' : 'btn btn-lime'} to="/contact">Get a quote</Link>
            </div>
          ))}
        </div>
        <div className="plans-note">
          <p>Complexity decides the number, not duration. One character in one world is straightforward. Three characters across four eras, each recognisable in every shot, is a different order of work.</p>
          <a className="link" href={CALENDLY} target="_blank" rel="noopener">Book a 20 minute call</a>
        </div>
      </div>
    </section>
  );
}

function Studio() {
  return (
    <section className="sec" id="studio">
      <div className="shell">
        <div className="studio-row">
          <h2 className="title" style={{ fontSize: 'clamp(58px,8vw,128px)' }}>The studio</h2>
          <div>
            <p className="lead">A small film studio. Ten people making cinematic brand films and full feature films, with AI as one tool inside a normal film process.</p>
            <div className="copy">
              <p>Founders kept showing us concepts they had written and could not afford to make. The idea was already good. What was missing was a crew, so we built one that works differently.</p>
            </div>
          </div>
        </div>
        <div className="team3">
          {TEAM.map(([file, name, role]) => (
            <figure className="person" key={name}>
              <img src={`https://chatturai.com/media/team/${file}`} alt={name} loading="lazy" />
              <figcaption><b>{name}</b><span>{role}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="viewer-foot">
          <Link className="btn btn-ghost" to="/about-us">More about the studio</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home2() {
  return (
    <main>
      <Hero />
      <Filmstrip />
      <Work />
      <Craft />
      <Voice />
      <Pricing />
      <Studio />
    </main>
  );
}
