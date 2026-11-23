// Per-page <title>, description and <body> class — copied from the live PHP site.
export const PAGES = {
  '/': {
    body: 'p-home',
    title: 'ChatturAI — Creative Ad-Creation Agency | AI-Powered Ads & Brand Storytelling',
    description:
      'ChatturAI crafts high-impact AI ads, video campaigns, and brand storytelling. From idea to implementation—AI ad videos, creative strategy, and cinematic content that converts.',
  },
  '/portfolio': {
    body: 'p-portfolio',
    title: 'ChatturAI - AI Film Portfolio | Cinematic Work by ChatturAi',
    description:
      'Explore cinematic AI films created by ChatturAi, including brand films, commercials, trailers, reels and creative film projects.',
  },
  '/about-us': {
    body: 'p-about',
    title: 'ChatturAI About  | AI Film Production Studio',
    description:
      'Meet ChatturAi, an AI film production studio creating cinematic brand films, trailers, commercials and feature films for brands, writers and producers worldwide.',
  },
  '/contact': {
    body: 'p-contact',
    title: 'ChatturAI Contact | Start Your AI Film Project',
    description:
      'Contact ChatturAi to discuss your brand film, commercial, trailer, reel or feature film. Share your script, concept or creative brief with our studio.',
  },
  '/privacy-policy': {
    body: 'p-legal',
    title: 'ChatturAI | Privacy Policy',
    description:
      'Read the ChatturAi Privacy Policy to understand how we collect, use and protect information, including cookies, analytics and third-party services.',
  },
  '/terms-condition': {
    body: 'p-legal',
    title: 'ChatturAI | Terms & Conditions',
    description:
      'Read the Terms and Conditions governing the use of the ChatturAi website, creative services, project engagements, intellectual property and applicable terms.',
  },
};

export function pageFor(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  return PAGES[p] || PAGES['/'];
}
