// Serves /blog?post=<slug> (see the rewrite in vercel.json) as real HTML: the
// article's own title, description, canonical, share tags, BlogPosting schema
// and full text. Without this every post URL returned the /blog listing shell,
// which told search engines "this page is /blog" and had none of the article.
// In the browser nothing changes: the inline script drops #soro-ssr right away
// and the Soro embed renders the post as before.
const SITE_URL = 'https://www.towguysgresham.com';
const SORO_API = 'https://app.trysoro.com';
const SORO_TOKEN = 'bd046227-ac0a-4481-8b04-218d7f8e46d5';

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

async function loadShell(host?: string): Promise<string> {
  const bases = [host ? `https://${host}` : '', SITE_URL].filter(Boolean);
  for (const base of bases) {
    try {
      const r = await fetch(`${base}/blog.html`);
      if (!r.ok) continue;
      const html = await r.text();
      // Skip anything that isn't our page (e.g. a Vercel login wall on previews).
      if (html.includes('<div id="root">')) return html;
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
  return m ? (JSON.parse(m[1]) as Article[]) : [];
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
  try {
    const a = /^[a-z0-9-]+$/.test(slug) ? (await loadArticles()).find((x) => x.slug === slug) : undefined;
    if (a) {
      const url = `${SITE_URL}/blog?post=${a.slug}`;
      const content = await loadContent(a.id);
      const img = a.image
        ? `<img src="${esc(a.image)}" alt="${esc(a.title)}" width="1200" height="630" loading="eager">`
        : '';
      const article =
        `<article id="soro-ssr" class="max-w-3xl mx-auto px-4 py-12">` +
        `<p><a href="/blog">&larr; All news &amp; tips</a></p>` +
        `<h1>${esc(a.title)}</h1>` +
        (a.date ? `<p><time datetime="${esc(a.isoDate || '')}">${esc(a.date)}</time></p>` : '') +
        img +
        (content || `<p>${esc(a.excerpt || '')}</p>`) +
        `<p>Need a tow in Gresham or East County? Call Tow Guys 24/7 at <a href="tel:9712227994">(971) 222-7994</a>.</p>` +
        `</article>` +
        `<script>document.getElementById('soro-ssr').remove()</script>`;
      html = withPostHead(shell, a, url).replace('</body>', `${article}\n  </body>`);
    }
  } catch (err) {
    // Fall back to the plain listing shell if Soro is unreachable.
    console.error('blog-post render failed:', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
