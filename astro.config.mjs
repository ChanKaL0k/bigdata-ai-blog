import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bigdata-ai.blog",
  integrations: [
    tailwind(),
    react(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: "catppuccin-mocha",
      langs: ["scala", "python", "sql", "shell", "java", "yaml", "json", "js", "ts", "html", "css"],
    },
  },
});
