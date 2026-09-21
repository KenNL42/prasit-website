# AGENTS.md — handoff notes for AI agents

This file is the first thing an agent should read when taking over this project. It summarizes
the current state, the commands, the architecture rules that must not be violated, and the
non-obvious traps discovered during development.

## Project state (as of the last merge to `master`)

- **What it is:** a static bilingual (English / Thai) academic portfolio for an anthropology
  professor: publications with abstracts + downloadable PDFs, fieldwork photo galleries, about
  and contact pages.
- **Stack:** Astro 7 (SSG) · Tailwind CSS v4 · Markdown content collections · `@astrojs/sitemap`.
  No client framework; only small inline scripts.
- **All work is committed and merged.** The i18n feature branch `feature/i18n-en-th` was merged
  into `master`; the site is complete and building (18 pages).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project commands

- `npm run dev` — start the dev server (http://localhost:4321)
- `npm run build` — production build into `dist/` (runs `prebuild` → regenerates OG assets)
- `npm run check` — run `astro check` for type diagnostics
- `npm run preview` — serve the production build locally
- `npm run generate:placeholders` — create sample PDFs/images (never overwrites existing files)
- `npm run generate:og` — (re)generate OG share image + apple-touch icon (auto-runs via `prebuild`)

## Project layout (this site)

- **Content (Markdown):** `src/content/publications/en|th/*.md` (one file per publication,
  abstract in the body), `src/content/events/*.md` (one file per photo album), and
  `src/content/about/*.md` (About-page biography blocks, ordered via `order` frontmatter; each
  block may carry an optional `image` + `caption`/`captionTh`, a `textTh` translation, and
  `imageOnly: true` to render a standalone centered figure instead of a text-and-image row).
  Both the body and `textTh` are Markdown (textTh rendered via `marked`); write `textTh` with
  YAML literal style `|` — folded `>` merges list items onto one line.
- **Content schemas:** `src/content.config.ts`. Uses the modern content-layer API —
  `loader: glob(...)` — required in Astro 7 (bare `type: 'content'` collections are skipped).
- **Static files:** PDFs in `public/publications_english/` and `public/publications_thai/`; event
  photos in `public/pictures/<album>/`. Photos are enumerated at build time via
  `src/lib/albums.ts`.
- **Site-wide settings:** `src/site.config.ts` — identity in both languages: `name`/`nameTh`,
  `title`/`titleTh`, `affiliation`/`affiliationTh`, `address`/`addressTh`, email, profiles,
  interests, `organization`.
- **Design tokens:** `src/styles/global.css` (`@theme` block — colors and fonts, incl. Thai
  stacks).
- **i18n:** UI strings in `src/i18n/dictionaries.ts` (the `en` object defines the structure; the
  `th` object is type-checked to cover every key). Locale helpers (`getDictionary`,
  `otherLocaleUrl`, `neutralPath`) in `src/i18n/index.ts`.
- **SEO structured data:** shared `personLd()` in `src/lib/seo.ts` — used by the Home page
  (`Person`) and the About page (`ProfilePage` with `mainEntity: Person`).

## Hard rules (do not break these)

1. **Never hardcode UI text** in components or pages — always read it from the dictionary:
   `const t = getDictionary(lang)` then `t.section.key`. Add every new string to **both** `en`
   and `th`.
2. **The `en` dictionary must always contain English text** — even for keys describing Thai
   content. Known past bugs: `thTitle`, `thIntro`, `thaiCardTitle`, `thaiCardText`,
   `backToTh`, `thai` were mistakenly Thai in the `en` block and rendered Thai UI on English
   pages. The `th` block is the only place Thai UI text belongs.
3. **File structure mirrors URL structure** (Astro i18n `prefixDefaultLocale: false`): English
   page files at `src/pages/` root, Thai page files under `src/pages/th/`. Do **not** convert to
   `[lang]` dynamic routes unless you also set `prefixDefaultLocale: true` — Astro generates
   `/en/…` URLs and the build fails otherwise.
   **`src/pages/th/` is required** — empirically verified: removing it drops the build from 18 to
   9 pages. Astro never synthesizes pages for other locales from root files.
4. **Every page exists twice** — a thin root file (`<Page lang="en" />`) and a thin `th/` file
   (`<Page lang="th" />`), both rendering a shared component in `src/components/pages/` that
   takes `lang: Locale`. Keep the logic in the shared component.
5. **Internal links on Thai pages must be prefixed with `/th`** (`${prefix}/about`). The English
   URL always exists, so a missing prefix silently sends Thai visitors to the English page —
   this is the most common i18n bug.
6. **Content language ≠ UI language.** Publication titles/abstracts/tags and event descriptions
   stay in their own language on both sites; only the chrome around them follows the page
   language. (Thai publications on `/publications/thai` keep Thai titles — that is correct.)
7. **Cross-language publication links** use route segments `english`/`thai` — never `en`/`th`
   (past bug: `/publications/en`). See `PublicationLangPage.astro` (`backTarget`) and
   `src/i18n/index.ts` (`otherLocaleUrl`).
8. **Inline scripts with `define:vars` must be `is:inline`** and cannot use TypeScript type
   annotations (`PublicationList.astro`, `PhotoGallery.astro`, `ContactPage.astro`).
9. **Event Markdown bodies are English.** The Thai translation goes in the `descriptionTh`
   frontmatter field (plain text, line breaks preserved — Markdown is not rendered there). The
   Thai event page falls back to the English body when `descriptionTh` is absent.
10. **Sitemap alternates need an explicit `i18n` option** on the `sitemap()` integration in
    `astro.config.mjs` — they are not inferred from the Astro `i18n` config.
11. **Nav active state** compares the language-neutral path (`neutralPath`) so the same link is
    highlighted on `/about` and `/th/about`.
12. **Generated vs committed assets:** `npm run generate:placeholders` output is git-ignored;
    `public/og-image.png` and `public/favicon-180.png` are committed. If the owner's name
    changes, update `INITIALS` in `scripts/generate-og-image.mjs` and `public/favicon.svg`.
13. **Thai year display** (Buddhist Era) is handled only in the `th` dictionary's
    `latestNote` (`year + 543`); keep Gregorian years in the Markdown frontmatter.

## Verification

After changing components or pages, run `npm run check` and `npm run build`. Expected: 0 errors,
1 benign hint (`AbstractToggle` Props interface), 18 pages (9 English at root + 9 Thai under
`/th/`).

## Maintenance guide

For architecture, the Markdown → page content flow, and how the English/Thai language system is
wired (dictionaries, thin page files, EN⇄TH switching), read `DEVELOPER_GUIDE.md` — it is the
human-readable counterpart of this file.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
