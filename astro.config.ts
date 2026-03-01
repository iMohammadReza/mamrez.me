import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mamrez.me/',
  integrations: [sitemap(), icon()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'EB Garamond',
      cssVariable: '--font-eb-garamond',
      weights: [400, 500, 700, 800],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [300, 400, 700],
      styles: ['normal'],
      fallbacks: ['Courier New', 'monospace'],
    },
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://queue.simpleanalyticscdn.com",
        "connect-src 'self' https://queue.simpleanalyticscdn.com",
        'frame-src https://open.spotify.com',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://scripts.simpleanalyticscdn.com'],
        hashes: ['sha256-wmFzsEXd08hPZseDFvGLy+hdZhFyC+hs4DkYaCb/Ty8='],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
