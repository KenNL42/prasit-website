# Hosting Guide — Prasit Leepreecha website

This guide covers the recommended way to host the production site, how to get a
hostname, how to build properly, and what to check for SEO. It replaces the old
staging setup (GitHub Pages / `github-deploy` branch), which stays as a test
environment only.

> TL;DR — **build locally, deploy the `dist/` folder to Vercel (free), and put
> the site on a `.com` domain you register (~$10/yr).**

---

## 1. Why build locally (not in the cloud)

The build pipeline (`prebuild` in `package.json`) is more than `astro build`:

```
generate-og-image → convert-bibliography → sync-access → render-viewer → astro build
```

- `sync-access` reads your Google Sheets access tracker (public CSV URL in
  `scripts/access-sheet-url.txt`) and writes `downloadable:` flags into the
  publication Markdown.
- `render-viewer` needs **Python 3.10+ with PyMuPDF**: it restores the
  downloadable PDFs from `resources/` into `public/` (PDFs are committed **only
  in `resources/`** — `public/` is build-generated), renders the view-only
  image readers, and removes restricted PDFs from the build output.

Because of that, the most reliable workflow is:

1. Build on your machine (venv + sheet access are local).
2. Upload the finished `dist/` folder to a static host (Vercel, Cloudflare
   Pages, Netlify, Surge…).

A fully cloud-hosted build is possible too (Cloudflare Pages supports Python on
its build image) — see §6 — but it needs extra setup and per-file size caps
differ (see the comparison).

## 2. Host comparison (as of 2026)

| Host | Free tier | Per-file cap | Fits our 45.6 MB PDF?¹ | Cloud build with Python? | Ease |
|---|---|---|---|---|---|
| **Vercel** (Hobby) | 100 GB/mo transfer, 1M requests/mo, free SSL, custom domains | 100 MB | ✅ yes | ❌ build image has no Python for the prebuild | very easy (`vercel deploy dist --prod`) |
| **Cloudflare Pages** | unlimited bandwidth & requests (static), 500 builds/mo, free SSL, 100 custom domains | **25 MiB** | ❌ *no* — must move that one PDF to R2 or compress it² | ✅ (`PYTHON_VERSION` + `pip install`) | easy (`wrangler pages deploy dist`) |
| **Netlify** | 100 GB/mo, free SSL, custom domains | ~10 MB recommended; >20 MB may fail | ❌ no (several PDFs are 10–22 MB) | ✅ python on build image | easy (`netlify deploy --dir dist`) |
| **Surge.sh** | free, SSL | large files OK | ✅ | n/a (static upload only) | one command (`surge dist`) |
| GitHub Pages | free | 100 MB | ✅ | ✅ (already wired) | — but this is your **staging** env |

¹ Largest served PDF is `2013-Picturing Highladers.pdf` (45.6 MB). The two
view-only books are not served as PDFs, so their sizes don't matter.
² If you prefer Cloudflare: re-encode/compress that one PDF below 25 MiB (it's
a photo-heavy scan; ~60–70% JPEG quality usually lands ~15–20 MB), or serve it
from an R2 public bucket.

**Recommendation: Vercel Hobby.** Everything fits, it's free, one command to
deploy, free SSL, and custom domains are easy to attach.

## 3. Getting a hostname

**Free starter hostnames** (test before spending anything):
- Vercel: `<project>.vercel.app` — Cloudflare: `<project>.pages.dev` — Netlify: `<project>.netlify.app`

**Buy a real domain** (this is the only recurring cost, ~$10–12/yr):

