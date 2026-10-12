"""
Ingest the professor's publication PDFs into the site.

For each PDF in resources/English_publications and resources/Thai_publications:
  - match it to its citation in src/content/archives/bibliography.md (metadata)
  - extract the abstract from the PDF text (English text PDFs), via OCR for
    scanned English PDFs (RapidOCR), or render page images for manual review
    (Thai / anything uncertain)
  - write src/content/publications/{en,th}/<slug>.md
  - copy the PDF into public/publications_{english,thai}/

Also renders cover images for resources/Thai_books (first page) for the
"Thai Books" section and copies the book PDFs to public/books/.

Usage:
  python scripts/ingest_publications.py            # everything
  python scripts/ingest_publications.py --review-only   # only render review images
"""
import sys
import re
import os
import json
import shutil
import argparse

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIB = os.path.join(ROOT, 'src', 'content', 'archives', 'bibliography.md')
EN_SRC = os.path.join(ROOT, 'resources', 'English_publications')
TH_SRC = os.path.join(ROOT, 'resources', 'Thai_publications')
BOOK_SRC = os.path.join(ROOT, 'resources', 'Thai_books')
EN_PUB = os.path.join(ROOT, 'public', 'publications_english')
TH_PUB = os.path.join(ROOT, 'public', 'publications_thai')
BOOK_PUB = os.path.join(ROOT, 'public', 'books')
REVIEW_DIR = os.path.join(ROOT, 'scripts', 'abstract-review')


# --------------------------------------------------------------------------
# Bibliography parsing
# --------------------------------------------------------------------------

def parse_bibliography():
    md = open(BIB, encoding='utf-8').read()
    sections = re.split(r'^## ', md, flags=re.M)
    lang_sections = {}
    for s in sections:
        if s.startswith('บทความและหนังสือภาษาไทย'):
            lang_sections['th'] = s
        elif s.startswith('บทความและหนังสือภาษาอังกฤษ'):
            lang_sections['en'] = s
    # journal/vol/pages pattern: "Journal Name 12(3): 45-67." — works for
    # English and Thai journal names, and for citations where the trailing
    # comma of the title sits inside the closing quote ("title,” Journal").
    JOURNAL_RE = re.compile(r'([\u0e00-\u0e7fA-Z][^,]{0,90}?)\s*,?\s*(\d+)\((\d+)\):\s*([\d\-–]+)')
    # a chapter citation: "…” in Book Title, Editor (ed.), pp. 1-2."
    CHAPTER_RE = re.compile(r'\s+in\s+(?=.*\(e?ds?\.\))')
    # entries whose journal lacks a "vol(issue): pages" pattern
    JOURNAL_OVERRIDES = {
        'The Impact of Conservation and Land Use Transitions of the Livelihoods of Indigenous Peoples: A Narrative Review of the Northern Thai Highlands': 'Forest Policy and Economics',
        'Constructing Symbolic Value in Marketing Silver Crafts of Iu Mien Entrepreneurs in Thailand': 'Economic Anthropology',
        'Psychological and Social Impacts of Top-down Conservation Initiatives on Indigenous Communities: Lessons from the Announcement of two Royal Decrees in Thailand': 'Human Ecology',
        'ประวัติศาสตร์ อัตลักษณ์และพื้นที่ทางสังคมของชาวม้งในประเทศจีน': 'สังคมศาสตร์',
    }
    # titles that are books, not chapters
    BOOK_TYPES = {
        'เทพารักษ์ล้านนา: จากหอผีสู่รูปปั้นศาลเจ้าและอนุสาวรีย์': 'Book',
    }
    entries = {}
    for lang, sec in lang_sections.items():
        for line in sec.split('\n'):
            line = line.strip()
            if not line.startswith('- '):
                continue
            text = line[2:].strip()
            # strip the backslash Markdown escape from year periods ("2020\.")
            text = re.sub(r'^(\d{4})\\\.', r'\1.', text)
            m = re.match(r'^(\d{4})([ก-ฮa-z]?)\.?\s+(.*)$', text)
            if not m:
                continue
            year = m.group(1)
            sub = m.group(2)
            rest = m.group(3)
            journal = volume = issue = pages = None
            # quoted title
            q = re.match(r'^“(.*?)”[,]?\s*(.*)$', rest, re.S)
            if q:
                title, after = q.group(1), q.group(2)
                title = title.rstrip(' ,')
            else:
                # unquoted: split title from the journal ("title, Journal 1(2): 3-4.")
                mj = JOURNAL_RE.search(rest)
                if mj:
                    title = rest[: mj.start()].strip().rstrip(' ,')
                    after = rest[mj.start():]
                else:
                    mi = CHAPTER_RE.search(rest)
                    if mi:
                        title = rest[: mi.start()].strip()
                        after = rest[mi.start():]
                    else:
                        # "Title. Journal, 54(1)." — no pages pattern (e.g. "Human Ecology, 54(1).")
                        mj3 = re.search(r'\.\s*([\u0e00-\u0e7fA-Z][^,]{2,}?)\s*,?\s*(\d+)\(([\d\-–]+)\)\.?\s*$', rest)
                        if mj3:
                            title = rest[: mj3.start()].strip()
                            after = rest[mj3.start():].lstrip('. ')
                            journal = mj3.group(1).strip()
                            volume, issue = mj3.group(2), mj3.group(3)
                        else:
                            m2 = re.match(r'^(.*?)[,]\s*(.*)$', rest)
                            title, after = (m2.group(1).strip(), m2.group(2)) if m2 else (rest, '')
            mj = JOURNAL_RE.search(after)
            if mj:
                journal, volume, issue, pages = mj.group(1).strip(), mj.group(2), mj.group(3), mj.group(4)
            else:
                mj2 = re.search(r'\b(\d+)\((\d+)\):\s*([\d\-–]+)', after)
                if mj2:
                    volume, issue, pages = mj2.group(1), mj2.group(2), mj2.group(3)
            if journal is None and title in JOURNAL_OVERRIDES:
                journal = JOURNAL_OVERRIDES[title]
            # strip a trailing "City: Publisher." tail from monograph titles
            title = re.sub(r'\.\s*[\u0e00-\u0e7fA-Z][^,]{0,30}?:\s*[^,]+\.?\s*$', '', title).strip()
            pub_type = 'Book Chapter'
            for k, v in BOOK_TYPES.items():
                if title.startswith(k):
                    pub_type = v
                    break
            if pub_type == 'Book Chapter' and journal:
                pub_type = 'Journal Article'
            entries.setdefault(lang, []).append({
                'year': year, 'sub': sub, 'title': title, 'rest': after, 'full': text,
                'journal': journal, 'volume': volume, 'issue': issue, 'pages': pages,
                'type': pub_type,
            })
    return entries


