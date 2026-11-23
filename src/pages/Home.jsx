import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MuxLite, Team, CALENDLY } from '../components/Bits';

const HERO_SRC =
  'https://player.mux.com/BSLUOz3mUM3EUbX22Zbf00mZBKC029cZBhPVbZsIAavCY?metadata-video-title=showreel&video-title=showreel&autoplay=true&muted=true&loop=true&controls=false';

const FILMS = [
  {
    no: '01', title: 'The Promise', tag: 'Brand film', img: '/media/img/decath_promise.png',
    src: 'https://player.mux.com/9ePbcwpZJGkcscFAVV8EB01fx3aHY8wR01ExJvtYpqiMs?metadata-video-title=The%20Promise&video-title=The%20Promise&autoplay=true',
    note: 'The concept required depicting an emotionally heavy ascent up a treacherous snowy peak, making the consistent generation of harsh snow dynamics and raw facial expressions the most challenging part to build.',
  },
  {
    no: '02', title: 'The Face-Off', tag: 'Nike spec ad', img: '/media/img/nike_shoes.jpg',
    src: 'https://player.mux.com/nNq5wLb00Kb9ihFatUZRG2T02LkAiwf3deENHgo1x8vmA?metadata-video-title=The%20Face-Off&video-title=The%20Face-Off&autoplay=true',
    note: 'The concept asked for a high-speed rivalry race between two shoes competing to be selected by a player, and the hardest part was creating distinct visual personalities and maintaining consistent motion physics for both across changing extreme environments.',
  },
  {
    no: '03', title: 'The Double Magic', tag: 'AI cosmetics ad', img: '/media/img/beauty.jpg',
    src: 'https://player.mux.com/meomhCyllhtuY3xZadHeu7TXu02CpN3vGI4PBPpuKtiw?metadata-video-title=The%20Double%20Magic&video-title=The%20Double%20Magic&autoplay=true',
    note: 'The concept asked for a hyper-realistic cosmetics commercial blending vibrant makeup with skincare, and the hardest part was generating consistent, photorealistic textures for the glossy jelly, melting butter, and flawless skin close-ups using AI.',
  },
];

const CRAFTS = ['Treatment', 'Shot design', 'Storyboard', 'Character', 'World', 'Cinemato­graphy', 'Generation', 'Edit', 'Colour', 'Sound', 'Score', 'Voice'];

const SCOPE = [
  ['$3,000', 'Cinematic brand films', '1 to 3 minutes', 'Delivered in 15 days'],
  ['$30,000', 'Full feature films', '60 to 90 minutes', 'Timelines in months'],
  ['$750', 'Concept development', 'A 1 to 3 minute script', 'Credited against the film'],
];

const HOME_CSS = `
  .hero-film { position: relative; overflow: hidden; background: #111; }
  .hero-video-poster, .hero-film iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
  .hero-video-poster { display: block; object-fit: cover; }
  .hero-film iframe, .frame iframe { border: 0; }
  .mux-video { opacity: 0; transition: opacity .3s ease; }
  .mux-video.is-loaded { opacity: 1; }
  .frame { position: relative; }
  .mux-lite { position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; padding: 0; border: 0; overflow: hidden; background: #111; cursor: pointer; }
  .mux-lite > img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .mux-lite-play { position: absolute; left: 50%; top: 50%; display: grid; place-items: center; width: 64px; height: 64px; transform: translate(-50%, -50%); border-radius: 50%; background: rgba(0,0,0,.68); color: #fff; font-size: 23px; line-height: 1; }
  .mux-lite-label { position: absolute; left: 50%; top: calc(50% + 48px); transform: translateX(-50%); color: #fff; font-size: 14px; }
  .frame > iframe { display: block; width: 100%; aspect-ratio: 16 / 9; }
  #craft, #studio { content-visibility: auto; contain-intrinsic-size: 900px; }
`;

