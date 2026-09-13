import type { CollectionEntry } from 'astro:content';

export type Publication = CollectionEntry<'publications'>;

/** Folder names used in `public/` for each publication language. */
export const PDF_FOLDERS: Record<'en' | 'th', string> = {
  en: 'publications_english',
  th: 'publications_thai',
};

export const LANGUAGE_LABELS: Record<'en' | 'th', string> = {
  en: 'English',
  th: 'ไทย (Thai)',
};

/**
 * Resolve the downloadable PDF URL for a publication.
 * `pdf` is a bare file name resolved against the language folder;
 * a value starting with "/" is treated as an absolute path.
 */
export function pdfUrl(pub: Publication): string | undefined {
  const { pdf, language } = pub.data;
  if (!pdf) return undefined;
  if (pdf.startsWith('/')) return pdf;
  return `/${PDF_FOLDERS[language]}/${pdf}`;
}

/** Build a short citation string from the frontmatter fields. */
export function buildCitation(pub: Publication): string {
  const { authors, year, title, journal, volume, issue, pages, type, language } = pub.data;
  if (pub.data.citation) return pub.data.citation;

  const authorLine =
    authors.length > 0 ? authors.join(', ') : language === 'th' ? 'นิรันดร์ จันทนา' : 'Author';

  const parts = [authorLine];
  if (year) parts.push(`(${year})`);
  parts.push(`“${title}”`);
  if (journal) parts.push(journal);
  const detail = [volume && `Vol. ${volume}`, issue && `No. ${issue}`, pages].filter(Boolean).join(', ');
  if (detail) parts.push(detail);
  if (type && !journal) parts.push(`[${type}]`);
  return parts.join(' ');
}

export function sortByYearDesc(pubs: Publication[]): Publication[] {
  return [...pubs].sort((a, b) => b.data.year - a.data.year);
}
