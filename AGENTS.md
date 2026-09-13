## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project commands

- `npm run dev` — start the dev server (http://localhost:4321)
- `npm run build` — production build into `dist/`
- `npm run check` — run `astro check` for type diagnostics
- `npm run preview` — serve the production build locally
- `npm run generate:placeholders` — create sample PDFs/images (never overwrites existing files)
- `npm run generate:og` — (re)generate OG share image + apple-touch icon (auto-runs via `prebuild`)

## Project layout (this site)

- **Content (Markdown):** `src/content/publications/en|th/*.md` (one file per publication, abstract
  in the body) and `src/content/events/*.md` (one file per photo album).
- **Content schemas:** `src/content.config.ts`. Uses the modern content-layer API —
  `loader: glob(...)` — required in Astro 7 (bare `type: 'content'` collections are skipped).
- **Static files:** PDFs in `public/publications_english/` and `public/publications_thai/`; event
  photos in `public/pictures/<album>/`. Photos are enumerated at build time via
  `src/lib/albums.ts`.
- **Site-wide settings:** `src/site.config.ts` (name, email, profiles, interests, address).
- **Design tokens:** `src/styles/global.css` (`@theme` block — colors and fonts, incl. Thai stacks).
- **i18n:** The site is bilingual (EN at root URLs, TH under `/th/`). UI strings live in
  `src/i18n/dictionaries.ts` (the `en` object defines the structure; `th` is type-checked to match).
  Page files mirror URLs (Astro i18n `prefixDefaultLocale: false`): English pages at
  `src/pages/` root, Thai pages under `src/pages/th/`, both thin wrappers around shared components
  in `src/components/pages/`. Event Thai descriptions use `descriptionTh` frontmatter.
  Locale URL helpers (`otherLocaleUrl`, `neutralPath`) are in `src/i18n/index.ts`.

## Verification

After changing components or pages, run `npm run check` and `npm run build`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
