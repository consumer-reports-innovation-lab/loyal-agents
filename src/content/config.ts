import { defineCollection, z } from "astro:content";

const seoSchema = z
  .object({
    page_description: z.string().nullable(),
    canonical_url: z.string().nullable(),
    featured_image: z.string().nullable(),
    featured_image_alt: z.string().nullable(),
    author_twitter_handle: z.string().nullable(),
    open_graph_type: z.string().nullable(),
    no_index: z.boolean(),
  })
  .optional();

const resourceCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    link: z.string(),
    date: z.date().optional(),
  }),
});

const pageSchema = z.object({
  title: z.string(),
  hero_block: z.any(),
  content_blocks: z.array(z.any()),
  seo: seoSchema,
});

const paginatedCollectionSchema = z.object({
  title: z.string(),
  page_size: z.number().positive(),
  seo: seoSchema,
});

const pagesCollection = defineCollection({
  schema: z.union([paginatedCollectionSchema, pageSchema]),
});

export const collections = {
  resources: resourceCollection,
  pages: pagesCollection,
};
