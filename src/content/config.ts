import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        author: z.string().default('Naufal Muhammad Al Hikam'),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
    }),
});

export const collections = { blog };
