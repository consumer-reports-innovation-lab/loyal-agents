import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z
    .object({
      title: z.string().optional(),
    })
    .passthrough(),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resources" }),
  schema: z
    .object({
      title: z.string().optional(),
      tags: z.array(z.string()).optional(),
      link: z.string().optional(),
      date: z.date().optional(),
    })
    .passthrough(),
});

export const collections = { pages, resources };
