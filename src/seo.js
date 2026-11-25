// Per-page <title>, description and <body> class — copied from the live PHP site.
export const PAGES = {
  '/': {
    body: 'v2',
    title: 'ChatturAI — Creative Ad-Creation Agency | AI-Powered Ads & Brand Storytelling',
    description:
      'ChatturAI crafts high-impact AI ads, video campaigns, and brand storytelling. From idea to implementation—AI ad videos, creative strategy, and cinematic content that converts.',
  },
  '/home-5': {
    body: 'v5', noindex: true,
    title: "ChatturAI — Version 5 · Script to Screen",
    description: 'Home page design option for ChatturAi.',
  },
  '/home-1': {
    body: 'v2 light', noindex: true,
    title: "ChatturAI — Version 1 · Editorial",
    description: 'Home page design option for ChatturAi.',
  },
  '/home-2': {
    body: 'v2', noindex: true,
    title: "ChatturAI — Version 2 · Kinetic",
    description: 'Home page design option for ChatturAi.',
  },
  '/home-3': {
    body: 'v2', noindex: true,
    title: "ChatturAI — Version 3 · Bento",
    description: 'Home page design option for ChatturAi.',
  },
  '/home-4': {
    body: 'v2', noindex: true,
    title: "ChatturAI — Version 4 · Director's Cut",
    description: 'Home page design option for ChatturAi.',
  },
  '/versions': {
    body: 'v2', noindex: true,
    title: "ChatturAI — Pick a home page",
    description: 'Home page design option for ChatturAi.',
  },
  '/portfolio': {
    body: 'v2',
    title: 'ChatturAI - AI Film Portfolio | Cinematic Work by ChatturAi',
    description:
      'Explore cinematic AI films created by ChatturAi, including brand films, commercials, trailers, reels and creative film projects.',
  },
  '/about-us': {
    body: 'v2',
    title: 'ChatturAI About  | AI Film Production Studio',
    description:
      'Meet ChatturAi, an AI film production studio creating cinematic brand films, trailers, commercials and feature films for brands, writers and producers worldwide.',
  },
  '/contact': {
    body: 'v2',
    title: 'ChatturAI Contact | Start Your AI Film Project',
    description:
      'Contact ChatturAi to discuss your brand film, commercial, trailer, reel or feature film. Share your script, concept or creative brief with our studio.',
  },
  '/privacy-policy': {
    body: 'v2',
    title: 'ChatturAI | Privacy Policy',
    description:
      'Read the ChatturAi Privacy Policy to understand how we collect, use and protect information, including cookies, analytics and third-party services.',
  },
  '/terms-condition': {
    body: 'v2',
    title: 'ChatturAI | Terms & Conditions',
    description:
      'Read the Terms and Conditions governing the use of the ChatturAi website, creative services, project engagements, intellectual property and applicable terms.',
  },
};

export function pageFor(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  return PAGES[p] || PAGES['/'];
}
