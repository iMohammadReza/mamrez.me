import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";

export default defineConfig({
  site: 'https://imohammadreza.ir/',
  integrations: [mdx(), tailwind(), sitemap(), icon()]
});