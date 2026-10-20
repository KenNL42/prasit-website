/**
 * Run a Python script with the repo's virtual environment when it exists,
 * falling back to the system python otherwise.
 *
 * Usage from npm scripts (works on Windows and Unix, with or without an
 * activated venv):
 *   node scripts/py.mjs scripts/render-viewer.py
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [
  join(root, '.venv', 'Scripts', 'python.exe'), // Windows venv
  join(root, '.venv', 'bin', 'python'), // macOS / Linux venv
];
const venvPython = candidates.find((p) => existsSync(p));

const python = venvPython ?? (process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, process.argv.slice(2), { stdio: 'inherit' });

if (result.error) {
  console.error(`[py.mjs] failed to run "${python}": ${result.error.message}`);
  console.error('Create the venv first: python -m venv .venv && .venv/Scripts/pip install -r requirements.txt');
}
process.exit(result.status ?? 1);