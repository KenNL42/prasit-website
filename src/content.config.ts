import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Publication entries. One Markdown file per publication:
 *
 *   src/content/publications/en/2024-sacred-landscapes.md   → English
 *   src/content/publications/th/2566-phithikam.md           → Thai
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
     * PDF file name inside the language folder (e.g. "sacred-landscapes.pdf").
     * A value starting with "/" is treated as an absolute path instead.
     * Omit if there is no downloadable file.
     */
    pdf: z.string().optional(),
    doi: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Optional pre-formatted citation line (overrides the auto-generated one). */
    citation: z.string().optional(),
  }),
});

/**
 * Event / fieldwork gallery entries. One Markdown file per event:
 *
 *   src/content/events/album1.md
 *
 * `album` is the folder name inside `public/pictures/` that holds the
 * photos (jpg, png, webp, gif, avif, svg). Photos are picked up
 * automatically — no need to list them by hand.
 */
const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    /** Display date of the event. */
    date: z.coerce.date(),
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

export const collections = { publications, events, about };
