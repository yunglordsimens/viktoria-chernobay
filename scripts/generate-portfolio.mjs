/**
 * Skanuje public/images/portfolio/<kategoria>/<projekt>/ i generuje manifest zdjęć.
 * Dzięki temu liczba zdjęć w projekcie NIE jest zapisana w kodzie —
 * wystarczy wrzucić pliki do folderu i uruchomić `npm run dev` / `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORTFOLIO_DIR = path.join(ROOT, 'public/images/portfolio');
const OUT_FILE = path.join(ROOT, 'src/data/portfolio.generated.json');

const ALLOWED = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

// 01.webp < 02.webp < 10.webp (sortowanie naturalne, nie leksykalne)
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const listDirs = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : [];

const manifest = {};

for (const category of listDirs(PORTFOLIO_DIR).sort(naturalSort)) {
  for (const project of listDirs(path.join(PORTFOLIO_DIR, category)).sort(naturalSort)) {
    const abs = path.join(PORTFOLIO_DIR, category, project);
    const images = fs
      .readdirSync(abs)
      .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
      .sort(naturalSort)
      .map((f) => `/images/portfolio/${category}/${project}/${f}`);

    manifest[`${category}/${project}`] = images;
  }
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');

const total = Object.values(manifest).reduce((n, imgs) => n + imgs.length, 0);
const empty = Object.entries(manifest).filter(([, imgs]) => imgs.length === 0);

console.log(`[portfolio] ${Object.keys(manifest).length} projektów, ${total} zdjęć`);
if (empty.length) {
  console.log(`[portfolio] puste foldery (${empty.length}): ${empty.map(([k]) => k).join(', ')}`);
}
