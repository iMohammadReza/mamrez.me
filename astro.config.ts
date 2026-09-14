import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mamrez.me/',
  integrations: [sitemap(), react(), icon()],
  image: {
    // Medium post thumbnails (WritingRow) and Spotify playlist covers (MusicList)
    // are downloaded and resized at build time.
    domains: [
      'cdn-images-1.medium.com',
      'miro.medium.com',
      'mosaic.scdn.co',
      'i.scdn.co',
      'image-cdn-ak.spotifycdn.com',
    ],
  },
  redirects: {
    '/creations': '/#projects',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['SFMono-Regular', 'Menlo', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: [500],
      styles: ['normal'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://queue.simpleanalyticscdn.com https://cdn-images-1.medium.com https://miro.medium.com",
        "connect-src 'self' https://queue.simpleanalyticscdn.com",
        'frame-src https://open.spotify.com',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://scripts.simpleanalyticscdn.com'],
      },
      styleDirective: {
        // Motion writes inline `style` attributes (SSR + CSSOM); <style>/<link>
        // elements stay restricted to self + Astro's generated hashes.
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: { plugins: [tailwindcss()] },
});
