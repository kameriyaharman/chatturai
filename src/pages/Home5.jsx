// Version 5 — Script to Screen
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { VideoModal } from '../components/Chrome2';
import { CALENDLY, TEAM } from '../components/Bits';
import { FILMS, HERO_SRC, HERO_POSTER, REEL_FULL, PLANS } from './Home2';

/* The screenplay that types itself in the hero. [text, kind] — kept short so each line fits the page. */
const SCRIPT = [
  ['FADE IN:', 'trans-l'],
  ['INT. YOUR DESK - LATE NIGHT', 'slug'],
  ['A finished script, forty drafts', 'act'],
  ['deep. It has never been filmed.', 'act2'],
  ['FOUNDER', 'char'],
  ['What would it take to', 'dlg'],
  ['actually make this?', 'dlg'],
  ['CHATTURAI (V.O.)', 'char'],
  ['Send it over. We build', 'dlg'],
  ['everything after the words.', 'dlg hlline'],
  ['CUT TO:', 'trans'],
];

const SCENES = [
  { slug: 'EXT. A SNOWBOUND PEAK - DAWN', act: 'A climber drags herself up the last ridge. Wind shreds the snow off the rock. She is not stopping, and her face tells you why.' },
  { slug: 'EXT. FOUR IMPOSSIBLE STADIUMS - NIGHT', act: 'Two boots race across lava, ice and neon to be the pair a player picks. Each one has a personality you can see in the way it moves.' },
  { slug: 'INT. A SKINCARE LAB, IMPOSSIBLY CLEAN - DAY', act: 'Jelly wobbles. Butter melts into skin. Every close-up has to read as photographed, because the audience can tell when it is not.' },
];

const CRAFTS = ['Treatment', 'Shot design', 'Storyboard', 'Character', 'World', 'Cinematography', 'Generation', 'Edit', 'Colour', 'Sound', 'Score', 'Voice'];

function ScriptPage() {
  const [hl, setHl] = useState(false);
  let at = 0.4;
  const lines = SCRIPT.map(([text, kind]) => {
    const n = text.length;
    const dur = Math.max(0.25, n * 0.02);
    const pause = kind === 'char' || kind.startsWith('trans') ? 0.22 : 0.08;
    const line = { text, kind, n, at, dur };
    at += dur + pause;
    return line;
  });
  const total = at;
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setHl(true), reduce ? 0 : total * 1000 + 200);
    return () => clearTimeout(t);
  }, [total]);

  const cls = (k) => ({ 'trans-l': 'ln', slug: 'ln slug', act: 'ln act', act2: 'ln', char: 'ln char', dlg: 'ln dlg', 'dlg hlline': 'ln dlg', trans: 'ln trans' }[k]);
  return (
    <div className="page" aria-label="A screenplay page: a founder asks what it would take to make their script; ChatturAi answers, send it over, we build everything after the words.">
      <span className="pg">1.</span>
      {lines.map((l, i) => (
        <span key={i} className={cls(l.kind)} aria-hidden="true">
          <span className="t" style={{ '--n': l.n, '--at': `${l.at}s`, '--dur': `${l.dur}s` }}>
            {l.kind === 'dlg hlline' ? <span className={hl ? 'hl on' : 'hl'}>{l.text}</span> : l.text}
          </span>
        </span>
      ))}
    </div>
  );
}

/* Scroll grows the reel from page-size to full screen */
function CutTo({ onPlay }) {
  const box = useRef(null);
  const frame = useRef(null);
  useEffect(() => {
    const f = frame.current;
    if (f && !f.src) {
      f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 700), { once: true });
      f.src = HERO_SRC;
    }
    const el = box.current; if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, -r.top / (el.offsetHeight - window.innerHeight)));
        el.style.setProperty('--p', p.toFixed(3));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="cut" ref={box} id="reel">
      <div className="cut-sticky">
        <div className="cut-frame">
          <img src={HERO_POSTER} alt="" />
          <iframe ref={frame} title="ChatturAi showreel" allow="autoplay; encrypted-media" tabIndex="-1"></iframe>
          <div className="cut-over">
            <h2>Every frame here began as a page like that one.</h2>
            <button type="button" className="playbtn" onClick={onPlay}><i aria-hidden="true"></i>Watch the showreel with sound</button>
          </div>
        </div>
        <span className="cut-label" aria-hidden="true">CUT TO:</span>
      </div>
    </section>
  );
}

