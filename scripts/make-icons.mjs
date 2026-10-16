// Builds every icon size browsers, Google and phones ask for from the one
// vector source, public/favicon.svg. Runs after `vite build` (see package.json)
// and writes straight into dist/, so only the SVG lives in the repo.
//   favicon.ico          16/32/48 (old browsers and Google's /favicon.ico check)
//   favicon-48.png       Google search results want a multiple of 48px
//   favicon-512.png      large icon / Android
//   apple-touch-icon.png 180px, square corners (iOS rounds them itself)
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIST = path.resolve('dist');
const svg = await readFile(path.resolve('public/favicon.svg'));
const square = Buffer.from(svg.toString().replace('rx="14"', 'rx="0"'));

const png = (src, size) => sharp(src, { density: 600 }).resize(size, size).png().toBuffer();

// An .ico file is a small header plus the PNG images themselves.
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e); // width
    header.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    header.writeUInt8(0, e + 2); // palette
    header.writeUInt8(0, e + 3); // reserved
    header.writeUInt16LE(1, e + 4); // color planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((im) => im.data)]);
}

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(svg, size) })));

await writeFile(path.join(DIST, 'favicon.ico'), ico(icoImages));
await writeFile(path.join(DIST, 'favicon-48.png'), await png(svg, 48));
await writeFile(path.join(DIST, 'favicon-512.png'), await png(svg, 512));
await writeFile(path.join(DIST, 'apple-touch-icon.png'), await png(square, 180));
console.log('icons written: favicon.ico, favicon-48.png, favicon-512.png, apple-touch-icon.png');
