// Node ESM on Vercel needs the extension; TypeScript maps .js to the .ts source.
import SERVICE_AREAS from '../src/data/serviceAreas.js';

const SITE_URL = 'https://www.towguysgresham.com';
const SORO_EMBED_URL = 'https://app.trysoro.com/api/embed/bd046227-ac0a-4481-8b04-218d7f8e46d5';

type Entry = { loc: string; lastmod?: string; changefreq: string; priority: string };

// The Soro embed script ships every published article inline
// ({"slug":"...", ..., "isoDate":"..."}), so it doubles as the post index.
async function fetchBlogPosts(): Promise<Entry[]> {
  const res = await fetch(SORO_EMBED_URL);
  if (!res.ok) throw new Error(`Soro embed returned ${res.status}`);
  const js = await res.text();
  const posts: Entry[] = [];
  const seen = new Set<string>();
  const re = /"slug":"([a-z0-9-]+)"[^{}]*?"isoDate":"([^"]+)"/g;
  for (const [, slug, isoDate] of js.matchAll(re)) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    posts.push({
      loc: `${SITE_URL}/blog?post=${slug}`,
      lastmod: isoDate.slice(0, 10),
      changefreq: 'monthly',
      priority: '0.6',
    });
  }
  return posts;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(_req: any, res: any) {
  const entries: Entry[] = [
    { loc: `${SITE_URL}/`, changefreq: 'monthly', priority: '1.0' },
    ...SERVICE_AREAS.map((c) => ({
      loc: `${SITE_URL}/towing/${c.slug}`,
      changefreq: 'monthly',
      priority: '0.9',
    })),
    { loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.7' },
  ];

  try {
    entries.push(...(await fetchBlogPosts()));
  } catch (err) {
    // Still serve the core pages if Soro is unreachable.
    console.error('Failed to load blog posts for sitemap:', err);
  }

  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}
