# Developer Guide — Academic Portfolio Site

A maintenance guide for the anthropology portfolio site: what the main features are, how the
Markdown content flows into the pages, and how the English/Thai language system is wired.

**Stack:** Astro 7 (static) · Tailwind CSS v4 · Markdown content collections. No client-side
framework — only small inline scripts (abstract toggles, photo lightbox, list filter, mobile nav).

---

## 1. Quick reference

| Task | Command |
| ---- | ------- |
| Dev server (http://localhost:4321) | `npm run dev` |
| Type-check all Astro/TS files | `npm run check` |
| Production build → `dist/` | `npm run build` |
| Preview the build | `npm run preview` |
| Regenerate sample PDFs/images | `npm run generate:placeholders` |
| Regenerate OG image + touch icon | `npm run generate:og` (auto-runs before every build) |

Always finish a change with `npm run check` and `npm run build`.

---

## 2. Architecture overview

```
public/                              ← static files served verbatim at their folder-named URLs
  publications_english/*.pdf         → /publications_english/<file>.pdf
  publications_thai/*.pdf            → /publications_thai/<file>.pdf
  pictures/<album>/*.{jpg,png,...}   → photos for one event, served at /pictures/<album>/…
  og-image.png, favicon.svg, favicon-180.png, robots.txt
src/
  content/
    publications/en/*.md             ← English publications (metadata + abstract)
    publications/th/*.md             ← Thai publications
    events/*.md                      ← one file per event / photo album
  content.config.ts                  ← zod schemas validating every Markdown file
  site.config.ts                     ← site identity: name, email, profiles, addresses
  i18n/
    dictionaries.ts                  ← ALL UI strings, English and Thai (typed, enforced)
    index.ts                         ← locale helpers: getDictionary, otherLocaleUrl, neutralPath
  layouts/Layout.astro               ← <head> (SEO, hreflang, fonts) + nav + footer shell
  components/
    pages/                           ← shared page BODIES (one per page, take a lang prop)
    Nav.astro Footer.astro           ← chrome; Nav holds the language switcher
    PublicationCard.astro            ← one publication entry (badges, abstract, PDF link)
    PublicationList.astro            ← card grid + search/filter box
    PublicationLangPage.astro        ← page body for /publications/{english,thai}
    AbstractToggle.astro             ← "more… / show less" for long abstracts
    EventCard.astro                  ← event tile (cover, date, photo count)
    PhotoGallery.astro               ← responsive grid + lightbox viewer
    Icon.astro                       ← inline SVG icon set
  lib/
    publications.ts                  ← pdfUrl(), buildCitation(), sortByYearDesc()
    albums.ts                        ← listAlbumPhotos(), photoUrl(), coverPhotoUrl()
  pages/
    index.astro about.astro contact.astro
    publications/{index,english,thai}.astro
    events/{index,[slug]}.astro
    th/                              ← exact mirror of the above (Thai versions)
  styles/global.css                  ← Tailwind @theme tokens (colors, fonts)
scripts/
  generate-placeholders.mjs          ← sample PDFs + SVG images (git-ignored output)
  generate-og-image.mjs              ← PNG encoder for og-image.png / favicon-180.png
```

### The central idea

- **Content** (publications, events) lives in Markdown under `src/content/` and is validated by
  `content.config.ts`. The page templates render it.
- **UI language** is separate from **content language**. A Thai publication keeps its Thai title
  and abstract; the *surrounding UI* (buttons, labels, headings) switches language with the site.
- Every page exists **twice** — once at the root (English) and once under `src/pages/th/` (Thai).
  Both are thin wrappers around a **shared page component** in `src/components/pages/` that
  receives a `lang="en" | "th"` prop. This keeps each page in sync by construction.

---

## 3. Content model: Markdown → pages

### 3.1 Publications

**Files:** `src/content/publications/en/*.md` and `src/content/publications/th/*.md`
(one file per publication; the `en/`/`th/` subfolder groups them but the `language` field is what
matters).

**PDFs:** `public/publications_english/<file>.pdf` or `public/publications_thai/<file>.pdf` —
served at `/publications_english/<file>.pdf` and `/publications_thai/<file>.pdf`.

Frontmatter schema (see `content.config.ts` for the authoritative version):

```markdown
---
title: "Ritual, Memory, and the Making of Sacred Landscapes in Northern Thailand"
authors:
  - "Niran Chanthana"
year: 2024
type: "Journal Article"        # Journal Article | Book | Book Chapter | Conference Paper | Review | Working Paper | Other
journal: "Journal of Southeast Asian Studies"
volume: "55"
issue: "2"
pages: "241–268"
language: "en"                # "en" → PDF folder publications_english, "th" → publications_thai
pdf: "sacred-landscapes-north-thailand.pdf"   # file name inside the language folder
doi: "10.1017/xxx"            # optional → renders a DOI link
tags: ["religion", "ritual"]  # optional → chips on the card
citation: "…"                 # optional → overrides the auto-generated citation
---

The abstract goes here as Markdown. Long abstracts (≈ 300+ characters) automatically
collapse to 3 lines with an "more… / show less" toggle.
```

Where each field appears on the page (`src/components/PublicationCard.astro`):

| Field | Where it renders |
| ----- | ---------------- |
| `type` | Badge, translated via the UI dictionary (`t.typeLabels`) |
| `year` | Next to the type badge |
| `title` | Card heading |
| `authors` | One line under the title |
| `journal` | Italic venue line |
| `tags` | Up to 3 chips |
| body | Abstract with toggle |
| `pdf` | "Download PDF" button (URL resolved by `pdfUrl()` in `src/lib/publications.ts`) |
| `doi` | DOI link |
| `citation` | Footer citation (auto-built from the fields if omitted) |

Pages render via `getCollection('publications')`, filtered by `language`, sorted by `year`
descending (`sortByYearDesc`).

### 3.2 Events / photo galleries

**Files:** `src/content/events/<name>.md` — one per event. The Markdown **body is the English
description**; the Thai translation lives in the `descriptionTh` frontmatter field.

**Photos:** `public/pictures/<album>/` — all files with image extensions
(`jpg jpeg png webp gif avif svg`) are picked up automatically at build time by
`src/lib/albums.ts`. No need to list them anywhere.

```markdown
---
title: "Sacred Landscapes Fieldwork"
date: 2024-02-12
location: "Chiang Mai & Lamphun Provinces, Thailand"
album: "album1"                       # folder name under public/pictures/
cover: "photo-01.jpg"                 # optional; defaults to the first photo
descriptionTh: >                      # optional Thai description
  บันทึกภาคสนามเชิงชาติพันธุ์วรรณนา…
tags: ["fieldwork", "religion", "pilgrimage"]
---

English description in Markdown. Shown on the English page; on the Thai page it is
replaced by `descriptionTh` when present.
```

Rendering rules on `/events/<slug>` (`src/components/pages/EventGalleryPage.astro`):

1. Header: `title`, formatted `date`, `location`, photo count.
2. Description: Thai page → `descriptionTh` if present, otherwise falls back to the English body.
   English page → Markdown body.
3. Photo grid + lightbox: all photos from `public/pictures/<album>/`.

### 3.3 About-page biography blocks

**Files:** `src/content/about/<nn>-<slug>.md` — one Markdown file per biography block, rendered
on the About page in `order` ascending. Add more files to add more paragraphs; no code changes.

```markdown
---
order: 2
image: "/pictures/about/photo-01.jpg"   # optional public image path
imageOnly: true                         # optional: standalone centered figure (no text column)
caption: "Ethnographic fieldwork in the upper Mekong region, 2019."   # EN caption (also alt text)
captionTh: "งานภาคสนามเชิงชาติพันธุ์วรรณนา…"                            # Thai caption
textTh: >                               # optional Thai translation (plain text)
  งานสนามหลักของผมอยู่ในภาคเหนือของประเทศไทย…
---

The English text of this block, as Markdown.
```

Rendering rules (`src/components/pages/AboutPage.astro`):

1. Blocks render in `order`; blocks with an `image` become a two-column row (image + text) that
   alternates sides for visual variety.
2. Set `imageOnly: true` to render **just the image + caption** as a standalone figure, centered
   in the column (`max-w-xl` image, centered caption) — the body/`textTh` are ignored. Useful for
   full-bleed pictures with a description.
3. The image is a `<figure>` with a `<figcaption>` (semantic HTML, good for SEO); the caption
   doubles as the `alt` text. Thai pages use `captionTh`, English pages use `caption`.
4. Text: Thai page → `textTh` when present (plain text), otherwise the English Markdown body.
5. The About page ships `ProfilePage` JSON-LD with `mainEntity: Person` (shared `personLd()`
   helper in `src/lib/seo.ts`).

Placeholder images live in `public/pictures/about/` (generated by
`npm run generate:placeholders`, git-ignored).

---

## 4. The bilingual (i18n) system

### 4.1 URL scheme

Configured in `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'th'],
  routing: { prefixDefaultLocale: false },
},
```

- **English** (default locale) → root URLs: `/about`, `/publications/english`, `/events/album1`
- **Thai** → prefixed: `/th/about`, `/th/publications/english`, `/th/events/album1`

> **Rule (Astro constraint):** with `prefixDefaultLocale: false` the *file structure must mirror
> the URL structure*. English page files live at `src/pages/` root and Thai page files under
> `src/pages/th/`. Do **not** switch to a `[lang]` dynamic-route pattern unless you also set
> `prefixDefaultLocale: true` — Astro will otherwise generate `/en/…` paths (or fail).

> **Is `src/pages/th` removable?** No. Empirically verified: moving `src/pages/th/` aside drops
> the build from 18 pages to 9 — the i18n config does *not* auto-generate `/th` pages from the
> root files. Astro's i18n routing only maps existing files to URLs; it never synthesizes pages
> for other locales. The only alternative URL scheme is `prefixDefaultLocale: true` (everything
> prefixed, `/en/` + `/th/`), which would change every existing English URL — not worth it. Keep
> the thin `th/` wrappers.

### 4.2 Where UI text lives

`src/i18n/dictionaries.ts` is the single source of truth for every UI string. The `en` object
defines the shape; `const th: Dictionary` is type-checked to cover **every** key:

```ts
const en = { nav: { home: 'Home', … }, common: { downloadPdf: 'Download PDF', … }, … };
export type Dictionary = typeof en;
const th: Dictionary = { nav: { home: 'หน้าแรก', … }, … };   // missing key → compile error
export const dictionaries = { en, th };
```

Rules:

- **Never hardcode UI text in a component/page.** Always read it via
  `const t = getDictionary(lang)` and use `t.section.key`.
- To add a string: add the key to **both** `en` and `th`.
- Functions are allowed for dynamic strings, e.g. `showingOf: (n, m) => …`; they are called with
  the template placeholders `'{n}'`/`'{m}'` and interpolated in the inline filter script.
- **The `en` dictionary must always hold English text** — even for keys about Thai content
  (`thTitle`, `thIntro`, `thaiCardTitle`, `thaiCardText`, `backToTh`, …). Past bugs rendered
  Thai UI on English pages because the `en` values were Thai. Only the `th` block contains Thai
  UI text.
- Site identity (name, email, addresses, profile links) is *not* a UI string — it lives in
  `src/site.config.ts`, with Thai variants for Thai pages: `nameTh`, `titleTh`,
  `affiliationTh`, `addressTh`. The footer, nav brand, and contact address pick the right one
  based on `lang`.

### 4.3 How a page is wired (both languages)

Each page = **2 thin page files** + **1 shared component**:

```astro
---                                 ---
// src/pages/about.astro             // src/pages/th/about.astro
import AboutPage from '…/AboutPage.astro';
---                                 ---
<AboutPage lang="en" />              <AboutPage lang="th" />
```

The shared component (`src/components/pages/AboutPage.astro`) does all the work:

```astro
interface Props { lang: Locale }
const { lang } = Astro.props;
const t = getDictionary(lang);
const prefix = lang === 'th' ? '/th' : '';   // prefix every internal link
```

**Thread the `lang` prop everywhere:** every component that renders UI text takes
`lang?: Locale` (or receives the already-translated dictionary) — `Nav`, `Footer`,
`PublicationCard`, `PublicationList`, `EventCard`, `PhotoGallery`, `AbstractToggle` (labels),
`PublicationLangPage`. If you add a component that shows text, give it a `lang` prop and look up
its strings from the dictionary.

**Links inside Thai pages must be prefixed** with `/th` (`${prefix}/about`). This is the most
common place to introduce a broken link — the English URL exists, so nothing 404s in dev, but the
Thai visitor lands on the English page. Search for every `href=` when adding markup.

### 4.4 How EN ⇄ TH switching works

- **Nav switcher** (`src/components/Nav.astro`): shows `ไทย` on English pages and `English` on
  Thai pages. It links to the *same page in the other language* via
  `otherLocaleUrl(lang, pathname)` (`src/i18n/index.ts`), which strips the `/th/` prefix and
  rebuilds the URL with `getRelativeLocaleUrl` from `astro:i18n`. Works for deep links too
  (`/events/album1` ⇄ `/th/events/album1`).
- **Active nav highlighting** compares the *neutral path* (`neutralPath(lang, pathname)`), so the
  same link is highlighted on both `/about` and `/th/about`.
- **Head metadata** (`src/layouts/Layout.astro`): `html lang`, canonical (per locale), and
  `<link rel="alternate" hreflang="en|th">` + `x-default` built with `getAbsoluteLocaleUrl` on
  the neutral path. `og:locale` is `en_US` / `th_TH`.
- **Sitemap** (`astro.config.mjs`): the `sitemap()` integration needs its own explicit
  `i18n: { defaultLocale, locales: { en: 'en', th: 'th' } }` option to emit
  `<xhtml:link rel="alternate" hreflang="…">` pairs.

### 4.5 The publications sub-page matrix

`/publications/english|thai` and `/th/publications/english|thai` are a 2×2 matrix of
**UI language × publication language**, rendered by `PublicationLangPage` with two props:

| URL | `lang` (UI) | `language` (which pubs) |
| --- | ----------- | ----------------------- |
| `/publications/english` | `en` | `en` |
| `/publications/thai` | `en` | `th` |
| `/th/publications/english` | `th` | `en` |
| `/th/publications/thai` | `th` | `th` |

Each page links to the *other* publication language (e.g. `/th/publications/thai` links back to
`/th/publications/english`) via `backTarget`. The button labels come from `backToEn`/`backToTh`
in the dictionary — "View English/Thai publications" in English, "ดูสิ่งพิมพ์ภาษาอังกฤษ/ภาษาไทย"
in Thai. The link text must follow the **UI** language (a Thai-content page on the English site
still shows English button text).

> **Pitfall:** `backTarget` must be the route segments `'english'`/`'thai'`, never `'en'`/`'th'`
> — the latter produced broken `/publications/en` URLs.

---

## 5. Common workflows

### Add a publication (2 steps)

1. Drop the PDF into `public/publications_english/` (or `public/publications_thai/`).
2. Create `src/content/publications/en/2025-my-title.md` (or `th/…`) using the template in §3.1.
   Set `language`, `pdf` (exact file name), and write the abstract in the body.

The card, sort order, citation, abstract toggle, and download button all appear automatically on
both language sites (UI text comes from the dictionary).

### Add an event / photo gallery (2 steps)

1. Create `public/pictures/<album>/` and drop photos in it.
2. Create `src/content/events/<name>.md` with `album`, `date`, and (for the Thai page) a
   `descriptionTh`.

A card appears on `/events` and `/th/events`; the child page `/events/<name>` and
`/th/events/<name>` is generated with the photo grid + lightbox.

### Add or change a UI string

1. Open `src/i18n/dictionaries.ts`.
2. Add/edit the key under **both** `en` and `th`.
3. Use it in the component via `const t = getDictionary(lang)` → `t.section.key`.

### Add a brand-new page (e.g. "Teaching")

1. Create the shared body component `src/components/pages/TeachingPage.astro` that takes
   `{ lang: Locale }`, uses `getDictionary(lang)`, and prefixes internal links with
   `lang === 'th' ? '/th' : ''`.
2. Create the two thin page files:
   - `src/pages/teaching.astro` → `<TeachingPage lang="en" />`
   - `src/pages/th/teaching.astro` → `<TeachingPage lang="th" />`
3. Add `teaching` to the `links` array in `Nav.astro` and its label to both dictionaries
   (`nav.teaching`).
4. Run `npm run check` and `npm run build`; confirm `/teaching` and `/th/teaching` render.

### Change site identity (name, title, email, address, profiles)

Edit `src/site.config.ts`. Provide **both languages** for everything displayed on Thai pages:
`name`/`nameTh`, `title`/`titleTh`, `affiliation`/`affiliationTh`, `address`/`addressTh`.
These are consumed by the footer, the nav brand (including the monogram initial, which derives
from the localized name), and the contact page.

If the owner's name changes, also update:

- `INITIALS` at the top of `scripts/generate-og-image.mjs` and the `<text>` in `public/favicon.svg`,
  then run `npm run generate:og` (or delete the files and rebuild).
- The `site` URL in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt`.

---

## 6. Rules & pitfalls

1. **Never hardcode UI text** — use `src/i18n/dictionaries.ts`. The `en` block must hold
   **English** text even for Thai-content pages (the `th` block is the only place Thai UI text
   belongs).
2. **Never write a page only in one language.** Root file (en) + `th/` file are both required;
   keep them thin wrappers around a shared component.
3. **`[lang]` dynamic routes don't work with `prefixDefaultLocale: false`.** Use explicit
   root + `th/` folders.
4. **Prefix internal links with `/th` on Thai pages** (`${prefix}/…`) — the most common i18n bug.
5. **Cross-language links use the route segments `english`/`thai`**, never `en`/`th`
   (`PublicationLangPage`'s `backTarget`).
6. **Inline scripts with `define:vars` must be `is:inline`** and cannot use TypeScript type
   annotations (e.g. `PublicationList.astro`, `PhotoGallery.astro`, `ContactPage.astro`).
7. **Event bodies are English.** To show Thai text on `/th/events/…`, add `descriptionTh`
   (rendered as plain text with line breaks preserved; Markdown is not rendered there).
8. **Thai year display** uses Buddhist Era (`latestNote` adds 543 to the CE `year` in the Thai
   dictionary only) — keep CE years in the Markdown frontmatter.
9. **Sitemap alternates** need the explicit `i18n` option on the `sitemap()` integration
   (§4.4); they are not inferred from the Astro `i18n` config.
10. **Sample content** (`npm run generate:placeholders`) never overwrites existing files and its
    output is git-ignored. The OG image / touch icon (`public/og-image.png`,
    `public/favicon-180.png`) are real committed assets.
11. **Content schema changes** (new frontmatter field) go in `src/content.config.ts`; old
    Markdown files that omit optional fields are fine (`.optional()`), but required fields fail
    the build with a clear message.

---

## 7. Verification checklist

```bash
npm run check     # 0 errors expected (1 benign hint about AbstractToggle Props is known)
npm run build     # 18 pages: 9 English (root) + 9 Thai (/th/)
```

Manual spot checks after a change:

- `/` and `/th/` render the hero in the right language.
- The nav switcher (`ไทย` / `English`) maps deep links correctly
  (`/publications/thai` ⇄ `/th/publications/thai`, `/events/album1` ⇄ `/th/events/album1`).
- The active nav item is highlighted on both locales.
- `dist/sitemap-0.xml` contains `<xhtml:link rel="alternate" hreflang="en|th">` pairs.
- A long abstract (> 300 chars) shows the "more… / show less" toggle; a short one doesn't.
- Thai pages declare `<html lang="th">` and show Thai UI text.
