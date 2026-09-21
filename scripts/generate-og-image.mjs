/**
 * Generates the Open Graph share image (1200×630) and the Apple touch
 * icon (180×180) as real PNGs — no external dependencies.
 *
 *   node scripts/generate-og-image.mjs
 *
 * The design matches the site theme (navy gradient, gold accent, serif
 * monogram). If the owner's name changes in src/site.config.ts, update
 * the INITIALS constant below to match.
 *
 * Existing files are never overwritten; delete them to regenerate.
 */
import { deflateSync } from 'node:zlib';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Update these to match src/site.config.ts */
const INITIALS = 'PL';
const WORDMARK = 'ANTHROPOLOGY';

/* ------------------------------------------------------------------ */
/* Bitmap font (5×7) — standard 5x7 pixel glyphs for A–Z and 0–9.      */
/* ------------------------------------------------------------------ */

const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  0: [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  1: [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  2: [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  3: [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  4: [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  5: [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  6: [0b01110, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  7: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  8: [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  9: [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

/* ------------------------------------------------------------------ */
/* Minimal PNG encoder (truecolour RGB, no dependencies)               */
/* ------------------------------------------------------------------ */

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let k = 0; k < 8; k++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgb) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 3; // filter byte + RGB per row
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    raw.set(rgb.subarray(y * width * 3, (y + 1) * width * 3), y * stride + 1);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([signature, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

function createCanvas(width, height) {
  return new Uint8Array(width * height * 3);
}

function setPixel(rgb, width, height, x, y, [r, g, b]) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const i = (y * width + x) * 3;
  rgb[i] = r;
  rgb[i + 1] = g;
  rgb[i + 2] = b;
}

function fillRect(rgb, width, height, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(rgb, width, height, px, py, color);
    }
  }
}

function fillGradient(rgb, width, height, from, to) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = (x / width + y / height) / 2;
      setPixel(rgb, width, height, x, y, [
        Math.round(from[0] + (to[0] - from[0]) * t),
        Math.round(from[1] + (to[1] - from[1]) * t),
        Math.round(from[2] + (to[2] - from[2]) * t),
      ]);
    }
  }
}

function drawGlyph(rgb, width, height, glyph, x, y, scale, color) {
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if (glyph[row] & (1 << (4 - col))) {
        fillRect(rgb, width, height, x + col * scale, y + row * scale, scale, scale, color);
      }
    }
  }
}

function textWidth(text, scale) {
  return text.length * 6 * scale - scale; // 5px glyph + 1px spacing, trailing spacing removed
}

function drawTextCentered(rgb, width, height, text, centerX, y, scale, color) {
  let x = centerX - Math.floor(textWidth(text, scale) / 2);
  for (const ch of text) {
    const glyph = FONT[ch] ?? FONT[' '];
    drawGlyph(rgb, width, height, glyph, x, y, scale, color);
    x += 6 * scale;
  }
}

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const NAVY_DARK = [27, 51, 84]; // #1b3354
const NAVY_LIGHT = [47, 93, 143]; // #2f5d8f
const CREAM = [251, 249, 244]; // #fbf9f4
const GOLD = [169, 133, 59]; // #a9853b
const WORDMARK_COLOR = [176, 192, 214]; // soft blue-grey

/* ------------------------------------------------------------------ */
/* Open Graph image — 1200×630                                         */
/* ------------------------------------------------------------------ */

function makeOgImage() {
  const width = 1200;
  const height = 630;
  const rgb = createCanvas(width, height);
  fillGradient(rgb, width, height, NAVY_DARK, NAVY_LIGHT);

  const scale = 26;
  const glyphH = 7 * scale; // 182
  const barH = 8;
  const gap = 24;
  const wordH = 7 * 7; // 49 (wordmark scale 7)
  const blockH = glyphH + gap + barH + gap + wordH;
  const top = Math.floor((height - blockH) / 2);

  drawTextCentered(rgb, width, height, INITIALS, width / 2, top, scale, CREAM);
  const barY = top + glyphH + gap;
  fillRect(rgb, width, height, width / 2 - 60, barY, 120, barH, GOLD);
  drawTextCentered(rgb, width, height, WORDMARK, width / 2, barY + barH + gap, 7, WORDMARK_COLOR);

  return encodePng(width, height, rgb);
}

/* ------------------------------------------------------------------ */
/* Apple touch icon — 180×180                                          */
/* ------------------------------------------------------------------ */

function makeIcon() {
  const size = 180;
  const rgb = createCanvas(size, size);
  fillRect(rgb, size, size, 0, 0, size, size, NAVY_DARK);

  const scale = 15;
  const glyphH = 7 * scale; // 105
  const x = Math.floor((size - textWidth(INITIALS, scale)) / 2);
  const y = Math.floor((size - glyphH) / 2) - 8;
  drawGlyph(rgb, size, size, FONT[INITIALS[0]], x, y, scale, CREAM);
  drawGlyph(rgb, size, size, FONT[INITIALS[1]], x + 6 * scale, y, scale, CREAM);
  fillRect(rgb, size, size, Math.floor((size - 56) / 2), y + glyphH + 18, 56, 6, GOLD);

  return encodePng(size, size, rgb);
}

/* ------------------------------------------------------------------ */
/* Write files (skip when they already exist)                          */
/* ------------------------------------------------------------------ */

const targets = [
  { file: 'public/og-image.png', data: makeOgImage() },
  { file: 'public/favicon-180.png', data: makeIcon() },
];

let created = 0;
let skipped = 0;
for (const { file, data } of targets) {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  if (existsSync(target)) {
    skipped++;
    continue;
  }
  writeFileSync(target, data);
  created++;
}

console.log(`OG assets created: ${created}  (already present, skipped: ${skipped})`);
