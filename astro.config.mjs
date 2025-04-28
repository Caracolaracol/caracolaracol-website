// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), mdx()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image:{
    domains: ['supabase.com'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.supabase.co',
    }],
  }
});