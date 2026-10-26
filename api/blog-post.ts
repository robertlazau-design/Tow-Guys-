// Serves /blog and /blog?post=<slug> (see the rewrite in vercel.json) as real HTML.
//
// A post gets its own title, description, canonical, share tags, BlogPosting
// schema and full text, plus links to other recent posts. The listing gets a
// plain list of every post, so search engines can reach all of them without
// running Soro's script. A slug Soro doesn't have answers 404.
//
// In the browser, src/pages/BlogIndex.tsx moves this server copy into the page,
// and on a post it skips the Soro embed. The page Google renders is then exactly
// what the server sent. (Before, an inline script deleted this copy and Soro
// rebuilt the post client-side; Google ended up seeing no canonical and treated
// several posts as duplicates, redirects or soft 404s.)
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://www.towguysgresham.com';
const SORO_API = 'https://app.trysoro.com';
const SORO_TOKEN = 'bd046227-ac0a-4481-8b04-218d7f8e46d5';

// Element ids BlogIndex looks for.
const SSR_POST_ID = 'soro-ssr';
const SSR_LIST_ID = 'ssr-posts';
const MORE_POSTS = 6;

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  isoDate?: string;
  image?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const isShell = (html: string) => html.includes('<div id="root">');

async function loadShell(host?: string): Promise<string> {
  // The prerendered /blog page ships with this function (includeFiles in
  // vercel.json), so the HTML always matches this deployment's own scripts.
  try {
    const html = await readFile(path.join(process.cwd(), 'dist', 'blog.html'), 'utf8');
    if (isShell(html)) return html;
  } catch {
    // not bundled: fetch it instead
  }
  const bases = [host ? `https://${host}` : '', SITE_URL].filter(Boolean);
  for (const base of bases) {
    try {
      const r = await fetch(`${base}/blog.html`);
      if (!r.ok) continue;
      const html = await r.text();
      // Skip anything that isn't our page (e.g. a Vercel login wall on previews).
      if (isShell(html)) return html;
    } catch {
      // try the next base
    }
  }
  throw new Error('blog shell unavailable');
}

async function loadArticles(): Promise<Article[]> {
  const r = await fetch(`${SORO_API}/api/embed/${SORO_TOKEN}`);
  if (!r.ok) throw new Error(`Soro embed returned ${r.status}`);
  const js = await r.text();
  const m = js.match(/var SORO_ARTICLES = (\[[\s\S]*?\]);\n/);
  const list = m ? (JSON.parse(m[1]) as Article[]) : [];
  // Newest first.
  return list.sort((a, b) => String(b.isoDate || '').localeCompare(String(a.isoDate || '')));
}

async function loadContent(id: string): Promise<string> {
  const r = await fetch(`${SORO_API}/api/embed/${SORO_TOKEN}/article/${id}`);
  if (!r.ok) return '';
  const data = await r.json();
  // Soro's own HTML; drop anything executable just in case.
  return String(data?.content || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+="[^"]*"/gi, '');
}

const postUrl = (slug: string) => `${SITE_URL}/blog?post=${slug}`;
const postLink = (a: Article) => `<a href="/blog?post=${esc(a.slug)}">${esc(a.title)}</a>`;

function withPostHead(shell: string, a: Article, url: string): string {
  const title = esc(`${a.title} | Tow Guys Gresham`);
  const desc = esc(a.excerpt || a.title);
  const image = esc(a.image || `${SITE_URL}/images/og-share.jpg`);
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt || a.title,
    image: a.image || `${SITE_URL}/images/og-share.jpg`,
    datePublished: a.isoDate,
    dateModified: a.isoDate,
    mainEntityOfPage: url,
    url,
    author: { '@type': 'Organization', name: 'Tow Guys LLC', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Tow Guys LLC', url: SITE_URL },
  }).replace(/</g, '\\u003c');
  return shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}"/>`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, '<meta property="og:type" content="article"/>')
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(url)}"/>`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${image}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}"/>`)
    .replace(
      '</head>',
      `  <meta property="og:description" content="${desc}"/>\n    <script type="application/ld+json">${schema}</script>\n  </head>`,
    );
}

function postHtml(a: Article, content: string, more: Article[]): string {
  const img = a.image
    ? `<img src="${esc(a.image)}" alt="${esc(a.title)}" width="1200" height="630" loading="eager">`
    : '';
  const moreHtml = more.length
    ? `<section><h2>More towing tips</h2><ul>${more.map((m) => `<li>${postLink(m)}</li>`).join('')}</ul></section>`
    : '';
  return (
    `<article id="${SSR_POST_ID}" data-slug="${esc(a.slug)}">` +
    `<p><a href="/blog">&larr; All news &amp; tips</a></p>` +
    `<h1>${esc(a.title)}</h1>` +
    (a.date ? `<p><time datetime="${esc(a.isoDate || '')}">${esc(a.date)}</time></p>` : '') +
    img +
    (content || `<p>${esc(a.excerpt || '')}</p>`) +
    `<p>Need a tow in Gresham or East County? Call Tow Guys 24/7 at <a href="tel:9712227994">(971) 222-7994</a>.</p>` +
    moreHtml +
    `</article>`
  );
}

function listHtml(articles: Article[]): string {
  const items = articles
    .map(
      (a) =>
        `<li>${postLink(a)}` +
        (a.date ? ` <time datetime="${esc(a.isoDate || '')}">${esc(a.date)}</time>` : '') +
        `</li>`,
    )
    .join('');
  return `<nav id="${SSR_LIST_ID}" aria-label="Every post"><h2>Every post</h2><ul>${items}</ul></nav>`;
}

export default async function handler(req: any, res: any) {
  const slug = String(req.query?.post || '');
  const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '');
  let shell: string;
  try {
    shell = await loadShell(host);
  } catch {
    res.status(502).send('Blog temporarily unavailable');
    return;
  }

  let html = shell;
  let status = 200;
  try {
    const articles = await loadArticles();
    if (!slug) {
      if (articles.length) html = shell.replace('</body>', `${listHtml(articles)}\n  </body>`);
    } else {
      const a = /^[a-z0-9-]+$/.test(slug) ? articles.find((x) => x.slug === slug) : undefined;
      if (a) {
        const url = postUrl(a.slug);
        const more = articles.filter((x) => x.slug !== a.slug).slice(0, MORE_POSTS);
        const article = postHtml(a, await loadContent(a.id), more);
        html = withPostHead(shell, a, url).replace('</body>', `${article}\n  </body>`);
      } else if (articles.length) {
        // Not a post Soro has: answer 404 so this URL isn't indexed as the listing.
        status = 404;
        html = shell.replace('</head>', '  <meta name="robots" content="noindex"/>\n  </head>');
      }
    }
  } catch (err) {
    // Fall back to the plain listing shell if Soro is unreachable.
    console.error('blog render failed:', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(status).send(html);
}
