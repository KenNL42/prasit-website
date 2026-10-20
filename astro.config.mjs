// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Set the public site URL so the sitemap and canonical URLs are generated correctly.
  site: 'https://yourname.example.edu',
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
      // NOTE: do NOT set `watch.usePolling` here — polling scans the whole
      // project tree (node_modules + the large public/ PDFs) and makes the
      // dev server spin the CPU without ever coming up. Native fs events are
      // used instead (works on Windows/macOS/Linux). Only if you develop
      // inside WSL1/Docker/network shares and native watching genuinely
      // fails, re-enable it with `usePolling: true, interval: 300` and add
      // `ignored: ['**/public/**']` so the heavy PDFs are not polled.
    },
  },
});
