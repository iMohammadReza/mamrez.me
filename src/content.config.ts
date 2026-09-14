import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { mediumLoader } from './lib/medium-loader';

const creationCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/creations' }),
  schema: z.object({
    title: z.string(),
    url: z.string().optional(),
    github: z.string().optional(),
    date: z.number(),
    /** Live indicator; only set on the projects that should show one. */
    status: z.enum(['Running', 'Stopped']).optional(),
    badge: z.enum(['New']).optional(),
    body: z.string(),
  }),
});

const postCollection = defineCollection({
  loader: mediumLoader('https://medium.com/feed/@imohammadreza'),
});

export const collections = {
  creations: creationCollection,
  posts: postCollection,
};
