import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://bigdata-ai.blog",
  output: "static",
  adapter: vercel(),
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
