# Tow Guys LLC website

Marketing site for Tow Guys, 24/7 towing and roadside assistance in Gresham, OR —
live at https://www.towguysgresham.com, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Where things live

- `src/App.tsx` — header, homepage, footer
- `src/pages/ServiceArea.tsx` + `src/data/serviceAreas.ts` — the `/towing/<city>` pages
- `src/pages/BlogIndex.tsx` — `/blog`, rendered by the Soro embed (posts at `/blog?post=<slug>`)
- `src/pages/Privacy.tsx` — `/privacy`
- `api/sitemap.ts` — serves `/sitemap.xml`, pulling the post list from Soro
- `vercel.json` — which paths load the app; anything else gets `public/404.html`

## Adding a city page

Add the city to `src/data/serviceAreas.ts` **and** to the `/towing/:city(...)` list in
`vercel.json`, otherwise the new page returns a 404.
