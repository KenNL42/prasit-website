// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Set the public site URL so the sitemap and canonical URLs are generated correctly.
  site: 'https://yourname.example.edu',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
