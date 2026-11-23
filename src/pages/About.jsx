import { Team, End } from '../components/Bits';

const WHO = [
  ['01', 'Brands', 'Companies with something worth saying and a film in mind for saying it. Launches, brand films, campaigns, investor and pitch films.'],
  ['02', 'Writers', 'People with a finished script and no way to get it shot. We build it, and you keep the work.'],
  ['03', 'Producers', 'Features, trailers and proof of concept films, made at a scale that used to need a studio behind it.'],
];

const HOW = [
  ['01', 'The concept read', 'We read what you wrote before we speak. On the call we tell you which parts are strong, which are hard to build, and which are genuinely impossible with the tools that exist today. You leave with an exact quotation.'],
  ['02', 'Treatment and shot design', 'The concept becomes a shot list. Lens language, movement, where the cuts fall, what each frame is doing. This is the part that decides whether the film feels made or generated, and it happens before anything is built.'],
  ['03', 'Characters and worlds', 'Faces, wardrobe, locations, light. Every one is designed and then locked, because the hardest problem in this medium is not making one beautiful frame. It is making the sixtieth frame agree with the first.'],
  ['04', 'Generation', 'This is the step the tools do, and it is one step out of twelve. Which model suits which shot is a judgement, not a setting, and it is the only part of this process that did not exist five years ago.'],
  ['05', 'Edit, colour, sound, score', 'Cut for rhythm, graded for a look, sound designed, and scored to picture. Exactly as a shoot would be finished, by people who do only this.'],
  ['06', 'Delivery', 'Master, plus cutdowns in every ratio you need. Two revision rounds are built into the schedule rather than bolted on at the end.'],
];

function Steps({ items }) {
  return (
    <div className="steps">
      {items.map(([k, h, p]) => (
        <div className="step rv" key={k}>
          <div className="k">{k}</div>
          <h3>{h}</h3>
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      {/* ══ HEAD ══ */}
      <header className="head grain">
        <div className="wrap rel">
          <div className="eyebrow">India · Working worldwide</div>
          <h1 className="u-ab1 dsp">ChatturAi Studio</h1>
          <p className="lede">We are ten people who make cinematic brand films and full feature films, using AI as one tool inside a normal film process.</p>
        </div>
      </header>

      {/* ══ NUMBERS ══ */}
      <div className="wrap">
        <div className="facts">
          <div className="fact"><b>2025</b><span>Founded</span></div>
          <div className="fact"><b>100+</b><span>Films delivered</span></div>
          <div className="fact"><b>10</b><span>People</span></div>
        </div>
      </div>

      {/* ══ WHY ══ */}
      <section>
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp">Why this exists</h2>
            <span className="eyebrow">The short version</span>
          </div>
          <div className="two top">
            <div className="rv">
              <p className="u-ab2 lede">People kept showing us things they had already written and could not afford to make.</p>
            </div>
            <div className="rv">
              <p>A brand with a film in mind. A writer with a finished script. A producer with a feature that had been sitting in a drawer for years. Different rooms, the same sentence every time.</p>
              <p>The writing was almost always good. Somebody had sat with it long enough to find the one true thing in it, put it on a page, and then discovered that putting it on a screen cost more than they could justify.</p>
              <p>So it stayed a document. Some tried to build it themselves with AI tools, spent a few weekends on it, and stopped. Not because they lacked taste, but because writing and building are two different disciplines and only one of them got easier.</p>
              <p><strong>What was missing was never the idea. It was a crew.</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHO ══ */}
      <section className="u-ab3">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp">Who we work with</h2>
            <span className="eyebrow">Brand films · Feature films</span>
          </div>
          <Steps items={WHO} />
        </div>
      </section>

      {/* ══ HOW ══ */}
      <section className="u-ab4 grain">
        <div className="wrap rel">
          <div className="sec-head rv">
            <h2 className="dsp">How a film gets made here</h2>
            <span className="eyebrow">Made with AI · Not by AI</span>
          </div>
          <p className="u-ab5 rv">Nothing about the process is unusual. It is the same sequence a shoot follows. What changed is that one step in the middle no longer needs cameras, trucks, locations or a six week schedule.</p>
          <Steps items={HOW} />
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section>
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp">The people</h2>
            <span className="eyebrow">Who you will actually deal with</span>
          </div>
          <p className="u-ab6 rv">Ten of us in total. These are the ones you will speak to, and the ones who make the calls on your film.</p>
          <Team />
        </div>
      </section>

      {/* ══ END ══ */}
      <End linkClass="u-ab7">Tell us the idea.<br />We build everything after it.</End>
    </>
  );
}