| Registrar | `.com` price | Notes |
|---|---|---|
| [Porkbun](https://porkbun.com) | ~$9–10/yr | cheapest, easy DNS, no markup |
| [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | at-cost (~$10–11/yr) | no markup; pairs perfectly with Cloudflare Pages |
| [Namecheap](https://www.namecheap.com) | ~$10–12/yr | established, fine |

- A good name for this site: `prasitleepreecha.com` (or `.net` / `.org`).
- **Avoid Thai TLDs** (`.co.th`, `.ac.th`) for an individual: they require a
  Thai legal entity / registrar approval and are more expensive.

**Once you own it**, change **one file** and rebuild (before the production
deploy):

```ts
// src/site.config.ts — single source of truth
url: 'https://yourdomain.com',   // no trailing slash
```

`astro.config.mjs` reads this for `site`, so the sitemap, canonicals,
hreflang, Open Graph and JSON-LD all follow automatically. Keep
`public/robots.txt`'s `Sitemap:` line in sync (same URL + `/sitemap-index.xml`).

## 4. Building the site properly

Prerequisites:

```bash
# Node.js 20+  and  Python 3.10+ (Ubuntu: sudo apt install python3-venv)

npm install
python -m venv .venv
# Windows:   .venv\Scripts\pip install -r requirements.txt
# macOS/Linux: .venv/bin/pip install -r requirements.txt
# optional OCR stack (scanned English PDFs): also install -r requirements-ocr.txt
```

Build:

```bash
npm run build
```

What you get in `dist/` (verify each):

- `index.html`, `about/`, `publications/…`, `photos/…`, `contact/`, `th/…`
- `publications_english/*.pdf`, `publications_thai/*.pdf`, `books/*.pdf` —
  downloadable works (restored from `resources/`)
- `pdf-pages/<slug>/page-*.jpg` — view-only readers (restricted PDFs absent)
- `sitemap-index.xml` + `sitemap-0.xml` — with your domain
- `robots.txt` — with your domain
- `404.html` — custom bilingual 404

Smoke-test locally:

```bash
npm run preview        # serves dist/ at http://localhost:4321
```

## 5. Deploying — step by step

### Vercel (recommended)

```bash
npm run build
npx vercel deploy dist --prod
```

1. First run: sign in (`npx vercel login`), accept the project prompts.
2. Attach the domain: Vercel dashboard → your project → **Settings → Domains** →
   add `yourdomain.com` → follow the DNS instructions (an A record pointing at
   `76.76.21.21`, or use Vercel's nameservers). HTTPS is automatic.
3. Redeploy after every content change: `npm run build && npx vercel deploy dist --prod`.

> Repo-connected builds (git push → Vercel build) are **not recommended** for
> this project: the build image doesn't have the Python deps the prebuild
> needs.

### Cloudflare Pages (free alternative)

> First remove/relocate the 45.6 MB PDF (see §2) or the deploy fails with a
> per-file size error.

Option A — local build:

```bash
npm run build
npx wrangler pages deploy dist --project-name prasit-website
```

Option B — cloud build from this repo (Python is supported):

1. Dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
   choose the repo and branch `deploy-any`.
2. Build settings: build command `pip install -r requirements.txt && npm run build`,
   output directory `dist`. Add env `PYTHON_VERSION=3.11` if needed.
3. Domain: Pages project → **Custom domains** → add `yourdomain.com` → create a
   CNAME record `yourdomain.com → <project>.pages.dev`.

### Surge (zero-config option)

```bash
npm run build
npx surge dist yourdomain.com   # or yourname.surge.sh for free
```

## 6. SEO — what's implemented and how to verify

Already in place (no work needed):

- Per-locale **canonical** + **hreflang** (`en`, `th`, `x-default`) — every page
- **sitemap-index.xml** with both locales (i18n alternates)
- **robots.txt** (allow all + sitemap line)
- `<title>` / meta description / author / robots per page, both languages
- **Open Graph** + **Twitter cards** with a 1200×630 `og-image.png`
- **JSON-LD structured data**: `Person` (name, job title, worksFor,
  sameAs → Google Scholar/Academia, knowsAbout) + `WebSite` + `Organization`
- Descriptive `alt` on every image; custom bilingual **404 page**
- Thai pages use the correct `<html lang="th">`

Verify after the first production deploy:

```bash
# canonical + hreflang on both home pages
curl -s https://yourdomain.com/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://yourdomain.com/th/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://yourdomain.com/sitemap-index.xml | head
curl -s https://yourdomain.com/robots.txt
```

Then: **Google Search Console** → add the property → submit
`sitemap-index.xml` → request indexing of `/` and `/th/`. (Also add the property
for the old `kennl42.github.io` staging site if you want it indexed; it's a
separate site.)

## 7. Daily content workflow

The only mutable "content" lives in **Google Sheets** (the access tracker).
Deploying the latest state is:

```bash
npm run build            # prebuild syncs the sheet + renders view-only readers
npx vercel deploy dist --prod
```

New publications: drop the PDF into `resources/<English_publications|Thai_publications|Thai_books>/`
and run `python scripts/ingest_publications.py` (it creates the Markdown + cover
and never overwrites manually-edited files unless you pass `--force`).

## 8. Branching

- **`master`** — development; all changes land here.
- **`deploy-any`** — the production deploy branch. It carries the same source
  as `master` (no GitHub Pages overlay — no base path, no middleware). Deploy
  `dist/` built from it, or connect it to a cloud build (Cloudflare Pages §6B).
- **`github-deploy`** — legacy staging on GitHub Pages (`kennl42.github.io`).
  Kept for testing only; not the production site.