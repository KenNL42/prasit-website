// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Set the public site URL so the sitemap and canonical URLs are generated correctly.
  site: 'https://kennl42.github.io',
  base: '/prasit-website',
  // This tells Astro to rewrite absolute URLs in components during compilation
  experimental: {
    // Note: Available in newer Astro versions to auto-inject base paths
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          th: 'th',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
    routing: {
      // English is served from the root (e.g. /about); Thai is prefixed (/th/about).
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
