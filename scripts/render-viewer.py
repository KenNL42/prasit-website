"""
Render view-only entries (downloadable: false) into an online reader.

For every publication/book whose frontmatter says `downloadable: false`:
  1. render each PDF page to a JPG under public/pdf-pages/<entry-id>/  (the
     /view/<entry-id> reader shows these images), and
  2. remove the PDF from public/ so it is never served (the master copy in
     resources/ stays untouched).

Run from the repo root (auto-runs via `prebuild`):
    python scripts/render-viewer.py
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
RES = os.path.join(ROOT, 'resources')
CONTENT = os.path.join(ROOT, 'src', 'content')

# (content dir, resource dir, public pdf dir)
COLLECTIONS = [
    ('publications', 'en', os.path.join(CONTENT, 'publications', 'en'), os.path.join(RES, 'English_publications'), os.path.join(PUB, 'publications_english')),
    ('publications', 'th', os.path.join(CONTENT, 'publications', 'th'), os.path.join(RES, 'Thai_publications'), os.path.join(PUB, 'publications_thai')),
    ('thai_books', '', os.path.join(CONTENT, 'thai_books'), os.path.join(RES, 'Thai_books'), os.path.join(PUB, 'books')),
]

DPI = 110


def parse_frontmatter(text):
    m = re.match(r'^---\n(.*?)\n---', text, re.S)
    fm = {}
    if not m:
        return fm
    for line in m.group(1).split('\n'):
        line = line.strip()
        mm = re.match(r'^([a-zA-Z_]+):\s*(.*)$', line)
        if mm:
            fm[mm.group(1)] = mm.group(2).strip().strip('"')
    return fm


def is_false(val):
    return val is not None and val.strip().lower() in ('n', 'no', 'false', '0', 'ไม่', 'ไม่ได้', 'x')


def _line_directions(img_gray):
    """Return (horizontal, vertical) counts of detected text-line edges."""
    import cv2
    import numpy as np
    edges = cv2.Canny(img_gray, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=60, minLineLength=30, maxLineGap=12)
    if lines is None:
        return 0, 0
    horiz = vert = 0
    for x1, y1, x2, y2 in lines.reshape(-1, 4):
        if abs(y2 - y1) > abs(x2 - x1):
            vert += 1
        else:
            horiz += 1
    return horiz, vert


def detect_page_rotation(page, pix):
    """Detect if a landscape page's content is rotated 90° (a portrait page
    scanned sideways) and return the rotation angle, or None if upright.

    PyMuPDF's render already applies the PDF /Rotate flag, so this only
    handles scans stored without it. Two signals, cheapest first:
      1. embedded text line directions (fast), and
      2. OpenCV edge-line detection on the rendered page (text lines running
         vertically mean the content is rotated).
    Genuinely landscape pages (e.g. photo books with horizontal captions)
    are left untouched. OCR is NOT used here — the recognition model
    auto-normalizes rotation, so its boxes can't tell orientation.
    """
    r = page.rect
    if r.width <= r.height:
        return None  # portrait page — nothing to fix

    # 1) text-based detection
    d = page.get_text('dict')
    if d and any(b.get('lines') for b in d.get('blocks', [])):
        vert = horiz = 0
        for b in d['blocks']:
            for l in b.get('lines', []):
                dx, dy = l.get('dir', (1, 0))
                if abs(dy) > abs(dx):
                    vert += 1
                else:
                    horiz += 1
        return 90 if vert > horiz else None

    # 2) vision-based detection for scans
    try:
        import cv2
        import numpy as np
        small = page.get_pixmap(dpi=70)
        img = np.frombuffer(small.samples, dtype=np.uint8).reshape(small.height, small.width, small.n)
        if small.n >= 3:
            img = img[:, :, :3]
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        horiz, vert = _line_directions(gray)
        if vert > horiz and vert >= 3:
            return 90
    except ImportError:
        pass
    return None


def rotate_pixmap(pix, angle):
    """Rotate a rendered pixmap 90° clockwise (90) or counter-clockwise (270)
    via OpenCV and return the BGR image (for cv2.imwrite)."""
    import cv2
    import numpy as np
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    if pix.n == 4:
        img = img[:, :, :3]
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    code = cv2.ROTATE_90_CLOCKWISE if angle == 90 else cv2.ROTATE_90_COUNTERCLOCKWISE
    return cv2.rotate(img, code)


def main():
    import shutil
    import pymupdf
    force = '--force' in sys.argv
    rendered = 0
    removed = 0
    restored = 0
    for kind, lang, content_dir, res_dir, pub_dir in COLLECTIONS:
        for f in sorted(os.listdir(content_dir)):
            if not f.endswith('.md'):
                continue
            p = os.path.join(content_dir, f)
            fm = parse_frontmatter(open(p, encoding='utf-8').read())
            entry_id = f[:-3].replace(' ', '-').lower()  # md base name, dash + lowercase (matches Astro's [slug])
            pdf_name = fm.get('pdf')
            if not pdf_name:
                continue
            master = os.path.join(res_dir, pdf_name)
            pub_copy = os.path.join(pub_dir, pdf_name)
            out_dir = os.path.join(PUB, 'pdf-pages', entry_id)
            if not is_false(fm.get('downloadable')):
                # downloadable (default): make sure the PDF is served again and
                # drop any stale reader pages
                if os.path.exists(master) and not os.path.exists(pub_copy):
                    shutil.copy2(master, pub_copy)
                    print(f'  {kind:12s} restored public/{os.path.basename(pub_dir)}/{pdf_name[:50]}')
                    restored += 1
                if os.path.isdir(out_dir):
                    shutil.rmtree(out_dir)
                    print(f'  {kind:12s} removed stale reader pages for {entry_id[:45]}')
                continue
            # 1) render page images from the resources master
            if os.path.exists(master):
                if not force and os.path.isdir(out_dir) and os.listdir(out_dir):
                    print(f'  {kind:12s} {entry_id[:45]:47s} pages already rendered')
                else:
                    if force and os.path.isdir(out_dir):
                        shutil.rmtree(out_dir)
                    os.makedirs(out_dir, exist_ok=True)
                    doc = pymupdf.open(master)
                    rotated = 0
                    for i, page in enumerate(doc, 1):
                        pix = page.get_pixmap(dpi=DPI)
                        out_path = os.path.join(out_dir, f'page-{i:03d}.jpg')
                        rot = detect_page_rotation(page, pix)
                        if rot:
                            # rotate clockwise; if the result is still vertical,
                            # the page was rotated the other way
                            img = rotate_pixmap(pix, 90)
                            import cv2
                            import numpy as np
                            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                            horiz, vert = _line_directions(gray)
                            if vert > horiz:
                                img = rotate_pixmap(pix, 270)
                            cv2.imwrite(out_path, img, [cv2.IMWRITE_JPEG_QUALITY, 80])
                            rotated += 1
                        else:
                            pix.save(out_path, jpg_quality=80)
                    print(f'  {kind:12s} {entry_id[:45]:47s} -> {len(doc)} pages rendered'
                          f'{" (" + str(rotated) + " rotated)" if rotated else ""}')
                    rendered += len(doc)
                    doc.close()
            else:
                print(f'  !! master pdf not found in resources/: {pdf_name}')
            # 2) ensure the PDF is NOT served from public/
            if os.path.exists(pub_copy):
                os.remove(pub_copy)
                print(f'  {kind:12s} removed public/{os.path.basename(pub_dir)}/{pdf_name[:50]}')
                removed += 1
    print(f'[render-viewer] done: {rendered} pages rendered, {removed} pdfs removed from public/, {restored} pdfs restored.')


if __name__ == '__main__':
    main()