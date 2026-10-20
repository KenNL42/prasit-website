"""
Sync viewable/downloadable flags from a published Google Sheet.

The tracker sheet (published to the web) has one row per publication/book:
    File | Title | Language | Year | Viewable | Downloadable | Note
`File` must equal the `pdf:` file name in the Markdown frontmatter. Put
"N" (or ไม่/0/false) in Downloadable to make an entry view-only; leave
blank or "Y" to keep it downloadable. The script writes `viewable:` and
`downloadable:` into the frontmatter of the matching Markdown files.

The published CSV export URL goes in scripts/access-sheet-url.txt
(one line). Run from the repo root:
    python scripts/sync-access.py          # or: npm run sync:access
"""
import os
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL_FILE = os.path.join(ROOT, 'scripts', 'access-sheet-url.txt')
CONTENT = os.path.join(ROOT, 'src', 'content')

COLLECTIONS = [
    os.path.join(CONTENT, 'publications', 'en'),
    os.path.join(CONTENT, 'publications', 'th'),
    os.path.join(CONTENT, 'thai_books'),
]


def truthy(v):
    return v.strip().lower() in ('y', 'yes', '1', 'true', 'ใช่', 'ได้', 'ดูได้', 'ดาวน์โหลดได้')


def is_false(v):
    return v.strip().lower() in ('n', 'no', '0', 'false', 'ไม่', 'ไม่ได้', 'x')


def read_url():
    if not os.path.exists(URL_FILE):
        return None
    for line in open(URL_FILE, encoding='utf-8'):
        line = line.strip()
        if line and not line.startswith('#'):
            return line
    return None


def fetch_csv(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read().decode('utf-8', errors='replace')
    # strip the BOM and split rows (simple CSV; cells are not quoted in the
    # Google Sheets export unless they contain commas — handle quoted cells)
    rows = []
    for line in data.lstrip('\ufeff').splitlines():
        cells = []
        for cell in line.split(','):
            cell = cell.strip()
            if len(cell) >= 2 and cell[0] == '"' and cell[-1] == '"':
                cell = cell[1:-1].replace('""', '"')
            cells.append(cell)
        rows.append(cells)
    return rows


def update_frontmatter(path, changes):
    s = open(path, encoding='utf-8').read()
    for key, val in changes.items():
        if val is None:
            continue
        line = f'{key}: {val}'
        if re.search(rf'^{key}:.*$', s, re.M):
            s = re.sub(rf'^{key}:.*$', line, s, count=1, flags=re.M)
        else:
            # insert before the closing "---"
            s = re.sub(r'^(---\n.*?)(\n---)', rf'\1\n{line}\2', s, count=1, flags=re.S)
    open(path, 'w', encoding='utf-8').write(s)


def main():
    url = read_url()
    if not url:
        print('[sync-access] no sheet URL in scripts/access-sheet-url.txt — skipping '
              '(put your published CSV export URL there to enable syncing).')
        return
    try:
        rows = fetch_csv(url)
    except Exception as exc:  # network / sheet unreachable — keep committed flags
        print(f'[sync-access] could not fetch the sheet ({exc}) — keeping committed flags.')
        return

    # header row: locate column indexes by name (case-insensitive)
    header = [c.strip().lower() for c in rows[0]]
    idx_file = next((i for i, h in enumerate(header) if 'file' in h or 'ไฟล์' in h), 0)
    idx_view = next((i for i, h in enumerate(header) if 'view' in h or 'ดู' in h), None)
    idx_down = next((i for i, h in enumerate(header) if 'download' in h or 'ดาวน์โหลด' in h), None)
    if idx_down is None:
        print('[sync-access] no Downloadable column found in the sheet header — skipping.')
        return

    sheet = {}
    for row in rows[1:]:
        if len(row) <= max(idx_file, idx_down if idx_down else 0):
            continue
        fname = row[idx_file].strip()
        if not fname:
            continue
        view = row[idx_view].strip() if idx_view is not None and len(row) > idx_view else ''
        down = row[idx_down].strip() if len(row) > idx_down else ''
        sheet[fname] = (view, down)

    changed = 0
    unmatched = []
    for content_dir in COLLECTIONS:
        for f in sorted(os.listdir(content_dir)):
            if not f.endswith('.md'):
                continue
            p = os.path.join(content_dir, f)
            s = open(p, encoding='utf-8').read()
            m = re.search(r'^pdf: "(.*)"$', s, re.M)
            if not m:
                continue
            pdf_name = m.group(1)
            if pdf_name not in sheet:
                unmatched.append(f'{os.path.basename(content_dir)}/{pdf_name}')
                continue
            view, down = sheet[pdf_name]
            changes = {}
            if idx_view is not None and view:
                changes['viewable'] = 'true' if truthy(view) else ('false' if is_false(view) else None)
            if down:
                changes['downloadable'] = 'true' if truthy(down) else ('false' if is_false(down) else None)
            if changes:
                update_frontmatter(p, changes)
                changed += 1
                for k, v in changes.items():
                    print(f'  {pdf_name[:50]:52s} {k}={v}')
    print(f'[sync-access] updated {changed} entries.')
    if unmatched:
        print(f'  note: {len(unmatched)} md pdf names have no sheet row (defaults kept):')
        for u in unmatched[:10]:
            print(f'    - {u[:70]}')


if __name__ == '__main__':
    main()