# --------------------------------------------------------------------------
# PDF helpers
# --------------------------------------------------------------------------

def pdf_first_text(path, pages=4):
    import pymupdf
    doc = pymupdf.open(path)
    text = ''
    for p in range(min(pages, doc.page_count)):
        text += doc[p].get_text() + '\n'
    return text, doc.page_count


def ocr_page(pymupdf_page, dpi=200):
    from rapidocr import RapidOCR
    import tempfile
    ocr = getattr(ocr_page, '_ocr', None)
    if ocr is None:
        ocr = RapidOCR()
        ocr_page._ocr = ocr
    pix = pymupdf_page.get_pixmap(dpi=dpi)
    tmp = os.path.join(tempfile.gettempdir(), '_ingest_ocr.png')
    pix.save(tmp)
    res = ocr(tmp)
    if res and res.txts:
        return '\n'.join(res.txts)
    return ''


def extract_abstract(text):
    """Best-effort abstract extraction from English article text."""
    if not text or len(text) < 50:
        return None
    # explicit "Abstract" heading on its own line, or inline "Abstract ■/:/– ..."
    candidates = []
    pat = re.compile(r'^[ \t]*abstract[ \t]*[\u25a0\u25aa\u2022\u2027:-\u2013\u2014]?[ \t]*$'
                     r'|^[ \t]*abstract[ \t]*[\u25a0\u25aa\u2022\u2027:-\u2013\u2014]',
                     re.IGNORECASE | re.MULTILINE)
    for m in pat.finditer(text):
        seg = text[m.end():]
        end = re.search(r'(?im)^\s*(keywords|introduction|1\.\s|resume|บทคัดย่อ|acknowledg)', seg)
        abs_ = seg[: end.start()] if end else seg[:2000]
        abs_ = re.sub(r'\s+', ' ', abs_).strip()
        if len(abs_) > 120:
            candidates.append(abs_)
    if candidates:
        abs_ = candidates[0]
        # drop a stray page-number artifact at the start ("24 Despite ...")
        abs_ = re.sub(r'^\s*\d{1,3}\s+', '', abs_)
        return abs_.strip()
    # no heading: paragraph(s) before "Keywords" (T&F style)
    k = re.search(r'(?im)^\s*keywords\s*[:.]', text)
    if k:
        pre = text[: k.start()]
        paras = [p.strip() for p in pre.split('\n') if p.strip()]
        if len(paras) >= 3:
            cand = ' '.join(paras[-2:])
            cand = re.sub(r'\s+', ' ', cand).strip()
            if len(cand) > 150:
                return cand
    return None


