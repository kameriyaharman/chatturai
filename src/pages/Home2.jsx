import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CALENDLY, TEAM } from '../components/Bits';

const HERO_SRC =
  'https://player.mux.com/BSLUOz3mUM3EUbX22Zbf00mZBKC029cZBhPVbZsIAavCY?metadata-video-title=showreel&video-title=showreel&autoplay=true&muted=true&loop=true&controls=false';
const HERO_POSTER = 'https://image.mux.com/BSLUOz3mUM3EUbX22Zbf00mZBKC029cZBhPVbZsIAavCY/thumbnail.webp?time=0&width=1920';

const FILMS = [
  { title: 'The Promise', kind: 'Brand film', img: '/media/img/decath_promise.png',
    src: 'https://player.mux.com/9ePbcwpZJGkcscFAVV8EB01fx3aHY8wR01ExJvtYpqiMs?metadata-video-title=The%20Promise&video-title=The%20Promise&autoplay=true',
    note: 'An emotionally heavy ascent up a snowbound peak. The hard part was keeping harsh snow dynamics and raw facial expression consistent from shot to shot.' },
  { title: 'The Face-Off', kind: 'Nike spec ad', img: '/media/img/nike_shoes.jpg',
    src: 'https://player.mux.com/nNq5wLb00Kb9ihFatUZRG2T02LkAiwf3deENHgo1x8vmA?metadata-video-title=The%20Face-Off&video-title=The%20Face-Off&autoplay=true',
    note: 'Two shoes race to be picked by a player. Each needed its own personality and believable motion physics across changing extreme environments.' },
  { title: 'The Double Magic', kind: 'AI cosmetics ad', img: '/media/img/beauty.jpg',
    src: 'https://player.mux.com/meomhCyllhtuY3xZadHeu7TXu02CpN3vGI4PBPpuKtiw?metadata-video-title=The%20Double%20Magic&video-title=The%20Double%20Magic&autoplay=true',
    note: 'A hyper-real commercial blending makeup and skincare. Glossy jelly, melting butter and flawless skin close-ups all had to read as photographed.' },
];

const CRAFTS = ['Treatment', 'Shot design', 'Storyboard', 'Character', 'World', 'Cinematography', 'Generation', 'Edit', 'Colour', 'Sound', 'Score', 'Voice'];

const SCOPE = [
  ['Brand films', '$3,000', '1 to 3 minutes', 'Delivered in 15 days'],
  ['Feature films', '$30,000', '60 to 90 minutes', 'Timelines in months'],
  ['Concept development', '$750', 'A 1 to 3 minute script', 'Credited against the film'],
];

/* Click-to-play: poster first, the real player only when asked */
export function Shot({ f, wide }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="shot-frame" style={wide ? { aspectRatio: '2.39/1' } : undefined}>
      {play ? (
        <iframe src={f.src} title={f.title} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>
      ) : (
        <button type="button" className="play" onClick={() => setPlay(true)} aria-label={`Play ${f.title}`}>
          <img src={f.img} alt="" loading="lazy" decoding="async" />
          <span className="play-btn"><i aria-hidden="true"></i>{f.label || 'Play film'}</span>
        </button>
      )}
    </div>
  );
}