function Hero() {
  const iframe = useRef(null);
  const poster = useRef(null);
  // Hero showreel autoplays on load; poster stays until the Mux iframe is ready
  useEffect(() => {
    const f = iframe.current;
    if (!f || f.src) return;
    f.addEventListener('load', () => {
      f.classList.add('is-loaded');
      if (poster.current) poster.current.style.display = 'none';
    }, { once: true });
    f.src = HERO_SRC;
  }, []);

  return (
    <header className="hero grain">
      <div className="hero-film">
        <img
          ref={poster}
          className="hero-video-poster"
          src="https://image.mux.com/BSLUOz3mUM3EUbX22Zbf00mZBKC029cZBhPVbZsIAavCY/thumbnail.webp?time=0&width=1280"
          alt="ChatturAI showreel"
          width="1280"
          height="720"
          fetchPriority="high"
          decoding="async"
        />
        <iframe
          ref={iframe}
          id="heroMuxVideo"
          className="mux-video mux-video--hero"
          data-src={HERO_SRC}
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
          allowFullScreen
          title="ChatturAI showreel"
        ></iframe>
      </div>
      <div className="hero-veil"></div>
      <div className="wrap hero-in">
        <div className="kicker">Cinematic AI films</div>
        <h1 className="dsp hero-h1">For brands,<br />writers and<br />producers.</h1>
        <p className="lede sub">You bring what you have written.<br className="br-d" /> We build everything after it.</p>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      {/* ══ 01 · HERO ══ */}
      <Hero />

      {/* ══ 02 · WORK ══ */}
      <section id="work">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp h2">Selected work</h2>
            <span className="eyebrow">Brand films · Trailers · Reels</span>
          </div>
          <div className="reel">
            {FILMS.map((f) => (
              <article className="film rv" key={f.no}>
                <div className="film-head">
                  <span className="no">{f.no}</span>
                  <h3>{f.title}</h3>
                  <span className="tag">{f.tag}</span>
                </div>
                <div className="frame">
                  <MuxLite src={f.src} title={f.title} img={f.img} />
                </div>
                <p className="film-note">{f.note}</p>
              </article>
            ))}
          </div>
          <div className="u-ho2 rv">
            <Link className="cta" to="/portfolio">See all work <span className="dot">→</span></Link>
            <div className="u-ho3 eyebrow">Brand films, feature trailers and reels</div>
          </div>
        </div>
      </section>

      {/* ══ 03 · CRAFT ══ */}
      <section id="craft" className="u-ho4 grain">
        <div className="wrap rel">
          <div className="eyebrow rv">How a film gets built</div>
          <h2 className="u-ho5 dsp h2 rv">Made with AI.<br />Not by AI.</h2>
          <div className="pipe rv" role="img" aria-label="Twelve crafts, the tools do one of them">
            {CRAFTS.map((c) => (
              <div className={c === 'Generation' ? 'node ai' : 'node'} key={c}><i></i><span>{c}</span></div>
            ))}
          </div>
          <div className="u-ho6 two">
            <div className="rv">
              <p>Twelve crafts go into every film we deliver. The tools do one of them. People do the other eleven.</p>
              <p>Character consistency and world consistency are where almost every AI video falls apart. A face that shifts between shots, a jacket that changes colour, a room that isn't the same room. Holding those still is the work.</p>
            </div>
            <div className="rv">
              <p>What disappeared was the trucks, the crew, the locations and the six week schedule. What did not disappear was the treatment, the shot design, the grade, the mix and the score.</p>
              <p><strong>You describe the place. We build it.</strong> Nothing is shot by you, and nothing needs to exist before we start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 04 · PROOF ══ */}
      <section>
        <div className="wrap">
          <div className="eyebrow rv">A client, on the first call</div>
          <div className="u-ho7 two">
            <div className="rv">
              <blockquote className="quote">"You guys were actually more expensive than my other option. And I still came back."</blockquote>
              <p className="quote-sm">"The whole story just got put together, and I could never have done that myself. I couldn't have done that story myself in any other way."</p>
              <div className="attr">Carlos Reyes · Nashville</div>
            </div>
            <div className="rv">
              <div className="frame">
                <MuxLite
                  className="mux-lite mux-lite--testimonial"
                  src="https://player.mux.com/SjU4vrR02H1fMBVEWqxvbCPF02qlXJMYfD3kZi8vk2vt4?metadata-video-title=1&video-title=1&thumbnail-time=2&autoplay=true"
                  title="Client testimonial"
                  img="/media/img/testimonials.png"
                  label="Play testimonial"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 05 · SCOPE ══ */}
      <section className="u-ho4 grain">
        <div className="wrap rel">
          <div className="sec-head rv">
            <h2 className="dsp h2">What we take on</h2>
            <span className="eyebrow">Starting prices · Quoted after we read your script</span>
          </div>
          <div className="scope">
            {SCOPE.map(([price, what, dur, meta]) => (
              <div className="sc rv" key={price}>
                <span className="from">Starts from</span>
                <b>{price}</b>
                <span>{what}</span>
                <em className="dur">{dur}</em>
                <span className="meta">{meta}</span>
              </div>
            ))}
          </div>
          <p className="price-note rv">These are starting prices, not fixed prices. Your final quotation
            is set after we read your script and understand the concept, because complexity is what
            decides the number. You get that quotation on the call, before anything begins.</p>
          <div className="u-ho8 two rv">
            <div>
              <p>Every running time above is a range, because the concept decides it. Complexity decides the number, not duration. One character in one world is straightforward. Three characters across four eras, each recognisable in every shot, is a different order of work.</p>
            </div>
            <div>
              <div className="u-ho9">
                <Link className="cta" to="/contact">Talk to us <span className="dot">→</span></Link>
                <p className="cta-line">Or <a className="u-ho10" href={CALENDLY} target="_blank">book a 20 minute call</a> if you already know what you want made.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 06 · STUDIO ══ */}
      <section id="studio">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp h2">The studio</h2>
            <span className="eyebrow">India · Working worldwide</span>
          </div>
          <div className="u-ho11 two">
            <div className="rv">
              <p className="lede">We are a small film studio. Ten people who make cinematic brand films and full feature films, using AI as one tool inside a normal film process.</p>
            </div>
            <div className="rv">
              <p>We started because founders kept showing us concepts they had written and could not afford to make. The idea was already good. What was missing was a crew.</p>
              <p>So we built one that works differently. Same treatment, same shot design, same grade and mix as a proper shoot, without the trucks and the schedule.</p>
            </div>
          </div>
          <Team />
          <div className="u-ho12 rv">
            <Link to="/about-us" className="u-ho13 eyebrow">More about the studio →</Link>
          </div>
        </div>
      </section>

      {/* Performance: hero Mux autoplay on load; lower Mux players load only on Play click */}
      <style>{HOME_CSS}</style>
    </>
  );
}