def slugify(name):
    s = re.sub(r'[^\w\u0e00-\u0e7f]+', '-', name).strip('-')
    return s[:80]


# --------------------------------------------------------------------------
# Manual review sheet
# --------------------------------------------------------------------------

def render_review_images(pdf_path, out_prefix, pages=2):
    import pymupdf
    doc = pymupdf.open(pdf_path)
    written = []
    for p in range(min(pages, doc.page_count)):
        pix = doc[p].get_pixmap(dpi=150)
        out = f'{out_prefix}-p{p+1}.png'
        pix.save(out)
        written.append(out)
    return written


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--review-only', action='store_true')
    ap.add_argument('--english-only', action='store_true')
    ap.add_argument('--thai-only', action='store_true')
    ap.add_argument('--books-only', action='store_true')
    args = ap.parse_args()

    bib = parse_bibliography()

    if args.review_only:
        os.makedirs(os.path.join(REVIEW_DIR, 'thai'), exist_ok=True)
        rows = []
        for f in sorted(os.listdir(TH_SRC)):
            if not f.lower().endswith('.pdf'):
                continue
            base = slugify(os.path.splitext(f)[0])
            imgs = render_review_images(os.path.join(TH_SRC, f),
                                        os.path.join(REVIEW_DIR, 'thai', base))
            rows.append((f, imgs))
        html = ['<!doctype html><html><head><meta charset="utf-8"><title>Abstract review — Thai</title>',
                '<style>body{font-family:sans-serif;margin:2rem}figure{margin:1rem 0}img{max-width:100%;border:1px solid #ccc}</style></head><body>',
                '<h1>Thai publication abstracts — manual review</h1>',
                '<p>Open each image and copy the บทคัดย่อ (abstract) into the matching '
                '<code>src/content/publications/th/*.md</code> file body.</p>']
        for f, imgs in rows:
            html.append(f'<h2>{f}</h2>')
            for im in imgs:
                html.append(f'<figure><img src="thai/{os.path.basename(im)}" alt="{f}"><figcaption>{os.path.basename(im)}</figcaption></figure>')
        html.append('</body></html>')
        with open(os.path.join(REVIEW_DIR, 'index.html'), 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(html))
        print(f'[review] wrote {len(rows)} Thai review entries to {REVIEW_DIR}')
        return

    if not (args.english_only or args.thai_only or args.books_only):
        args.english_only = args.thai_only = args.books_only = True

    if args.english_only:
        ingest_english(bib['en'])
    if args.thai_only:
        ingest_thai(bib['th'])
    if args.books_only:
        ingest_books()


def longest_common_substring(a, b):
    """Length of the longest common substring (Thai text has no spaces)."""
    n, m = len(a), len(b)
    if n == 0 or m == 0:
        return 0
    prev = [0] * (m + 1)
    best = 0
    for i in range(1, n + 1):
        cur = [0] * (m + 1)
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
                if cur[j] > best:
                    best = cur[j]
        prev = cur
    return best


def match_entry(entries, pdf_name):
    """Best-effort match a PDF filename to a bibliography entry.

    Filenames are "<author> <year> <short title>". The year plus any
    title overlap is the strongest signal; bare LCS is unreliable because
    "ชาติพันธุ์" appears in nearly every Thai title.
    """
    name = pdf_name.lower().replace(' ', '')
    best = None
    best_score = 0
    for e in entries:
        title = e['title'].lower()
        score = 0
        # English: word overlap
        score += sum(1 for w in re.findall(r'[a-z0-9]+', title) if len(w) > 3 and w in name)
        # Thai (no spaces): longest common substring
        lcs = longest_common_substring(title.replace(' ', ''), name)
        if lcs >= 6:
            score += lcs // 3
        if e['year'] in name:
            score += 2  # year match bonus
            if lcs >= 6 or any(len(w) > 3 for w in re.findall(r'[a-z0-9]+', title)):
                score += 10  # year + title overlap = strong signal
        if score > best_score:
            best_score = score
            best = e
    if best_score >= 3:
        return best, best_score
    return None, 0


