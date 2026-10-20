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


def main():
    import pymupdf
    rendered = 0
    removed = 0
    for kind, lang, content_dir, res_dir, pub_dir in COLLECTIONS:
        for f in sorted(os.listdir(content_dir)):
            if not f.endswith('.md'):
                continue
            p = os.path.join(content_dir, f)
            fm = parse_frontmatter(open(p, encoding='utf-8').read())
            if not is_false(fm.get('downloadable')):
                continue  # downloadable (default) — leave the PDF as is
            entry_id = f[:-3].replace(' ', '-')  # md base name, space -> dash (matches the /view/<slug> route)
            pdf_name = fm.get('pdf')
            if not pdf_name:
                print(f'  !! {entry_id}: downloadable=false but no pdf field')
                continue
            # 1) render page images from the resources master
            master = os.path.join(res_dir, pdf_name)
            out_dir = os.path.join(PUB, 'pdf-pages', entry_id)
            if os.path.exists(master):
                if os.path.isdir(out_dir) and os.listdir(out_dir):
                    print(f'  {kind:12s} {entry_id[:45]:47s} pages already rendered')
                else:
                    os.makedirs(out_dir, exist_ok=True)
                    doc = pymupdf.open(master)
                    for i, page in enumerate(doc, 1):
                        pix = page.get_pixmap(dpi=DPI)
                        pix.save(os.path.join(out_dir, f'page-{i:03d}.jpg'), jpg_quality=80)
                    print(f'  {kind:12s} {entry_id[:45]:47s} -> {len(doc)} pages rendered')
                    rendered += len(doc)
                    doc.close()
            else:
                print(f'  !! master pdf not found in resources/: {pdf_name}')
            # 2) ensure the PDF is NOT served from public/
            pub_copy = os.path.join(pub_dir, pdf_name)
            if os.path.exists(pub_copy):
                os.remove(pub_copy)
                print(f'  {kind:12s} removed public/{os.path.basename(pub_dir)}/{pdf_name[:50]}')
                removed += 1
    print(f'[render-viewer] done: {rendered} pages rendered, {removed} pdfs removed from public/')


if __name__ == '__main__':
    main()