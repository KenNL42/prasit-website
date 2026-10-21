/**
 * Deploy-only Astro integration: fixes the gaps Astro's `base` leaves in
 * the built HTML, WITHOUT touching any content/UI file (so the feature
 * branch and github-deploy never conflict on content).
 *
 * Astro auto-prefixes `href` attributes with the base, but:
 *  - `<img src="/...">` are NOT prefixed → prefix them
 *  - `astro:i18n` helpers can emit the base (and the locale) twice when
 *    Astro.url.pathname already contains the base → dedupe
 *  - absolute `content=` URLs (og:image, twitter:image) miss the base
 *    → insert it
 *
 * Runs on `astro:build:done` and rewrites the emitted .html files.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

export function baseHtmlPlugin(base) {
  const cleanBase = (base ?? '').replace(/^\/|\/$/g, ''); // 'prasit-website'
  const baseSlash = `/${cleanBase}/`; // '/prasit-website/'

  if (!base || base === '/') {
    return { name: 'base-html-plugin' };
  }

  /** Keep the first base segment, drop later duplicates; fix doubled /th/. */
  const fixUrl = (url) => {
    let fixed = url;
    const baseSeg = `/${cleanBase}`;
    const first = fixed.indexOf(baseSeg);
    if (first !== -1) {
      fixed =
        fixed.slice(0, first + baseSeg.length) +
        fixed.slice(first + baseSeg.length).split(baseSeg).join('');
    }
    return fixed.replace(/\/th\/th\//g, '/th/');
  };

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '_astro') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (extname(entry.name) === '.html') {
        let html = readFileSync(full, 'utf8');

        // 1) Prefix <img src="/..."> (not already based, not external) with the base.
        html = html.replace(/(\bsrc=")\/(?!prasit-website\/|https?:|\/\/)/g, `$1${baseSlash}`);

        // 2) Dedupe duplicated base (and locale) segments in href/content URLs.
        html = html.replace(/(href|content)="([^"]*)"/g, (m, attr, url) => `${attr}="${fixUrl(url)}"`);

        // 3) Insert the base into site-rooted absolute content URLs (og:image, twitter:image).
        html = html.replace(
          /(content="https:\/\/[^"]*?)(\/(?!prasit-website\/)[^"]*)"/g,
          (m, head, path) => {
            // Skip URLs that already carry the base (e.g. og:url after dedupe).
            if ((head + path).includes(`/${cleanBase}`)) return m;
            return `${head}${baseSlash}${path.replace(/^\//, '')}"`;
          },
        );

        writeFileSync(full, html);
      }
    }
  };

  return {
    name: 'base-html-plugin',
    hooks: {
      'astro:build:done': ({ dir }) => {
        walk(fileURLToPath(dir));
      },
    },
  };
}
