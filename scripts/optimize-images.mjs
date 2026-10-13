// Creates <name>-800.webp and <name>-1600.webp next to every JPEG in public/
// (used by src/components/Picture.tsx). Re-run after adding photos:
//   npm run images
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public');
const WIDTHS = [800, 1600];

async function* jpegs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* jpegs(full);
    else if (/\.jpe?g$/i.test(entry.name)) yield full;
  }
}

for await (const file of jpegs(ROOT)) {
  const base = file.replace(/\.jpe?g$/i, '');
  for (const width of WIDTHS) {
    const out = `${base}-${width}.webp`;
    const existing = await stat(out).catch(() => null);
    if (existing && existing.mtimeMs >= (await stat(file)).mtimeMs) continue;
    await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
    console.log(`${path.relative(ROOT, out)}  ${Math.round((await stat(out)).size / 1024)} KB`);
  }
}
