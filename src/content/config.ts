import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = {
  creations: creationCollection,
};
