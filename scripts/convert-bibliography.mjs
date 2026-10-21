/**
 * Converts the professor's two Word bibliographies into the Markdown used
 * by the Relevant Archives pages:
 *
 *   resources/relevant_publication_archives_Thai.docx    -> src/content/archives/th.md
 *   resources/relevant_publication_archives_english.docx -> src/content/archives/en.md
 *
 * The Thai file feeds /th/publications/archives, the English file feeds
 * /publications/archives (each file carries a `language:` frontmatter).
 *
 *   node scripts/convert-bibliography.mjs
 *
 * Runs automatically before every build (see package.json `prebuild`), so
 * editing a Word file and rebuilding updates the site. The DOCX files are
 * the source of truth; the .md files are generated output (committed for
 * convenience, regenerated on each build).
 *
 * Expected format of the Word files (see README):
 *   - Optional title line: ผลงานวิชาการ / Publications
 *   - Section headers exactly: บทความและหนังสือภาษาไทย / บทความและหนังสือภาษาอังกฤษ
 *   - Solo-author line (ประสิทธิ์ ลีปรีชา / Prasit Leepreecha) after each header
 *   - Entries start with a 4-digit year (optionally followed by ก/ข/ค or
 *     a/b/c, or directly by a quotation mark) then the citation
 *   - Co-authored works: author name(s) on their own line, then the
 *     entries, separated from the previous group by a blank line
 *   - Long citations may wrap onto the next lines — they are joined into
 *     the entry automatically
 */
import AdmZip from 'adm-zip';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAIRS = [
  {
    docx: 'relevant_publication_archives_Thai.docx',
    out: 'th.md',
    lang: 'th',
    title: 'ผลงานวิชาการ',
  },
  {
    docx: 'relevant_publication_archives_english.docx',
    out: 'en.md',
    lang: 'en',
    title: 'Publications',
  },
];

const SECTIONS = new Set(['ผลงานวิชาการ', 'Publications', 'บทความและหนังสือภาษาไทย', 'บทความและหนังสือภาษาอังกฤษ']);
const SOLO = new Set(['ประสิทธิ์ ลีปรีชา', 'Prasit Leepreecha']);
const YEAR_RE = /^(\d{4})([ก-ฮa-z]?)[.\s\t:“”]/;

/** Extract the paragraph text lines from word/document.xml.
 *  Empty paragraphs (blank lines) are kept — they separate author groups. */
function extractLines(xml) {
  return xml
    .replace(/<w:tab[^>]*\/>/g, '\t')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map((l) => l.trim());
}

/** Split lines into blocks separated by blank lines. */
function toBlocks(lines) {
  const blocks = [];
  let cur = [];
  for (const l of lines) {
    if (l === '') {
      if (cur.length) blocks.push(cur);
      cur = [];
    } else {
      cur.push(l);
    }
  }
  if (cur.length) blocks.push(cur);
  return blocks;
}

function nameMarker(l) {
  return (
    l.includes(' และ') ||
    l.includes(' and ') ||
    l.includes(' & ') ||
    l.includes('et al') ||
    l.includes('eds.') ||
    l.endsWith('eds') ||
    (l.match(/,/g) || []).length >= 3
  );
}

function isAuthorLabel(l, nxt) {
  if (l.includes(':')) return false; // citations contain colons; author lists don't
  if (!nameMarker(l)) return false;
  if (l.length > 150) return false;
  if (nxt === undefined || nxt === null) return false;
  if (YEAR_RE.test(nxt)) return true;
  if (l.includes('et al') || l.includes('eds.') || l.endsWith('eds')) return true;
  return false;
}

/** Build [kind, text] items from the blocks. */
function parse(blocks) {
  const out = [];
  for (const block of blocks) {
    let firstInBlock = true;
    let i = 0;
    while (i < block.length) {
      const l = block[i];
      const nxt = block[i + 1];
      if (SECTIONS.has(l)) {
        out.push(['H', l]);
        i += 1;
        firstInBlock = false;
        continue;
      }
      if (SOLO.has(l) && nxt && YEAR_RE.test(nxt)) {
        out.push(['A', l]);
        i += 1;
        firstInBlock = false;
        continue;
      }
      if (YEAR_RE.test(l)) {
        const text = [l];
        i += 1;
        while (i < block.length) {
          const n2 = block[i];
          const n3 = block[i + 1];
          if (YEAR_RE.test(n2) || isAuthorLabel(n2, n3)) break;
          text.push(n2);
          i += 1;
        }
        out.push(['E', text.join(' ')]);
        firstInBlock = false;
        continue;
      }
      if ((firstInBlock && nameMarker(l) && !l.includes(':') && l.length <= 110) || isAuthorLabel(l, nxt)) {
        out.push(['A', l]);
        i += 1;
        firstInBlock = false;
        continue;
      }
      const text = [l];
      i += 1;
      while (i < block.length) {
        const n2 = block[i];
        const n3 = block[i + 1];
        if (YEAR_RE.test(n2) || isAuthorLabel(n2, n3)) break;
        text.push(n2);
        i += 1;
      }
      out.push(['E', text.join(' ')]);
      firstInBlock = false;
    }
  }
  return out;
}

function main() {
  let totalEntries = 0;
  for (const { docx, out, lang, title } of PAIRS) {
    const docxPath = join(root, 'resources', docx);
    const outPath = join(root, 'src', 'content', 'archives', out);
    if (!existsSync(docxPath)) {
      console.warn(`[convert-bibliography] ${docxPath} not found — leaving ${outPath} unchanged.`);
      continue;
    }
    const zip = new AdmZip(docxPath);
    const xml = zip.readAsText('word/document.xml');
    const items = parse(toBlocks(extractLines(xml)));

    const md = [];
    for (const [kind, t] of items) {
      let text = t.replace(/\s+/g, ' ').trim();
      if (kind === 'H') md.push(`## ${text}`);
      else if (kind === 'A') md.push(`**${text}**`);
      else {
        // A year followed by a period ("2020. …") would parse as an ordered
        // list in Markdown — escape the period so it stays a bullet.
        text = text.replace(/^(\d{4})\. /, '$1\\. ');
        md.push(`- ${text}`);
      }
    }

    const body = `---
language: ${lang}
title: "${title}"
---

<!--
  Auto-generated from resources/${docx} by
  scripts/convert-bibliography.mjs — do not edit by hand.
  Edit the Word file and rebuild (or run npm run convert:bibliography).
-->

` + md.join('\n\n') + '\n';

    writeFileSync(outPath, body, 'utf8');
    const entries = items.filter(([k]) => k === 'E').length;
    const authors = items.filter(([k]) => k === 'A').length;
    totalEntries += entries;
    console.log(`[convert-bibliography] wrote ${outPath}: ${entries} entries, ${authors} author groups.`);
  }
  console.log(`[convert-bibliography] done (${totalEntries} entries total).`);
}

import { existsSync } from 'node:fs';
main();