/* Running camera timecode, 24 fps */
function Timecode() {
  const [t, setT] = useState('00:00:00:00');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = performance.now(); let raf;
    const tick = (now) => {
      const f = Math.floor(((now - start) / 1000) * 24);
      const p = (n) => String(n).padStart(2, '0');
      setT(`${p(Math.floor(f / 86400))}:${p(Math.floor(f / 1440) % 60)}:${p(Math.floor(f / 24) % 60)}:${p(f % 24)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span className="tnum">{t}</span>;
}

function Hero() {
  const frame = useRef(null);
  useEffect(() => {
    const f = frame.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 600), { once: true });
    f.src = HERO_SRC;
  }, []);
  return (
    <section className="hero2" aria-label="Showreel">
      <div className="hero2-media">
        <img src={HERO_POSTER} alt="" fetchPriority="high" />
        <iframe ref={frame} title="ChatturAi showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe>
      </div>
      <div className="hero2-grade"></div>
      <div className="bar-t"></div><div className="bar-b"></div>
      <div className="hud hud-top">
        <span className="rec"><i></i>Showreel</span>
        <Timecode />
      </div>
      <div className="hero2-copy">
        <div className="shell">
          <h1 className="title">Cinematic AI films for brands, writers and producers.</h1>
          <div className="hero2-sub">
            <p>You bring what you have written. We build everything after it.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-lit" to="/contact">Start a film</Link>
              <Link className="btn btn-line" to="/portfolio">See the work</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home2() {
  return (
    <main>
      <Hero />

      {/* Work */}
      <section className="sec" id="work">
        <div className="shell">
          <div className="sec-top">
            <h2 className="title">Selected work</h2>
            <p className="note">Brand films, feature trailers and reels. Every one started as words in a document.</p>
          </div>
          <div className="reel2">
            {FILMS.map((f, i) => (
              <article className="shot" key={f.title}>
                <Shot f={f} wide={i === 0} />
                <div className="shot-meta">
                  <h3>{f.title}</h3>
                  <span className="kind">{f.kind}</span>
                  <p>{f.note}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="reel2-foot">
            <Link className="btn btn-line" to="/portfolio">See all work</Link>
            <span>18 films, trailers and reels in the full portfolio.</span>
          </div>
        </div>
      </section>

      {/* Craft — the edit timeline */}
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
            <div className="body">
              <p>People do the other eleven. Character consistency and world consistency are where almost every AI video falls apart: a face that shifts between shots, a jacket that changes colour, a room that isn't the same room. Holding those still is the work.</p>
            </div>
            <div className="body">
              <p>What disappeared was the trucks, the crew, the locations and the six week schedule. What did not disappear was the treatment, the shot design, the grade, the mix and the score.</p>
              <p><strong>You describe the place. We build it.</strong> Nothing is shot by you, and nothing needs to exist before we start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="sec">
        <div className="shell proof">
          <div>
            <blockquote>You guys were actually more expensive than my other option. And I still came back.</blockquote>
            <p className="more">"The whole story just got put together, and I could never have done that myself. I couldn't have done that story myself in any other way."</p>
            <cite>Carlos Reyes <span>on his first call, Nashville</span></cite>
          </div>
          <Shot f={{ title: 'Client testimonial', label: 'Watch Carlos', img: '/media/img/testimonials.png',
            src: 'https://player.mux.com/SjU4vrR02H1fMBVEWqxvbCPF02qlXJMYfD3kZi8vk2vt4?metadata-video-title=1&video-title=1&thumbnail-time=2&autoplay=true' }} />
        </div>
      </section>

      {/* Pricing — the call sheet */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="sec-top">
            <h2 className="title">What we take on</h2>
            <p className="note">Starting prices. Your exact quote comes on the call, after we read your script.</p>
          </div>
          <table className="callsheet">
            <thead><tr><th scope="col">Project</th><th scope="col">Starts from</th><th scope="col">Running time</th><th scope="col">Schedule</th></tr></thead>
            <tbody>
              {SCOPE.map(([what, price, dur, when]) => (
                <tr key={what}>
                  <td className="what">{what}</td>
                  <td className="price tnum"><small>Starts from</small>{price}</td>
                  <td className="dim">{dur}</td>
                  <td className="dim">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="after-sheet">
            <div className="body">
              <p>Every running time is a range, because the concept decides it. Complexity decides the number, not duration. One character in one world is straightforward. Three characters across four eras, each recognisable in every shot, is a different order of work.</p>
            </div>
            <div className="cta-stack">
              <Link className="btn btn-lit" to="/contact">Get your quote</Link>
              <p>Or <a className="link" href={CALENDLY} target="_blank">book a 20 minute call</a> if you already know what you want made.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio — end credits */}
      <section className="sec studio" id="studio">
        <div className="shell">
          <div className="studio-intro">
            <h2 className="title" style={{ fontSize: 'clamp(54px,7.6vw,118px)' }}>The studio</h2>
            <div>
              <p className="lead">A small film studio. Ten people making cinematic brand films and full feature films, with AI as one tool inside a normal film process.</p>
              <div className="body" style={{ marginTop: 22 }}>
                <p>We started because founders kept showing us concepts they had written and could not afford to make. The idea was already good. What was missing was a crew. So we built one that works differently: same treatment, shot design, grade and mix as a proper shoot, without the trucks and the schedule.</p>
              </div>
            </div>
          </div>
          <div className="credits">
            <h3>Directed and produced by</h3>
            {TEAM.map(([file, name, role]) => (
              <div className="credit" key={name}>
                <span className="role">{role}</span>
                <img src={`https://chatturai.com/media/team/${file}`} alt="" loading="lazy" />
                <span className="name">{name}</span>
              </div>
            ))}
            <p className="credits-foot">and five more people behind the edit, the grade and the mix. <Link className="link" to="/about-us">Meet the studio</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
