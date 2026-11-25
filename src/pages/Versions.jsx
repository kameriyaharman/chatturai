import { Link } from 'react-router-dom';

const V = [
  ['/home-1', '1', 'Editorial', 'Magazine feel. Off-white page, huge black headline, the showreel in a wide framed window, films as editorial stories, prices as a clean list that lights up lime.'],
  ['/home-2', '2', 'Kinetic', 'Maximum motion. Rotating "brands / writers / producers", a giant outlined ChatturAi marquee over the reel, a tilted lime ticker, and films that slide sideways as you scroll.'],
  ['/home-3', '3', 'Bento', 'Everything on the first screen in a grid of tiles: reel, a big lime "Talk to us", 100+ films, price, team faces and the client quote. Modern and fast to scan.'],
  ['/home-4', '4', "Director's Cut", 'Scene by scene. The reel and each film get a full screen; as you scroll, the next scene slides over the last like cuts in a film.'],
];

export default function Versions() {
  return (
    <main className="picker">
      <div className="shell">
        <h1 className="title">Pick a home page</h1>
        <p>Four directions for the home page, all in the ChatturAi colours. Open each one, scroll all the way down, and tell us which number to take forward.</p>
        <div className="picks">
          {V.map(([to, n, name, d]) => (
            <Link key={to} to={to} className="pick">
              <span className="n">Version {n}</span>
              <h2>{name}</h2>
              <p>{d}</p>
              <span className="go">Open version {n} ↗</span>
            </Link>
          ))}
          <Link to="/" className="pick cur" style={{ gridColumn: '1/-1', minHeight: 0 }}>
            <span className="n">Current</span>
            <h2>The one you saw before</h2>
            <p>Full-screen reel, filmstrip, hover-to-preview work list, timeline, pricing cards and portraits.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
