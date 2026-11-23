import { useEffect, useRef } from 'react';
import { Lines, CountUp } from '../components/Chrome2';
import { TEAM } from '../components/Bits';

const WHO = [
  ['◐', 'Brands', 'Companies with something worth saying and a film in mind for saying it. Launches, brand films, campaigns, investor and pitch films.'],
  ['✎', 'Writers', 'People with a finished script and no way to get it shot. We build it, and you keep the work.'],
  ['▶', 'Producers', 'Features, trailers and proof of concept films, made at a scale that used to need a studio behind it.'],
];
const HOW = [
  ['The concept read', 'We read what you wrote before we speak. On the call we tell you which parts are strong, which are hard to build, and which are genuinely impossible with the tools that exist today. You leave with an exact quotation.'],
  ['Treatment and shot design', 'The concept becomes a shot list. Lens language, movement, where the cuts fall, what each frame is doing. This is the part that decides whether the film feels made or generated, and it happens before anything is built.'],
  ['Characters and worlds', 'Faces, wardrobe, locations, light. Every one is designed and then locked, because the hardest problem in this medium is not making one beautiful frame. It is making the sixtieth frame agree with the first.'],
  ['Generation', 'This is the step the tools do, and it is one step out of twelve. Which model suits which shot is a judgement, not a setting, and it is the only part of this process that did not exist five years ago.'],
  ['Edit, colour, sound, score', 'Cut for rhythm, graded for a look, sound designed, and scored to picture. Exactly as a shoot would be finished, by people who do only this.'],
  ['Delivery', 'Master, plus cutdowns in every ratio you need. Two revision rounds are built into the schedule rather than bolted on at the end.'],
];

/* The process line fills with lime as you scroll through it */
function Steps() {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const steps = [...el.querySelectorAll('.step2')];
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const mark = window.innerHeight * 0.6;
        const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
        el.style.setProperty('--fill', `${(p * 100).toFixed(1)}%`);
        steps.forEach((s) => s.classList.toggle('lit', s.getBoundingClientRect().top < mark));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="steps2" ref={box}>
      <div className="fill" aria-hidden="true"></div>
      {HOW.map(([h, p], i) => (
        <div className={h === 'Generation' ? 'step2 ai' : 'step2'} key={h} data-r="">
          <span className="dot tnum">{i + 1}</span>
          <div><h3>{h}</h3><p>{p}</p></div>
        </div>
      ))}
    </div>
  );
}

export default function About2() {
  return (
    <main>
      <header className="phero">
        <div className="shell">
          <Lines as="h1" lines={['ChatturAi', 'Studio']} />
          <div className="phero-row">
            <p data-r="">We are ten people who make cinematic brand films and full feature films, using AI as one tool inside a normal film process.</p>
          </div>
        </div>
      </header>

      <div className="shell">
        <div className="facts2">
          <div className="fact2" data-r=""><CountUp to={2025} /><span>Founded</span></div>
          <div className="fact2" data-r="" style={{ '--i': 1 }}><CountUp to={100} suffix="+" /><span>Films delivered</span></div>
          <div className="fact2" data-r="" style={{ '--i': 2 }}><CountUp to={10} /><span>People in the studio</span></div>
        </div>
      </div>

      <section className="sec">
        <div className="shell why">
          <p className="pull" data-r="">People kept showing us things they had already written and could not afford to make.</p>
          <div className="copy" data-r="" style={{ '--i': 1 }}>
            <p>A brand with a film in mind. A writer with a finished script. A producer with a feature that had been sitting in a drawer for years. Different rooms, the same sentence every time.</p>
            <p>The writing was almost always good. Somebody had sat with it long enough to find the one true thing in it, put it on a page, and then discovered that putting it on a screen cost more than they could justify.</p>
            <p>So it stayed a document. Some tried to build it themselves with AI tools, spent a few weekends on it, and stopped. Not because they lacked taste, but because writing and building are two different disciplines and only one of them got easier.</p>
            <strong>What was missing was never the idea. It was a crew.</strong>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="sec-head">
            <Lines lines={['Who we', 'work with']} />
            <p data-r="">Brand films and feature films, for three kinds of people.</p>
          </div>
          <div className="who3">
            {WHO.map(([ico, h, p], i) => (
              <div className="who-card" key={h} data-r="" style={{ '--i': i }}>
                <span className="ico" aria-hidden="true">{ico}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec craft">
        <div className="shell">
          <div className="sec-head">
            <Lines lines={['How a film', 'gets made here']} />
            <p data-r="">Nothing about the process is unusual. It is the same sequence a shoot follows. One step in the middle no longer needs cameras, trucks or a six week schedule.</p>
          </div>
          <Steps />
        </div>
      </section>

      <section className="sec">
        <div className="shell">
          <div className="sec-head">
            <Lines lines={['The people']} />
            <p data-r="">Ten of us in total. These are the ones you will speak to, and the ones who make the calls on your film.</p>
          </div>
          <div className="team3">
            {TEAM.map(([file, name, role], i) => (
              <figure className="person" key={name} data-r="scale" style={{ '--i': i }}>
                <img src={`https://chatturai.com/media/team/${file}`} alt={name} loading="lazy" />
                <figcaption><b>{name}</b><span>{role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
