"""
Rename every publication/book PDF (and its Markdown entry) to a short,
traceable name:  <year>-<short title>.pdf   (e.g. 2541-Hmong and drug.pdf)

Public PDFs, the master copies in resources/, the Markdown files in
src/content/publications/{en,th}/ and src/content/thai_books/, the pdf:
fields, and the book covers are all renamed together, so md <-> pdf
stays obvious. Run from the repo root:

    python scripts/rename_publications.py
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
RES = os.path.join(ROOT, 'resources')
CONTENT = os.path.join(ROOT, 'src', 'content')

GROUPS = [
    ('en', os.path.join(PUB, 'publications_english'), os.path.join(RES, 'English_publications'),
     os.path.join(CONTENT, 'publications', 'en')),
    ('th', os.path.join(PUB, 'publications_thai'), os.path.join(RES, 'Thai_publications'),
     os.path.join(CONTENT, 'publications', 'th')),
    ('books', os.path.join(PUB, 'books'), os.path.join(RES, 'Thai_books'),
     os.path.join(CONTENT, 'thai_books')),
]


def main():
    for group, pub_dir, res_dir, content_dir in GROUPS:
        pdfs = sorted(f for f in os.listdir(pub_dir) if f.lower().endswith('.pdf'))
        pdf_map = {}  # old pdf name -> new pdf name
        for old in pdfs:
            base = os.path.splitext(old)[0]
            new_base = re.sub(r'^_\d+prasit-', '', base)
            new_pdf = new_base + '.pdf'
            print(f'  {group:5s} {old[:45]:47s} -> {new_pdf}')
            for folder in (pub_dir, res_dir):
                src = os.path.join(folder, old)
                dst = os.path.join(folder, new_pdf)
                if os.path.exists(src) and not os.path.exists(dst):
                    os.rename(src, dst)
            pdf_map[old] = new_pdf

        # map every md entry via its pdf:/cover: fields
        for md in sorted(os.listdir(content_dir)):
            if not md.endswith('.md'):
                continue
            p = os.path.join(content_dir, md)
            s = open(p, encoding='utf-8').read()
            m = re.search(r'^pdf: "(.*)"$', s, re.M)
            new_pdf = pdf_map.get(m.group(1)) if m else None
            if not new_pdf:
                continue
            new_base = os.path.splitext(new_pdf)[0]
            s = re.sub(r'^pdf: ".*"$', f'pdf: "{new_pdf}"', s, count=1, flags=re.M)
            if group == 'books':
                c = re.search(r'^cover: "(.*)"$', s, re.M)
                if c:
                    cov_old = os.path.join(pub_dir, 'covers', c.group(1))
                    cov_new = os.path.join(pub_dir, 'covers', new_base + os.path.splitext(c.group(1))[1])
                    if os.path.exists(cov_old) and not os.path.exists(cov_new):
                        os.rename(cov_old, cov_new)
                    s = re.sub(r'^cover: ".*"$', f'cover: "{new_base + os.path.splitext(c.group(1))[1]}"', s, count=1, flags=re.M)
            open(p, 'w', encoding='utf-8').write(s)
            os.rename(p, os.path.join(content_dir, new_base + '.md'))
            print(f'  {group:5s} md  {md[:40]:42s} -> {new_base}.md')


if __name__ == '__main__':
    main()