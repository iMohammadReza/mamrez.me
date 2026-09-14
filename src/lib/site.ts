/**
 * All hand-authored site content. Projects come from the `creations` content
 * collection and writing from the Medium RSS loader (see content.config.ts).
 */

export type Social = {
  title: string;
  href: string;
  /** astro-icon name, e.g. `simple-icons:github` */
  icon: string;
};

type WorkItem = {
  company: string;
  role: string;
  start: string;
  end: string; // 'Now' for the current role
  href?: string;
};

export type HighlightVisual = 'chat' | 'studio' | 'table' | 'digest' | 'calendar' | 'drawing';

export type Highlight = {
  slug: string;
  title: string;
  kind: string;
  years: string;
  summary: string;
  href?: string;
  visual: HighlightVisual;
};

export const profile = {
  firstName: 'MohammadReza',
  lastName: 'Iranmanesh',
  name: 'MohammadReza Iranmanesh',
  alias: 'MamRez',
  title: 'Full-Stack Product Engineer',
  easterTitle: 'do you know shinigami love apples?',
  email: 'imohammadreza.ir@gmail.com',
  github: 'https://github.com/iMohammadReza',
  twitterHandle: '@notmamrez',
};

/**
 * Intro paragraphs. `**bold**` renders as emphasised ink text and
 * `[label](href)` as an underlined link (see Intro.astro).
 */
export const intro: string[] = [
  "I'm a product engineer who takes a feature from customer discovery all the way to production — **product**, **design**, and **code** included",
  "Right now I'm at [BrowseAI](https://browse.ai), designing, building and shipping **AI features and the web app around them** — the interesting part is a spreadsheet engine that holds **500k live rows** in the browser without dropping a frame",
  'Before that, six years of leading a web team at [Divar](https://divar.ir), a marketplace used by **44M+** people, co-founding a SaaS, and contributing to open source — usually joining when the problem is still loose enough for design and code to shape it together',
  'Outside work, **robotics** is the itch I keep coming back to — the same product, design and code loop, except the result moves',
  `I share side projects and experiments on [GitHub](${profile.github}) and can be reached by [email](mailto:${profile.email})`,
];

export const highlights: Highlight[] = [
  {
    slug: 'bita',
    title: 'Bita',
    kind: 'Personal AI agent',
    years: '2026—Now',
    summary:
      'A Telegram agent that runs my day. I write tasks, plans and reminders the way I would text a friend, and a tool-calling agent loop turns them into scheduled reminders, plans and actions. Built with TypeScript, Hono, Drizzle and the Telegram Bot API',
    href: 'https://t.me/bitabot',
    visual: 'chat',
  },
  {
    slug: 'houshang',
    title: 'Houshang',
    kind: 'Telegram AI studio',
    years: '2026—Now',
    summary:
      'A Telegram web app for generating music, text, video and photos in one place, with access to every major model. Pick a medium, write a prompt, switch models on the fly and keep the whole studio inside the chat you already use, no separate accounts or subscriptions per model',
    href: 'https://t.me/houshangrobot',
    visual: 'studio',
  },
  {
    slug: 'dino-ai',
    title: 'Dino AI',
    kind: 'AI playground for kids',
    years: '2025—Now',
    summary:
      'Snap a photo of a drawing, or scribble one on screen, and it comes alive as an animated dinosaur with a story of its own. Made for kids: the drawing stays theirs, the dinosaur keeps its crayon character, and every story is written around the details they drew',
    href: 'https://dino.imohammadreza.ir',
    visual: 'drawing',
  },
  {
    slug: 'formula-ai',
    title: 'Formula AI',
    kind: 'AI product surface · BrowseAI',
    years: '2025',
    summary:
      'Formula columns for a web-scraping spreadsheet, owned end-to-end: an IDE-style formula editor with syntax highlighting, autocompletion and inline errors, plus an LLM assistant that writes formulas from plain language. It scores 95% on its evaluation suite and reached 30% adoption across 12 teams. Underneath it, a re-architected engine lifted the client-side ceiling from 30k to 500k rows',
    href: 'https://browse.ai',
    visual: 'table',
  },
  {
    slug: 'morning-brew',
    title: 'Morning Brew',
    kind: 'AI news agent',
    years: '2024—Now',
    summary:
      'A news agent that reads the sources you choose overnight and delivers one personalised briefing every morning. Instead of a feed to scroll, you get a short summary of what actually changed, ranked by what you care about',
    visual: 'digest',
  },
  {
    slug: 'baje',
    title: 'Baje',
    kind: 'Reservation SaaS',
    years: '2020—2022',
    summary:
      'Co-founded as technical founder: a subscription and reservation-management SaaS for gyms and beauty salons. Shipped as a multi-tenant PWA so every business gets its own installable app under its own name. Built the MVP and grew it to 1K users',
    visual: 'calendar',
  },
];

export const work: WorkItem[] = [
  {
    company: 'BrowseAI',
    role: 'Senior Product Engineer',
    start: '2025',
    end: 'Now',
    href: 'https://browse.ai',
  },
  {
    company: 'Divar',
    role: 'Senior Front-end Engineer · Web Team Lead',
    start: '2019',
    end: '2025',
    href: 'https://divar.ir',
  },
  {
    company: 'XAXI',
    role: 'React Native Developer',
    start: '2018',
    end: '2019',
  },
  {
    company: 'Cafe Bazaar',
    role: 'Front-end Intern',
    start: '2017',
    end: '2018',
    href: 'https://cafebazaar.ir',
  },
];

/** Shown top-right in the profile header. */
export const headerLinks: Social[] = [
  { title: 'X', href: 'https://x.com/notmamrez', icon: 'simple-icons:x' },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mohammadrezairanmanesh/',
    icon: 'simple-icons:linkedin',
  },
  { title: 'GitHub', href: 'https://github.com/iMohammadReza', icon: 'simple-icons:github' },
];

export const socials: Social[] = [
  { title: 'GitHub', href: profile.github, icon: 'simple-icons:github' },
  { title: 'X', href: 'https://x.com/notmamrez', icon: 'simple-icons:x' },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mohammadrezairanmanesh/',
    icon: 'simple-icons:linkedin',
  },
  { title: 'Telegram', href: 'https://t.me/unclemamrez', icon: 'simple-icons:telegram' },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/mamrez.me/',
    icon: 'simple-icons:instagram',
  },
  { title: 'Email', href: `mailto:${profile.email}`, icon: 'simple-icons:gmail' },
];

export const playlists = [
  { title: 'Metal', id: '5U3TbOPUeBSwAwIs6RF76j' },
  { title: 'ZeroToHund', id: '54OLgLlkPKD70bTf2nt24w' },
];

/** Profiles that are listed in JSON-LD `sameAs` but not shown in the footer. */
export const moreProfiles = [
  'https://imohammadreza.medium.com/',
  'https://open.spotify.com/user/2pylhbh56lolh9una0na4jmrw',
];

export const footer = {
  tagline: 'Open to building useful, well-made AI products with thoughtful people',
};
