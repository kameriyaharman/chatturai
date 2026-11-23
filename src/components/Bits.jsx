import { useState } from 'react';
import { Link } from 'react-router-dom';

export const CALENDLY = 'https://calendly.com/nitish-chatturai/the-discovery-call';

/* Lightweight Mux player: shows the poster, loads the real player only on click */
export function MuxLite({ src, title, img, className = 'mux-lite', label }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <iframe
        src={src}
        title={title || 'Video'}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  return (
    <button type="button" className={className} data-title={title} aria-label={`Play ${title === 'Client testimonial' ? 'client testimonial' : title}`} onClick={() => setPlay(true)}>
      <img src={img} alt={title} loading="lazy" decoding="async" />
      <span className="mux-lite-play" aria-hidden="true">▶</span>
      {label && <span className="mux-lite-label">{label}</span>}
    </button>
  );
}

export const TEAM = [
  ['nitish_final_2.jpg', 'Nitish Kalra', 'Founder'],
  ['harman_final.jpg', 'Harman Kameriya', 'Co-founder & CTO'],
  ['karthik_final.jpg', 'Karthik Pillai', 'Co-founder'],
  ['varun_final.jpg', 'Varun Krishna', 'Creative director'],
  ['rakesh_final_2.jpg', 'Rakesh Nayak', 'Creative director'],
];

export function Team() {
  return (
    <div className="team">
      {TEAM.map(([f, n, r]) => (
        <div className="tm rv" key={n}>
          <div className="por"><img src={`https://chatturai.com/media/team/${f}`} alt={n} loading="lazy" /></div>
          <b>{n}</b>
          <span>{r}</span>
        </div>
      ))}
    </div>
  );
}

/* "Talk to us" closing block used on Work + About */
export function End({ children, linkClass }) {
  return (
    <div className="end">
      <div className="wrap">
        <h2 className="dsp">{children}</h2>
        <Link className="cta" to="/contact">Talk to us <span className="dot">→</span></Link>
        <p className="cta-line">Or <a className={linkClass} href={CALENDLY} target="_blank" rel="noopener">book a 20 minute call</a> if you already know what you want made.</p>
      </div>
    </div>
  );
}
