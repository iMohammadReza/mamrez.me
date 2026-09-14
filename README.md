# mamrez.me

Source for [mamrez.me](https://mamrez.me).

A single-page, statically built site: profile and intro, a rail of career highlights, a project list, writing pulled from Medium, a couple of Spotify playlists, and a work timeline. Mostly plain Astro HTML, with a few React islands where Motion drives the interaction, plus a strict CSP, sitemap, and JSON-LD.

## Stack

- [Astro 7](https://astro.build) — static output, content collections, built-in font loading and CSP
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- [Motion](https://motion.dev) + React islands for the interactive bits (text reveal / scramble, shared-layout hover backgrounds, highlight modal) — adapted from [beUI](https://beui.dev)
- [astro-icon](https://www.astroicon.dev) with Lucide and Simple Icons
- [Bun](https://bun.sh) for scripts and the lockfile; Node ≥ 24 (see `.nvmrc`)

## Develop

```bash
bun install
bun run dev        # http://localhost:4321
```

Other scripts:

```bash
bun run build      # astro check + astro build → dist/
bun run preview    # serve the built site
bun run lint       # eslint src
bun run format     # prettier --write .
```

## Editing content

Everything hand-written lives in two places:

| What                                                                            | Where                                                                                                   |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Profile, intro paragraphs, highlights, work history, socials, playlists, footer | `src/lib/site.ts`                                                                                       |
| Projects                                                                        | `src/content/creations/*.md` (frontmatter: `title`, `url`, `github`, `date`, `status`, `badge`, `body`) |
| Writing                                                                         | fetched from `https://medium.com/feed/@imohammadreza` at build time — nothing to edit here              |

Intro paragraphs support `**bold**` for emphasised ink text and `[label](href)` for links.

## Project layout

```
src/
├── components/        Astro sections (ProfileHeader, Highlights, ProjectList, …)
│   ├── react/         React islands (HighlightsRail, HighlightModal, ProjectRows)
│   └── motion/        Motion primitives adapted from beUI
├── content/creations  Project entries (Markdown + frontmatter)
├── layouts/           Layout.astro (fonts, meta, CSP-safe scripts)
├── lib/               site.ts (content), medium-loader, ink-trail, handwriting, motion helpers
├── pages/             index.astro, 404.astro
└── styles/            global.css (Tailwind theme, ink palette, type scale)
public/                favicons, manifest, robots.txt, avatar
```

## License

MIT — see [LICENSE](LICENSE). The site content in `src/lib/site.ts`, `src/content/`, and `public/` is not covered by the license; replace it if you reuse the site.
