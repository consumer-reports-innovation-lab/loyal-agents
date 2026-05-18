import site from "../../data/site.json";
import { getCollection } from "astro:content";

import rss from "@astrojs/rss";
const posts = await getCollection("resources");

export async function GET() {
  return rss({
    title: site.site_title,
    description: site.description,
    site: "https://loyalagents.org/",
    items: posts.map((post) => ({
      link: `/resources/${post.id.replace(/\.mdx$/, "")}`,
      title: post.data.title,
      pubDate: post.data.date,
    })),
    customData: `<language>en-us</language>`,
  });
}
