/**
 * Converts the professor's Word bibliography (resources/ผลงานวิชาการ.docx)
 * into the Markdown used by the Relevant Archives page
 * (src/content/archives/bibliography.md).
 *
 *   node scripts/convert-bibliography.mjs
 *
 * Runs automatically before every build (see package.json `prebuild`), so
 * editing the Word file and rebuilding updates the site. The DOCX is the
 * source of truth; the .md file is generated output (committed for
 * convenience, regenerated on each build).
 *
 * Expected format of the Word file (see README):
 *   - Optional title line: ผลงานวิชาการ
 *   - Section headers exactly: บทความและหนังสือภาษาไทย / บทความและหนังสือภาษาอังกฤษ
 *   - Solo-author line (ประสิทธิ์ ลีปรีชา / Prasit Leepreecha) after each header
 *   - Entries start with a 4-digit year (optionally followed by ก/ข/ค or
 *     a/b/c) then the citation on the same line
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
const DOCX = join(root, 'resources', 'ผลงานวิชาการ.docx');
const OUT = join(root, 'src', 'content', 'archives', 'bibliography.md');

const SECTIONS = new Set(['ผลงานวิชาการ', 'บทความและหนังสือภาษาไทย', 'บทความและหนังสือภาษาอังกฤษ']);
const SOLO = new Set(['ประสิทธิ์ ลีปรีชา', 'Prasit Leepreecha']);
const YEAR_RE = /^(\d{4})([ก-ฮa-z]?)[.\s\t:]/;

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

const header = `<!--
  Auto-generated from resources/ผลงานวิชาการ.docx by
  scripts/convert-bibliography.mjs — do not edit by hand.
  Edit the Word file and rebuild (or run npm run convert:bibliography).
-->

`;

function main() {
  if (!existsSync(DOCX)) {
    console.warn(`[convert-bibliography] ${DOCX} not found — leaving ${OUT} unchanged.`);
    return;
  }
  const zip = new AdmZip(DOCX);
  const xml = zip.readAsText('word/document.xml');
  const lines = extractLines(xml);
  const items = parse(toBlocks(lines));

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

  writeFileSync(OUT, header + md.join('\n\n') + '\n', 'utf8');
  const entries = items.filter(([k]) => k === 'E').length;
  const authors = items.filter(([k]) => k === 'A').length;
  const sections = items.filter(([k]) => k === 'H').length;
  console.log(`[convert-bibliography] wrote ${OUT}: ${entries} entries, ${authors} author groups, ${sections} sections.`);
}

import { existsSync } from 'node:fs';
main();