"""
Rename every publication/book PDF (and its Markdown entry) to a short,
traceable name:  _<n>prasit-<year>-<short title>.pdf

Public PDFs, the master copies in resources/, the Markdown files in
src/content/publications/{en,th}/ and src/content/thai_books/, the pdf:
fields, and the book covers are all renamed together, so md <-> pdf
stays obvious. Run from the repo root:

    python scripts/rename_publications.py

Also deletes duplicate PDFs (the Buadaeng "02" copy, the long-name
duplicates of the curated Thai files, and the "ofn" Haenssgen 2023 file).
"""
import os
import re
import sys
import shutil

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

# files that are duplicates of a kept file (deleted everywhere)
DUPES = {
    'en': [
        'Buadaeng, Kwanchewan and Prasit Leepreecha 2009 Modern Education and Impact on Ethnic Minorities 02.pdf',
        'Haenssgen, Marco, Prasit Leepreecha et al_2023_The Impact of Conservation and Land Use Transitions ofn the Livelihoods of Indigenous Peoples.pdf',
    ],
    'th': [
        'ประสิทธิ์ ลีปรีชา 2541 กลุ่มชาติพันธุ์ม้งกับปัญหายาเสพติด_สังคมศาสตร์.pdf',
        'ประสิทธิ์ ลีปรีชา 2547 เครือญาติข้ามพรมแดนรัฐชาติ_กรณีกลุ่มชาติพันธุ์ม้ง.pdf',
    ],
    'books': [],
}

# curated short names that are already in the target format — kept as-is
KEEP = {
    'th': {'_1prasit-2541-Hmong and drug.pdf', '_2prasit-2545-family and border.pdf'},
}


def split_name(base):
    """Return (year, title) from "<authors> <year> <title>"."""
    m = re.search(r'\b(\d{4})\b', base)
    if not m:
        return None, base
    year = m.group(1)
    title = base[m.end():].strip().lstrip('-_ ')
    title = re.sub(r'_[a-z0-9]+$', '', title)   # _online / _02 / _scan suffixes
    title = re.sub(r'\s*\(\d+\)$', '', title)   # " (2)"
    title = re.sub(r'\s+\d{2}$', '', title)     # trailing " 02"
    return year, title.strip()


def clean_title(title, limit=60):
    t = re.sub(r'[_.,:;()\[\]"\'!?]', ' ', title)
    t = re.sub(r'\s+', ' ', t).strip()
    if len(t) > limit:
        cut = t[:limit]
        sp = cut.rfind(' ')
        if sp > 25:
            cut = cut[:sp]
        t = cut.rstrip()
    return t


def main():
    for group, pub_dir, res_dir, content_dir in GROUPS:
        pdfs = sorted(f for f in os.listdir(pub_dir) if f.lower().endswith('.pdf'))
        # drop duplicates
        for d in DUPES[group]:
            for folder in (pub_dir, res_dir):
                p = os.path.join(folder, d)
                if os.path.exists(p):
                    os.remove(p)
                    print(f'  [dup] removed {os.path.basename(folder)}/{d[:50]}')
        pdfs = [f for f in pdfs if f not in DUPES[group]]

        # order: keep existing curated names first (they are already short),
        # then sort the rest by (year, title)
        entries = []  # (old_name, year, title, keep)
        for f in pdfs:
            base = os.path.splitext(f)[0]
            if f in KEEP.get(group, set()):
                entries.append((f, None, None, True))
            else:
                year, title = split_name(base)
                entries.append((f, year, clean_title(title), False))
        entries.sort(key=lambda e: (0 if e[3] else 1, e[1] or '', e[2] or ''))

        pdf_map = {}  # old pdf name -> new pdf name
        n = sum(1 for e in entries if e[3])  # kept curated names occupy the first numbers
        for old, year, title, keep in entries:
            if keep:
                new_base = os.path.splitext(old)[0]
            else:
                n += 1
                new_base = f'_{n}prasit-{year}-{title}'
            new_pdf = new_base + '.pdf'
            print(f'  {group:5s} {old[:45]:47s} -> {new_pdf}')
            # rename public copy + resources copy
            for folder in (pub_dir, res_dir):
                src = os.path.join(folder, old)
                dst = os.path.join(folder, new_pdf)
                if os.path.exists(src) and not os.path.exists(dst):
                    os.rename(src, dst)
            pdf_map[old] = new_pdf

        # now map every md entry via its pdf:/cover: fields
        for md in sorted(os.listdir(content_dir)):
            if not md.endswith('.md'):
                continue
            p = os.path.join(content_dir, md)
            s = open(p, encoding='utf-8').read()
            m = re.search(r'^pdf: "(.*)"$', s, re.M)
            old_pdf = m.group(1) if m else None
            new_pdf = pdf_map.get(old_pdf)
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