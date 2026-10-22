// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/site.config.ts';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The public site URL — single source of truth is SITE.url in
  // src/site.config.ts (used for sitemap, canonical, hreflang, OG).
  site: SITE.url,
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
