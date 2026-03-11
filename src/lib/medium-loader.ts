import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

export function mediumLoader(feedUrl: string) {
  return {
    name: 'medium-rss-loader',
    schema: z.object({
      title: z.string(),
      link: z.string(),
      date: z.string(),
      summary: z.string(),
    }),
    load: async ({ store, logger, parseData }) => {
      logger.info('Fetching Medium RSS feed');

      try {
        const response = await fetch(feedUrl);
        const xml = await response.text();
        const items = parseRssItems(xml);

        store.clear();
        for (const item of items) {
          const id = slugify(item.title);
          const data = await parseData({ id, data: item });
          store.set({ id, data });
        }

        logger.info(`Loaded ${items.length} posts from Medium`);
      } catch (err) {
        logger.error(`Failed to fetch Medium RSS: ${(err as Error).message}`);
      }
    },
  } satisfies Loader;
}

function parseRssItems(xml: string) {
  const items: Array<{ title: string; link: string; date: string; summary: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const date = extractTag(itemXml, 'atom:updated') || extractTag(itemXml, 'pubDate') || '';
    const body = extractCdata(itemXml, 'content:encoded') || '';

    if (title && link) {
      items.push({
        title,
        link,
        date,
        summary: stripHtml(body).slice(0, 300),
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  if (cdataMatch) return cdataMatch[1].trim();

  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : '';
}

function extractCdata(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  return match ? match[1] : '';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