def ingest_english(entries):
    os.makedirs(EN_PUB, exist_ok=True)
    out_dir = os.path.join(ROOT, 'src', 'content', 'publications', 'en')
    os.makedirs(out_dir, exist_ok=True)
    # these three already have curated md files (with abstracts) — skip here,
    # they are updated by update_curated()
    curated = {
        '_10prasit-2017-Who should be considered Indigenous.pdf',
        '_4prasit-2009-Modern Education and Impact on Ethnic Minorities.pdf',
        '_20prasit-2025-Voices of the Voiceless Cold War and the Hmong in Thailand.pdf',
    }
    seen = set()
    for f in sorted(os.listdir(EN_SRC)):
        if not f.lower().endswith('.pdf'):
            continue
        if f in curated:
            print(f'  EN (curated, skip) {f[:50]}')
            # still copy the PDF
            dst = os.path.join(EN_PUB, f)
            if not os.path.exists(dst):
                shutil.copy2(os.path.join(EN_SRC, f), dst)
                print('    copied PDF -> public/publications_english/')
            continue
        src = os.path.join(EN_SRC, f)
        entry, score = match_entry(entries, f)
        if entry is None:
            print(f'  !! no bibliography match for: {f}')
            continue
        if id(entry) in seen:
            print(f'  !! duplicate entry, skipping: {f[:60]} (already has an md)')
            continue
        seen.add(id(entry))
        print(f'  EN {f[:60]} -> year={entry["year"]} score={score}')
        text, _ = pdf_first_text(src)
        abstract = extract_abstract(text)
        if abstract is None and len(text) < 300:
            # scanned -> OCR page 1-2
            import pymupdf
            doc = pymupdf.open(src)
            ocr_text = ''
            for p in range(min(2, doc.page_count)):
                ocr_text += ocr_page(doc[p]) + '\n'
            abstract = extract_abstract(ocr_text)
            if abstract:
                abstract = abstract + '\n\n<!-- Abstract auto-OCR' + "'" + 'd; please verify against the PDF. -->'
        # metadata
        title = entry['title']
        year = entry['year']
        citation = entry['full']
        journal = entry.get('journal')
        volume = entry.get('volume')
        issue = entry.get('issue')
        pages = entry.get('pages')
        slug = os.path.splitext(f)[0]
        md = f"""---
title: "{title}"
authors:
  - "Prasit Leepreecha"
year: {year}
"""
        if journal:
            md += f'journal: "{journal}"\n'
        md += f'type: "{entry.get("type", "Journal Article" if journal else "Book Chapter")}"\n'
        if volume:
            md += f'volume: "{volume}"\n'
        if issue:
            md += f'issue: "{issue}"\n'
        if pages:
            md += f'pages: "{pages}"\n'
        md += f'language: "en"\npdf: "{f}"\ncitation: "{citation}"\n---\n'
        if abstract:
            md += '\n' + abstract.strip() + '\n'
        out = os.path.join(out_dir, slug + '.md')
        open(out, 'w', encoding='utf-8').write(md)
        # copy the PDF (keep original filename so `pdf:` matches)
        dst = os.path.join(EN_PUB, f)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
            print(f'    copied PDF -> public/publications_english/')


