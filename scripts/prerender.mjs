// Writes a fully rendered HTML file for every route, so search engines, AI
// crawlers and link previews get real content without running JavaScript.
// Runs after `vite build` (client → dist/) and the SSR build (→ dist-server/).
//
//   /                  → dist/index.html
//   /blog              → dist/blog.html          (served at /blog via cleanUrls)
//   /towing/gresham    → dist/towing/gresham.html
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const SERVER_ENTRY = path.resolve('dist-server/entry-server.js');

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
const { render, ROUTES } = await import(pathToFileURL(SERVER_ENTRY).href);

// React 19 emits hoisted <title>/<meta>/<link> as a block at the start of the
// output; those belong in <head>, the rest is the app markup.
const HEAD_TAG = /^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>)/;

function splitHead(html) {
  let head = '';
  let rest = html;
  for (let m = rest.match(HEAD_TAG); m; m = rest.match(HEAD_TAG)) {
    head += m[0];
    rest = rest.slice(m[0].length);
  }
  return { head, body: rest };
}

for (const route of ROUTES) {
  const { head, body } = splitHead(render(route));
  if (!head.includes('<title>')) throw new Error(`${route}: page rendered no <title>`);

  const html = template
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  const out = path.join(DIST, file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`prerendered ${route.padEnd(36)} → dist/${file}`);
}

await rm(path.resolve('dist-server'), { recursive: true, force: true });
