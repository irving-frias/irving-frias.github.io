import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define a schema for the `posts` collection
const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(["en", "es"]), // Limit to supported languages
    publishDate: z.coerce.date(), // Ensures date is always valid
    img: z.string(),
    slug: z.string(),
    slug_translation: z.string().optional(),
    img_alt: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
