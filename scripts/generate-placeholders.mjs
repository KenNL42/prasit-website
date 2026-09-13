/**
 * Generates placeholder PDFs (for the publications) and SVG images
 * (for the event albums) so the site has content to display out of the box.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Safe to re-run: existing files are left untouched (writes are skipped
 * when the target already exists), and everything it creates is listed
 * in .gitignore so real files are never overwritten.
 */
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ */
/* Minimal single-page PDF generator                                   */
/* ------------------------------------------------------------------ */

function escapePdfText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function makePdf(title, subtitle, lineCount = 8) {
  const streamLines = [
    'BT /F1 18 Tf 72 700 Td (' + escapePdfText(title) + ') Tj ET',
    'BT /F2 11 Tf 72 676 Td (' + escapePdfText(subtitle) + ') Tj ET',
  ];
  for (let i = 0; i < lineCount; i++) {
    streamLines.push(`BT /F1 10 Tf 72 ${640 - i * 18} Td (Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor) Tj ET`);
  }
  const stream = streamLines.join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

/* ------------------------------------------------------------------ */
/* SVG placeholder image generator                                     */
/* ------------------------------------------------------------------ */

function makeSvg(label, subtitle, hue) {
  const [h1, h2] = hue;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h1}"/>
      <stop offset="100%" stop-color="${h2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect width="1200" height="900" fill="url(#glow)"/>
  <circle cx="150" cy="150" r="90" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="1050" cy="760" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
  <text x="600" y="430" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" fill="#ffffff" fill-opacity="0.95">${label}</text>
  <text x="600" y="480" text-anchor="middle" font-family="Tahoma, sans-serif" font-size="22" letter-spacing="6" fill="#ffffff" fill-opacity="0.7">${subtitle}</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/* Content definitions                                                 */
/* ------------------------------------------------------------------ */

const pdfs = [
  {
    file: 'public/publications_english/sacred-landscapes-north-thailand.pdf',
    title: 'Ritual, Memory, and the Making of Sacred Landscapes in Northern Thailand',
    subtitle: 'Journal of Southeast Asian Studies, 2024 (placeholder file)',
  },
  {
    file: 'public/publications_english/material-culture-politics-belonging.pdf',
    title: 'Material Culture and the Politics of Belonging among Highland Communities',
    subtitle: 'American Anthropologist, 2022 (placeholder file)',
  },
  {
    file: 'public/publications_english/fieldwork-ethics-post-conflict.pdf',
    title: 'Fieldwork Ethics in Post-Conflict Ethnography',
    subtitle: 'Book chapter, Routledge, 2021 (placeholder file)',
  },
  {
    file: 'public/publications_english/soundscapes-temple-festivals.pdf',
    title: 'Soundscapes of Temple Festivals in Urban Chiang Mai',
    subtitle: 'Journal of Urban Anthropology, 2020 (placeholder file)',
  },
  {
    file: 'public/publications_thai/phithikam-khwam-songjam.pdf',
    title: 'Phithikam lae khwam songjam: withi manutsayawitthaya haeng phuenthi saksit',
    subtitle: 'Warasan Sangkhomsat, 2023 (placeholder file)',
  },
  {
    file: 'public/publications_thai/chatiphan-wannakam-sathapattayakam.pdf',
    title: 'Chatiphan wannakam lae sathapattayakam haeng khwam songjam',
    subtitle: 'Warasan Manutsayawitthaya, 2022 (placeholder file)',
  },
];

const albums = [
  {
    folder: 'public/pictures/album1',
    label: 'Sacred Landscapes Fieldwork',
    subtitle: 'CHIANG MAI · 2024',
    hues: [
      ['#1d4a3e', '#2c6654'],
      ['#7a5c2e', '#a9853b'],
      ['#3d4f6b', '#5f7f9e'],
      ['#6b3d2e', '#a0603b'],
    ],
    count: 6,
  },
  {
    folder: 'public/pictures/album2',
    label: 'Conference on Memory & Heritage',
    subtitle: 'CHIANG MAI UNIVERSITY · 2023',
    hues: [
      ['#374151', '#5f7f6e'],
      ['#14532d', '#2c6654'],
      ['#7c2d12', '#b4552d'],
    ],
    count: 5,
  },
];

/* ------------------------------------------------------------------ */
/* Write everything (skip files that already exist)                    */
/* ------------------------------------------------------------------ */

let created = 0;
let skipped = 0;

for (const pdf of pdfs) {
  const target = join(root, pdf.file);
  mkdirSync(dirname(target), { recursive: true });
  if (existsSync(target)) {
    skipped++;
    continue;
  }
  writeFileSync(target, makePdf(pdf.title, pdf.subtitle));
  created++;
}

for (const album of albums) {
  for (let i = 1; i <= album.count; i++) {
    const target = join(root, album.folder, `photo-${String(i).padStart(2, '0')}.svg`);
    mkdirSync(dirname(target), { recursive: true });
    if (existsSync(target)) {
      skipped++;
      continue;
    }
    const hue = album.hues[(i - 1) % album.hues.length];
    writeFileSync(target, makeSvg(`${album.label} — ${i}`, album.subtitle, hue));
    created++;
  }
}

console.log(`Placeholders created: ${created}  (already present, skipped: ${skipped})`);