def ingest_thai(entries):
    os.makedirs(TH_PUB, exist_ok=True)
    out_dir = os.path.join(ROOT, 'src', 'content', 'publications', 'th')
    os.makedirs(out_dir, exist_ok=True)
    review_dir = os.path.join(REVIEW_DIR, 'thai')
    os.makedirs(review_dir, exist_ok=True)
    # these two already have curated md files with abstracts — skip md, still copy the PDF
    curated = {
        '_1prasit-2541-Hmong and drug.pdf',
        '_2prasit-2545-family and border.pdf',
    }
    for f in sorted(os.listdir(TH_SRC)):
        if not f.lower().endswith('.pdf'):
            continue
        src = os.path.join(TH_SRC, f)
        if f in curated:
            print(f'  TH (curated, skip) {f[:50]}')
            dst = os.path.join(TH_PUB, f)
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                print('    copied PDF -> public/publications_thai/')
            continue
        entry, score = match_entry(entries, f)
        if entry is None:
            print(f'  !! no bibliography match for: {f}')
            continue
        print(f'  TH {f[:60]} -> year={entry["year"]} score={score}')
        # render page 1 (+2) for manual review
        base = slugify(os.path.splitext(f)[0])
        imgs = render_review_images(src, os.path.join(review_dir, base))
        title = entry['title']
        year = str(int(entry['year']) - 543)  # Buddhist era -> Gregorian in frontmatter
        citation = entry['full']
        journal = entry.get('journal')
        volume = entry.get('volume')
        issue = entry.get('issue')
        pages = entry.get('pages')
        slug = os.path.splitext(f)[0]
        md = f"""---
title: "{title}"
authors:
  - "ประสิทธิ์ ลีปรีชา"
year: {year}
"""
        if journal:
            md += f'journal: "{journal}"\n'
        md += f'type: "{entry.get("type", "Journal Article" if journal else "Book Chapter")}"\n'
        if volume:
            md += f'volume: "{volume}"\n'
        if issue:
            md += f'issue: "{issue}"\n'
        if pages:
            md += f'pages: "{pages}"\n'
        md += f'language: "th"\npdf: "{f}"\ncitation: "{citation}"\n---\n'
        # abstract body is intentionally empty — fill it after reviewing
        # scripts/abstract-review/index.html (page-1 images of each article)
        out = os.path.join(out_dir, slug + '.md')
        open(out, 'w', encoding='utf-8').write(md)
        dst = os.path.join(TH_PUB, f)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
            print(f'    copied PDF -> public/publications_thai/')
    print(f'[thai] review images in {review_dir} — open scripts/abstract-review/index.html')


def ingest_books():
    import pymupdf
    os.makedirs(BOOK_PUB, exist_ok=True)
    covers = os.path.join(BOOK_PUB, 'covers')
    os.makedirs(covers, exist_ok=True)
    meta = []
    for f in sorted(os.listdir(BOOK_SRC)):
        if not f.lower().endswith('.pdf'):
            continue
        src = os.path.join(BOOK_SRC, f)
        name = os.path.splitext(f)[0]
        base = name  # md + cover share the PDF's base name (traceable)
        # cover = first page rendered to jpg
        doc = pymupdf.open(src)
        pix = doc[0].get_pixmap(dpi=120)
        cover = os.path.join(covers, base + '.jpg')
        pix.save(cover)
        # copy pdf
        dst = os.path.join(BOOK_PUB, f)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
        # parse metadata from filename: name, year, (บ.ก.) / และคณะ
        year_m = re.search(r'\b(25\d\d)\b', name)
        year = year_m.group(1) if year_m else None
        authors = 'ประสิทธิ์ ลีปรีชา'
        if 'บ.ก.' in name:
            authors = 'ประสิทธิ์ ลีปรีชา (บรรณาธิการ)'
        elif 'และ' in name:
            authors = 'ประสิทธิ์ ลีปรีชา และคณะ'
        # title = after year, stripping editor/and-council markers
        title = re.sub(r'^.*?\d{4}\s*', '', name)
        title = re.sub(r'^(บ\.ก\.\s*)?', '', title)
        meta.append({
            'slug': base, 'title': title, 'authors': authors, 'year': year,
            'pdf': f, 'cover': base + '.jpg',
        })
    # write content md files
    cdir = os.path.join(ROOT, 'src', 'content', 'thai_books')
    os.makedirs(cdir, exist_ok=True)
    for b in meta:
        md = f"""---
title: "{b['title']}"
authors:
  - "{b['authors']}"
year: {b['year']}
pdf: "{b['pdf']}"
cover: "{b['cover']}"
---
"""
        open(os.path.join(cdir, b['slug'] + '.md'), 'w', encoding='utf-8').write(md)
    print(f'[books] {len(meta)} books ingested (covers in public/books/covers)')
    with open(os.path.join(ROOT, 'scripts', 'books-meta.json'), 'w', encoding='utf-8') as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()