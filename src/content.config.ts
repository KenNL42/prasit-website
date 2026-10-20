import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Publication entries. One Markdown file per publication:
 *
 *   src/content/publications/en/2025-voices-of-the-voiceless.md   → English
 *   src/content/publications/th/2541-hmong-and-drug.md            → Thai
 *
 * The PDF filename stored in `pdf` is resolved against
 * `public/publications_english/` (language: "en") or
 * `public/publications_thai/` (language: "th").
 *
 * The abstract is written as the Markdown body of the file, so long
 * abstracts stay readable and are easy to edit.
 */
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    /** List of authors, the site owner first. */
    authors: z.array(z.string()).default([]),
    year: z.number(),
    type: z
      .enum(['Journal Article', 'Book', 'Book Chapter', 'Conference Paper', 'Review', 'Working Paper', 'Other'])
      .default('Journal Article'),
    /** Journal / book / venue name. */
    journal: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    /** "en" or "th" — decides which PDF folder is used and the display language. */
    language: z.enum(['en', 'th']),
    /**
     * PDF file name inside the language folder (e.g. "voices-of-the-voiceless.pdf").
     * A value starting with "/" is treated as an absolute path instead.
     * Omit if there is no downloadable file.
     */
    pdf: z.string().optional(),
    doi: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Optional pre-formatted citation line (overrides the auto-generated one). */
    citation: z.string().optional(),
    /**
     * Whether the PDF may be downloaded. Default true. When false the PDF is
     * not served from public/ at all — its pages are rendered to images
     * (scripts/render-viewer.py) and the card links to the /view/<id> reader.
     */
    downloadable: z.boolean().default(true),
    /**
     * Whether the entry is shown at all (reserved for future use; the
     * Google Sheets tracker also records this column). Default true.
     */
    viewable: z.boolean().default(true),
  }),
});

/**
 * Photo gallery entries — one Markdown file per person/album:
 *
 *   src/content/photos/album1.md
 *
 * `album` is the folder name inside `public/pictures/` that holds that
 * person's photos (jpg, png, webp, gif, avif, svg). Photos are picked up
 * automatically — no need to list them by hand. Each entry becomes a
 * subpage under /photos/.
 */
const photos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/photos' }),
  schema: z.object({
    /** The person's name (used as the card title and subpage heading). */
    title: z.string(),
    /** Optional date associated with the gallery. */
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    /** Folder name under public/pictures/ containing the photos. */
    album: z.string(),
    /** Optional explicit cover photo file name; defaults to the first photo. */
    cover: z.string().optional(),
    /** Optional Thai translation of the description (shown on /th/ pages). */
    descriptionTh: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/**
 * Relevant Archives — publications with NO downloadable PDF.
 *
 * This is a SINGLE markdown file whose body is the whole bibliography /
 * citation list (src/content/archives/bibliography.md). Paste your
 * citations there as a Markdown list — no need to manage one file per
 * work. The body is rendered as-is on /publications/archives (both
 * languages share the same content).
 */
const archives = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/archives' }),
  // No schema: the file is free-form Markdown (any frontmatter is allowed).
});

/**
 * About-page biography blocks. One Markdown file per block, rendered in
 * order on the About page:
 *
 *   src/content/about/01-introduction.md
 *   src/content/about/02-fieldwork.md   ← optional image + caption
 *
 * The Markdown body is the English text; `textTh` is the Thai translation
 * (plain text, shown on /th/ pages — falls back to the body if absent).
 * `image` is a public path (e.g. /pictures/about/photo-01.jpg) with an
 * English caption (also used as alt text) and an optional Thai caption.
 */
const about = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/about' }),
  schema: z.object({
    /** Render order on the page (ascending). */
    order: z.number().default(0),
    /** Optional image shown beside this block (public path). */
    image: z.string().optional(),
    /**
     * Render ONLY the image + caption as a standalone figure, centered in
     * the column (the body/textTh are ignored). Default: text beside image.
     */
    imageOnly: z.boolean().default(false),
    /** English caption under the image (also the alt text). */
    caption: z.string().optional(),
    /** Thai caption under the image (used on /th/ pages). */
    captionTh: z.string().optional(),
    /**
     * Thai translation of the body — also Markdown (paragraphs, lists,
     * etc.), rendered via `marked`. Falls back to the English body.
     */
    textTh: z.string().optional(),
  }),
});

/**
 * Thai Books — books (authored/edited) with PDFs and cover images.
 *
 *   src/content/thai_books/<slug>.md   → one file per book
 *
 * The PDF lives in public/books/<pdf> and the cover image (rendered from
 * the book's first page) in public/books/covers/<cover>. Years are the
 * Thai Buddhist era as printed (e.g. 2568) — these are Thai-only works.
 */
const thaiBooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thai_books' }),
  schema: z.object({
    title: z.string(),
    /** List of authors/editors. */
    authors: z.array(z.string()).default([]),
    /** Buddhist era year printed on the book (e.g. 2568). */
    year: z.number(),
    /** PDF file name inside public/books/. */
    pdf: z.string(),
    /** Cover image file name inside public/books/covers/. */
    cover: z.string(),
    /**
     * Whether the PDF may be downloaded. Default true. When false the PDF
     * is not served and its pages are shown in the /view/<id> reader.
     */
    downloadable: z.boolean().default(true),
    /** Whether the book is shown at all (reserved; tracked in the sheet). */
    viewable: z.boolean().default(true),
  }),
});

export const collections = { publications, photos, about, archives, thaiBooks };
