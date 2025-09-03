import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import bookshop from "@bookshop/astro-bookshop";
import mdx from "@astrojs/mdx";
import alpine from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  site: "https://loyalagents.org/",
  integrations: [react(), bookshop(), alpine(), mdx()],
});
