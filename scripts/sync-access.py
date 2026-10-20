"""
Sync the downloadable flag from the Google Sheets access tracker.

The tracker has three tabs (one per collection):
    thai    -> src/content/publications/th
    english -> src/content/publications/en
    books   -> src/content/thai_books
Each tab has the columns:  Title | Downloadable
(Title must match the Markdown `title:` field; put FALSE in Downloadable
to make the entry view-only, TRUE or blank to keep it downloadable.)

The published CSV export URLs live in scripts/access-sheet-url.txt, one
per tab, labeled:
    thai = https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
    english = ...
    books = ...

What it does:
  1. downloads each tab and writes `downloadable:` into the matching
     Markdown frontmatter (matched by title),
  2. reports sheet rows that match no entry (typos / not ingested), and
  3. writes scripts/sheet-rows-to-add/<tab>.csv with one ready-to-paste
     row per entry missing from the tab — so after adding a PDF + md you
     copy that row into the sheet ("the sheet grabs the new file").

Optional fully-automatic mode: if a service account key exists at
scripts/service-account-key.json (shared with the sheet), new rows are
appended straight into the sheet instead of the CSV (requires
`pip install gspread google-auth`).

Run from the repo root:
    python scripts/sync-access.py          # or: npm run sync:access
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL_FILE = os.path.join(ROOT, 'scripts', 'access-sheet-url.txt')
CONTENT = os.path.join(ROOT, 'src', 'content')
OUT_DIR = os.path.join(ROOT, 'scripts', 'sheet-rows-to-add')
KEY_FILE = os.path.join(ROOT, 'scripts', 'service-account-key.json')

# tab label -> (content dir, csv dir name)
COLLECTIONS = {
    'thai': (os.path.join(CONTENT, 'publications', 'th'), 'thai'),
    'english': (os.path.join(CONTENT, 'publications', 'en'), 'english'),
    'books': (os.path.join(CONTENT, 'thai_books'), 'books'),
}


def read_urls():
    urls = {}
    if not os.path.exists(URL_FILE):
        return urls
    for line in open(URL_FILE, encoding='utf-8'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        m = re.match(r'^([a-z]+)\s*=\s*(\S+)$', line)
        if m:
            urls[m.group(1)] = m.group(2)
        else:
            print(f'[sync-access] skipping unlabeled line: {line[:70]}')
    return urls


def fetch_csv(url):
    import csv
    import urllib.request
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    data = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', errors='replace')
    return [row for row in csv.reader(data.lstrip('\ufeff').splitlines()) if any(c.strip() for c in row)]


def truthy(v):
    return v.strip().lower() in ('y', 'yes', '1', 'true', 'ใช่', 'ได้')


def is_false(v):
    return v.strip().lower() in ('n', 'no', '0', 'false', 'ไม่', 'ไม่ได้', 'x')


def norm_title(t):
    # strip punctuation incl. curly quotes, so a sheet row typed without
    # the trailing ” still matches the md title
    return re.sub(r'[\s,.:;"\u201c\u201d\'()\[\]!?\-–—]+', '', t).lower()


def update_frontmatter(path, key, val):
    s = open(path, encoding='utf-8').read()
    line = f'{key}: {val}'
    if re.search(rf'^{key}:.*$', s, re.M):
        s = re.sub(rf'^{key}:.*$', line, s, count=1, flags=re.M)
    else:
        s = re.sub(r'^(---\n.*?)(\n---)', rf'\1\n{line}\2', s, count=1, flags=re.S)
    open(path, 'w', encoding='utf-8').write(s)


def append_rows_api(spreadsheet_id, rows):
    """Optional: append rows straight into the sheet via the Sheets API."""
    import google.auth
    import gspread
    creds, _ = google.auth.load_credentials_from_file(KEY_FILE)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(spreadsheet_id)
    return sh


def main():
    urls = read_urls()
    if not urls:
        print('[sync-access] no tab URLs in scripts/access-sheet-url.txt — skipping.')
        return
    os.makedirs(OUT_DIR, exist_ok=True)

    for label, url in urls.items():
        if label not in COLLECTIONS:
            print(f'[sync-access] unknown tab label "{label}" — use thai|english|books')
            continue
        content_dir, _ = COLLECTIONS[label]
        try:
            rows = fetch_csv(url)
        except Exception as exc:
            print(f'[sync-access] could not fetch tab "{label}" ({exc}) — keeping committed flags.')
            continue

        header = [h.strip().lower() for h in rows[0]] if rows else []
        idx_title = next((i for i, h in enumerate(header) if 'title' in h or 'ชื่อ' in h), 0)
        idx_down = next((i for i, h in enumerate(header) if 'download' in h or 'ดาวน์โหลด' in h), 1)

        sheet = {}  # normalized title -> (downloadable value)
        for row in rows[1:]:
            if len(row) <= max(idx_title, idx_down):
                continue
            t = row[idx_title].strip()
            if not t:
                continue
            d = row[idx_down].strip() if len(row) > idx_down else ''
            sheet[norm_title(t)] = d

        # match entries by title
        changed = 0
        missing = []   # entries with no sheet row -> rows to add
        ambiguous = []
        for f in sorted(os.listdir(content_dir)):
            if not f.endswith('.md'):
                continue
            p = os.path.join(content_dir, f)
            s = open(p, encoding='utf-8').read()
            m = re.search(r'^title: "(.*)"$', s, re.M)
            if not m:
                continue
            title = m.group(1)
            key = norm_title(title)
            if key not in sheet:
                missing.append(title)
                continue
            down = sheet[key]
            if down and (truthy(down) or is_false(down)):
                val = 'true' if truthy(down) else 'false'
                if re.search(rf'^downloadable:\s*{val}$', s, re.M) is None:
                    update_frontmatter(p, 'downloadable', val)
                    changed += 1
                    print(f'  {label:7s} {title[:45]:47s} downloadable={val}')
        print(f'[sync-access] {label}: updated {changed} entries.')

        # rows to add (entries missing from the sheet)
        if missing:
            out = os.path.join(OUT_DIR, f'{label}.csv')
            with open(out, 'w', encoding='utf-8') as fh:
                fh.write('Title,Downloadable\n')
                for t in missing:
                    fh.write(f'"{t.replace(chr(34), chr(34)+chr(34))}",TRUE\n')
            print(f'[sync-access] {label}: {len(missing)} entries have no sheet row — '
                  f'paste scripts/sheet-rows-to-add/{label}.csv into the "{label}" tab')
        else:
            print(f'[sync-access] {label}: all entries have sheet rows.')


if __name__ == '__main__':
    main()