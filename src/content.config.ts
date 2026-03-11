import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { mediumLoader } from './lib/medium-loader';

const creationCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/creations' }),
  schema: z.object({
    title: z.string(),
    url: z.string().optional(),
    date: z.number(),
    status: z.enum(['Running', 'Stopped']),
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
