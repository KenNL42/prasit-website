import type { CollectionEntry } from 'astro:content';

export type Publication = CollectionEntry<'publications'>;

/** Folder names used in `public/` for each publication language. */
export const PDF_FOLDERS: Record<'en' | 'th', string> = {
  en: 'publications_english',
  th: 'publications_thai',
};

/**
 * Resolve the downloadable PDF URL for a publication.
 * `pdf` is a bare file name resolved against the language folder;
 * a value starting with "/" is treated as an absolute path.
 *
 * Returns undefined when the entry is view-only (`downloadable: false`):
 * its PDF is not served from public/, only the /view/<id> page images are.
 */
export function pdfUrl(pub: Publication): string | undefined {
  const { pdf, language, downloadable } = pub.data;
  if (downloadable === false) return undefined;
  if (!pdf) return undefined;
  if (pdf.startsWith('/')) return pdf;
  return `/${PDF_FOLDERS[language]}/${pdf}`;
}

/**
 * The online reader URL for a view-only entry (downloadable: false),
 * e.g. "/view/2550-ระบบการศึกษาและภาษาในกระบวนการสร้างรัฐชาติไทย".
 * The slug is the Markdown file's base name (id without the en/th folder
 * prefix), which also names the public/pdf-pages/<slug> image folder.
 */
export function viewerUrl(pub: Publication | CollectionEntry<'thaiBooks'>): string {
  const slug = pub.id.split('/').pop()!.replace(/\s+/g, '-').toLowerCase();
  return `/view/${encodeURIComponent(slug)}`;
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
