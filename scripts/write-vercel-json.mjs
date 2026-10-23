/**
 * Write dist/vercel.json with long-lived Cache-Control headers for the
 * immutable assets (reader page images, book covers, photos, OG image) and
 * 30-day caching for the PDFs. HTML keeps Vercel's default (no-cache + etag),
 * which is what you want for SEO — edits propagate immediately.
 *
 * Run after `npm run build`, before `vercel deploy dist --prod`:
 *   node scripts/write-vercel-json.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const vercelJson = {
  version: 2,
  headers: [
    {
      source: '/pdf-pages/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/books/covers/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/pictures/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/publications_english/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
    },
    {
      source: '/publications_thai/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
    },
    {
      source: '/books/(.*)\\.pdf',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
    },
    {
      source: '/og-image.png',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    },
  ],
};

writeFileSync(join(root, 'dist', 'vercel.json'), JSON.stringify(vercelJson, null, 2) + '\n');
console.log('[write-vercel-json] wrote dist/vercel.json (cache headers)');