export default function Home5() {
  const [video, setVideo] = useState(null);
  return (
    <main>
      <section className="wrap h5">
        <div className="h5-copy">
          <h1>You write it.<br />We film it.</h1>
          <p>ChatturAi is an AI film studio for brands, writers and producers. Send us a concept or a finished script, and we deliver the film: treatment, shots, characters, edit, grade, sound and score.</p>
          <div className="h5-cta">
            <Link to="/contact" className="b b-ink">Send your script</Link>
            <a href="#reel" className="b b-line">Watch the showreel</a>
          </div>
          <div className="h5-proof">
            <span className="faces">{TEAM.map(([f, n]) => <img key={n} src={`https://chatturai.com/media/team/${f}`} alt="" />)}</span>
            <span>100+ films delivered since 2025, for clients in India and worldwide</span>
          </div>
        </div>
        <ScriptPage />
      </section>

      <CutTo onPlay={() => setVideo({ src: REEL_FULL, title: 'ChatturAi showreel' })} />

      <section className="s5">
        <div className="wrap">
          <div className="s5-head">
            <div><span className="k mono">Script → Screen</span><h2 data-r="">Three scenes, as they were written and as they were made.</h2></div>
            <p data-r="" style={{ '--i': 1 }}>Nobody travelled anywhere. Nothing was shot. Each of these started as words like the ones on the left.</p>
          </div>
          <div className="pairs">
            {FILMS.map((f, i) => (
              <div className="pair" key={f.title}>
                <div className="snip" data-r="">
                  <div className="slug">{SCENES[i].slug}</div>
                  <div className="act">{SCENES[i].act}</div>
                  <div className="meta"><span>{f.kind}</span><span>Scene {i + 1} of 18</span></div>
                </div>
                <button className="screen" data-r="" style={{ '--i': 1 }} onClick={() => setVideo(f)} aria-label={`Play ${f.title}`}>
                  <img src={f.img} alt="" loading="lazy" />
                  <h3>{f.title}</h3>
                  <span className="t5"><i aria-hidden="true"></i>Play the film</span>
                </button>
              </div>
            ))}
          </div>
          <div className="more-row">
            <Link to="/portfolio" className="b b-ink">See all 18 films</Link>
            <span>Brand films, feature trailers and reels</span>
          </div>
        </div>
      </section>

      <section className="s5 proc">
        <div className="wrap">
          <div className="s5-head">
            <div><span className="k mono">The process</span><h2 data-r="">Twelve crafts go into every film. <span className="hl">The tools do one.</span></h2></div>
            <p data-r="" style={{ '--i': 1 }}>People do the other eleven. This is the same sequence a real shoot follows; one step in the middle just no longer needs cameras, trucks or a six week schedule.</p>
          </div>
          <div className="crafts" data-r="">
            {CRAFTS.map((c, i) => (
              <div key={c} className={c === 'Generation' ? 'craft5 ai' : 'craft5'}><small>{String(i + 1).padStart(2, '0')}</small><span>{c}</span></div>
            ))}
          </div>
          <div className="proc-foot">
            <div data-r=""><p>Character consistency and world consistency are where almost every AI video falls apart: a face that shifts between shots, a jacket that changes colour, a room that isn't the same room. Holding those still is the work.</p></div>
            <div data-r="" style={{ '--i': 1 }}>
              <p><strong>You describe the place. We build it.</strong> Nothing is shot by you, and nothing needs to exist before we start.</p>
              <span className="stamp">Made with AI. Not by AI.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="s5">
        <div className="wrap dlg5">
          <div className="page" data-r="">
            <span className="ln char">CARLOS REYES</span>
            <span className="ln par">(on his first call, Nashville)</span>
            <span className="ln dlg wrap-t">You guys were actually more expensive than my other option. <span className="hl">And I still came back.</span></span>
            <span className="ln char">CARLOS REYES (CONT'D)</span>
            <span className="ln dlg wrap-t">The whole story just got put together. I couldn't have done that story myself in any other way.</span>
          </div>
          <button className="screen" data-r="" style={{ '--i': 1 }} onClick={() => setVideo({ title: 'Client testimonial', src: 'https://player.mux.com/SjU4vrR02H1fMBVEWqxvbCPF02qlXJMYfD3kZi8vk2vt4?metadata-video-title=1&video-title=1&thumbnail-time=2&autoplay=true' })} aria-label="Play client testimonial">
            <img src="/media/img/testimonials.png" alt="" loading="lazy" />
            <span className="t5"><i aria-hidden="true"></i>Hear it from Carlos</span>
          </button>
        </div>
      </section>

      <section className="s5" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="s5-head">
            <div><span className="k mono">Budget top sheet</span><h2 data-r="">What it costs to start.</h2></div>
            <p data-r="" style={{ '--i': 1 }}>Starting prices, not fixed prices. Complexity decides the number, not duration, so your exact quote comes on the call after we read your script.</p>
          </div>
          <div className="budget" data-r="">
            <div className="budget-h"><span>Production: your film</span><span>Starts from</span></div>
            {PLANS.map((p) => (
              <div className={p.hot ? 'line5 hot' : 'line5'} key={p.name}>
                <span><span className="nm">{p.name}</span><em>{p.items.slice(0, 2).join(' · ')}</em></span>
                <span className="dots"></span>
                <b>{p.price}</b>
              </div>
            ))}
            <div className="budget-f">
              <span>Two revision rounds are built into every schedule.</span>
              <a className="tlink" href={CALENDLY} target="_blank" rel="noopener">Book a 20 minute call</a>
            </div>
          </div>
        </div>
      </section>

      <section className="s5" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="s5-head">
            <div><span className="k mono">Cast &amp; crew</span><h2 data-r="">Ten people. A real film crew.</h2></div>
            <p data-r="" style={{ '--i': 1 }}>These are the five you will speak to, and the ones who make the calls on your film. <Link to="/about-us" className="tlink">Meet the studio</Link></p>
          </div>
          <div className="crew">
            {TEAM.map(([f, n, r], i) => (
              <figure key={n} data-r="" style={{ '--i': i }}>
                <img src={`https://chatturai.com/media/team/${f}`} alt={n} loading="lazy" />
                <figcaption><b>{n}</b><span>{r}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {video && <VideoModal src={video.src} title={video.title} onClose={() => setVideo(null)} />}
    </main>
  );
}
