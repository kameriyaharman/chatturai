import { useState } from 'react';
import { Lines, VideoModal } from '../components/Chrome2';

const play = (id, title) => `https://player.mux.com/${id}?metadata-video-title=${encodeURIComponent(title)}&video-title=${encodeURIComponent(title)}&autoplay=true`;
const thumb = (id, v) => `https://image.mux.com/${id}/thumbnail.webp?${v ? 'width=540&height=960' : 'width=960&height=540'}&fit_mode=smartcrop&time=6`;

// [mux playback id, title shown on the card]
const FILMS = [
  ['u021AiWSBoeL02Do5Cv8dNRcs02dC7j101yj2KAxZrb5TKU', 'Brand film'],
  ['jGTKWk00JGBet6qSDJ6BwHS01l00zA8M01jJL9smzjfVmI8', 'Brand film'],
  ['YMnBV2OstLZ01MFv0201b8fjKQ7hvIIKX8V1Ka7l00Fbqzg', 'Brand film'],
  ['eALIA4MM2LVTUiSSU98MZscPR9nnILLoEh8uM02Gw00J00', 'Brand film'],
  ['9ePbcwpZJGkcscFAVV8EB01fx3aHY8wR01ExJvtYpqiMs', 'The Promise'],
  ['vYqkS01I6rmWIqtywzeqj5AYkHZlyg00XrY8GSrd4nnCg', 'Brand film'],
  ['dwPEyzO01d2gApJEPvQWZtvUt02HvFfDwNCcpYz9WsMSs', 'Brand film'],
  ['nNq5wLb00Kb9ihFatUZRG2T02LkAiwf3deENHgo1x8vmA', 'The Face-Off'],
  ['HFjXqbrP00hCuGUnHnIPMV79aCmyKHDJZgg5901uFM8y8', 'Brand film'],
  ['ofEPmGoMkbhcdRQi1502uT1QF6QphjLPs9j4d8SZlNXA', 'Brand film'],
  ['meomhCyllhtuY3xZadHeu7TXu02CpN3vGI4PBPpuKtiw', 'The Double Magic'],
  ['vzEz2d7m02Dlc6EKZhAbXGvgzCRUvAmR00rwJEwFzZU02E', 'Brand film'],
];
const TRAILERS = [
  ['00V1pk5xxmR502aHfIqVmXWl4hJBMKqMVbri01N3MuATaE', 'Feature trailer'],
  ['3b01KEOgIT5dHTFIWw7sbwbuVh8Xow3smVUMFaT4KeXY', 'Feature trailer'],
];
const REELS = [
  ['SN3kpTxXuvIvJT4WoyGuCpGdsraitNhEVSPBTr4QJLk', 'Reel'],
  ['BazXwvSKWek2Ab017EgsSmojEEqlO4iec9sl3yfgBHkA', 'Reel'],
  ['va3xcdgShI02pWa6tWE01JvzSs8F01nARWlJ02Tm1Ak02m8c', 'Reel'],
  ['LA3rhfIFdqWXCSXWcU28N3aBwM6u5e02HU3keMM7Sbo00', 'Reel'],
];
const TABS = [
  ['films', 'Brand films', FILMS, '16:9 · landscape'],
  ['trailers', 'Trailers', TRAILERS, 'Feature films · 16:9'],
  ['reels', 'Reels', REELS, 'Vertical · 9:16'],
];

export default function Portfolio2() {
  const [tab, setTab] = useState('films');
  const [open, setOpen] = useState(null);
  const [, , items, fmt] = TABS.find((t) => t[0] === tab);
  const vertical = tab === 'reels';

  return (
    <main>
      <header className="phero">
        <div className="shell">
          <Lines as="h1" lines={['Work']} />
          <div className="phero-row">
            <p data-r="">Every one of these started as words in a document. Nobody travelled anywhere. Nothing was shot.</p>
            <div className="stat" data-r="" style={{ '--i': 1 }}><b>18</b>films, trailers and reels</div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <div className="shell tabs-in" role="tablist" aria-label="Filter work">
          {TABS.map(([k, l, list]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'tab on' : 'tab'} onClick={() => setTab(k)}>
              {l}<b>{list.length}</b>
            </button>
          ))}
        </div>
      </div>

      <section className="shell">
        {tab === 'trailers' && (
          <p className="gal-note" data-r="">Full features are a different order of work. Complex world building, original score, and a timeline in months rather than weeks. These are the trailers.</p>
        )}
        <div className={vertical ? 'gallery reels' : 'gallery'} key={tab}>
          {items.map(([id, title], i) => (
            <button type="button" key={id} className={vertical ? 'tile v' : 'tile'} data-r="" style={{ '--i': i % 3 }}
              onClick={() => setOpen({ id, title })} aria-label={`Play ${title}`}>
              <img src={thumb(id, vertical)} alt="" loading="lazy" decoding="async" />
              <span className="cap">
                <span><b>{title}</b><small>{fmt}</small></span>
                <span className="pp" aria-hidden="true"></span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {open && <VideoModal src={play(open.id, open.title)} title={open.title} vertical={vertical} onClose={() => setOpen(null)} />}
    </main>
  );
}
