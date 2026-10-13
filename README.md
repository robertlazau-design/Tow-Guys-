# Tow Guys LLC website

Marketing site for Tow Guys, 24/7 towing and roadside assistance in Gresham, OR —
live at https://www.towguysgresham.com, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## How it's built

`npm run build` builds the app, then `scripts/prerender.mjs` writes a finished
HTML file for every route listed in `src/entry-server.tsx` (home, blog, privacy,
every service and city page). Vercel serves those files directly (`cleanUrls`),
so crawlers and link previews see real content; React then takes over in the
browser. Anything without a file gets `public/404.html`.

## Where things live

- `src/App.tsx` — header, homepage, footer
- `src/pages/ServicePage.tsx` + `src/data/services.ts` — the `/services/<slug>` pages
- `src/pages/ServiceArea.tsx` + `src/data/serviceAreas.ts` — the `/towing/<city>` pages
- `src/pages/BlogIndex.tsx` — `/blog`, rendered by the Soro embed (posts at `/blog?post=<slug>`)
- `src/pages/Privacy.tsx` — `/privacy`
- `api/sitemap.ts` — serves `/sitemap.xml` (all pages plus every Soro post)

Adding a service or city is just a new entry in its data file — the page,
prerendered HTML and sitemap entry follow automatically.

## Photos

Put JPEGs in `public/gallery` or `public/images`, then run `npm run images` to
create the 800px/1600px WebP versions that `<Picture>` serves. Commit both.
