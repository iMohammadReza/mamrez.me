import { z, defineCollection } from 'astro:content';

const creationCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    url: z.string().optional(),
    date: z.number(),
    status: z.enum(["Running", "Stopped"]),
    body: z.string(),
  }),
});

export const collections = {
  'creations': creationCollection,
};