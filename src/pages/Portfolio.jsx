import { End } from '../components/Bits';

const MUX = 'https://player.mux.com/';
const poster = (n) => `&poster=https%3A%2F%2Fchatturai.com%2Fmedia%2Ft%2Ft_${n}.png`;

// [mux playback id, iframe title]
const FILMS = [
  ['u021AiWSBoeL02Do5Cv8dNRcs02dC7j101yj2KAxZrb5TKU', 'ChatturAi film'],
  ['jGTKWk00JGBet6qSDJ6BwHS01l00zA8M01jJL9smzjfVmI8', 'ChatturAi film'],
  ['YMnBV2OstLZ01MFv0201b8fjKQ7hvIIKX8V1Ka7l00Fbqzg', 'ChatturAi film'],
  ['eALIA4MM2LVTUiSSU98MZscPR9nnILLoEh8uM02Gw00J00', 'ChatturAi film'],
  ['9ePbcwpZJGkcscFAVV8EB01fx3aHY8wR01ExJvtYpqiMs', 'The Promise'],
  ['vYqkS01I6rmWIqtywzeqj5AYkHZlyg00XrY8GSrd4nnCg', 'ChatturAi film'],
  ['dwPEyzO01d2gApJEPvQWZtvUt02HvFfDwNCcpYz9WsMSs', 'ChatturAi film'],
  ['nNq5wLb00Kb9ihFatUZRG2T02LkAiwf3deENHgo1x8vmA', 'The Face-Off'],
  ['HFjXqbrP00hCuGUnHnIPMV79aCmyKHDJZgg5901uFM8y8', 'ChatturAi film'],
  ['ofEPmGoMkbhcdRQi1502uT1QF6QphjLPs9j4d8SZlNXA', 'ChatturAi film'],
  ['meomhCyllhtuY3xZadHeu7TXu02CpN3vGI4PBPpuKtiw', 'The Double Magic'],
  ['vzEz2d7m02Dlc6EKZhAbXGvgzCRUvAmR00rwJEwFzZU02E', 'ChatturAi film'],
];
const TRAILERS = [
  ['00V1pk5xxmR502aHfIqVmXWl4hJBMKqMVbri01N3MuATaE', 'ChatturAi film'],
  ['3b01KEOgIT5dHTFIWw7sbwbuVh8Xow3smVUMFaT4KeXY', 'ChatturAi film'],
];
const REELS = [
  'SN3kpTxXuvIvJT4WoyGuCpGdsraitNhEVSPBTr4QJLk',
  'BazXwvSKWek2Ab017EgsSmojEEqlO4iec9sl3yfgBHkA',
  'va3xcdgShI02pWa6tWE01JvzSs8F01nARWlJ02Tm1Ak02m8c',
  'LA3rhfIFdqWXCSXWcU28N3aBwM6u5e02HU3keMM7Sbo00',
];

function Item({ src, title, ratio }) {
  return (
    <div className="item rv">
      <div className={`frame ${ratio}`}>
        <iframe
          loading="lazy"
          src={src}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          title={title}
        ></iframe>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <>
      {/* ══ HEAD ══ */}
      <header className="head grain">
        <div className="wrap rel">
          <div className="eyebrow">Selected work</div>
          <h1 className="u-po1 dsp">Work</h1>
          <div className="row">
            <p className="u-po2">Every one of these started as words in a document. Nobody travelled anywhere. Nothing was shot.</p>
            <span className="eyebrow" id="totalCount">{' '}</span>
          </div>
        </div>
      </header>

      {/* ══ FILTER ══ */}
      <div className="filter">
        <div className="wrap filter-in">
          <a href="#films" className="on" data-jump="">Brand films</a>
          <a href="#trailers" data-jump="">Trailers</a>
          <a href="#reels" data-jump="">Reels</a>
          <span className="count" id="countLine">{' '}</span>
        </div>
      </div>

      {/* ══ FILMS · 16:9 ══ */}
      <section id="films">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp">Films</h2>
            <span className="eyebrow">Landscape · 16:9</span>
          </div>
          <div className="grid-16" id="gridFilms">
            {FILMS.map(([id, title], i) => (
              <Item key={id} ratio="r16" title={title} src={`${MUX}${id}?metadata-video-title=1&video-title=1${poster(i + 1)}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRAILERS · 16:9 ══ */}
      <section id="trailers" className="u-po3 grain">
        <div className="wrap rel">
          <div className="sec-head rv">
            <h2 className="dsp">Trailers</h2>
            <span className="eyebrow">Feature films · 16:9</span>
          </div>
          <p className="u-po4 rv">Full features are a different order of work. Complex world building, original score, and a timeline in months rather than weeks. These are the trailers.</p>
          <div className="grid-16" id="gridTrailers">
            {TRAILERS.map(([id, title], i) => (
              <Item key={id} ratio="r16" title={title} src={`${MUX}${id}?metadata-video-title=1&video-title=1${poster(i + 13)}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ REELS · 9:16 ══ */}
      <section id="reels">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="dsp">Reels</h2>
            <span className="eyebrow">Vertical · 9:16</span>
          </div>
          <div className="grid-9" id="gridReels">
            {REELS.map((id) => (
              <Item key={id} ratio="r9" title="ChatturAi film" src={`${MUX}${id}?metadata-video-title=1&video-title=1`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ END ══ */}
      <End linkClass="u-po5">Yours starts the same way. As words.</End>
    </>
  );
}
