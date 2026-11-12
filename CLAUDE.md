# Tow Guys (towguysgresham.com): notes for Claude

The website for Tow Guys 24HR Roadside, a 24/7 towing company in Gresham, Oregon. Robert Lazau (Golden Boy Productions) builds and runs it for the owner, his brother. Read this before changing anything.

## How Robert works

- **Never commit to `main`.** Use a feature branch and open a pull request; Robert merges.
- **Keep commits few.** Vercel has a daily build cap, so bundle related changes into one PR.
- **Show the change first.** For anything visual, send a side-by-side video (now vs. new) and the gzip size difference before opening the PR.
- **Don't invent facts.** No made-up prices, response times, discounts, awards, licenses, review counts or customer stories. If something is unknown, ask.
- **Google profile posts are drafts.** Robert approves each one.

## Stack

- Vite, React 19 and Tailwind CSS 4, hosted on Vercel (project `tow-guys`).
- Pages are prerendered to static HTML by `scripts/prerender.mjs`. `npm run build` builds and prerenders. `npm run lint` type-checks.
- Blog posts come from Soro and are served as real HTML by `api/blog-post.ts` (`/blog` and `/blog?post=<slug>`). The sitemap is `api/sitemap.ts`.

| File | What's in it |
| --- | --- |
| `src/App.tsx` | App shell, header, footer and the home page |
| `src/pages/ServicePage.tsx` | The six service pages (`/services/<slug>`) |
| `src/pages/ServiceArea.tsx` | The town pages (`/towing/<town>`) |
| `src/data/services.ts`, `src/data/serviceAreas.ts` | Content and SEO text for those pages |
| `src/effects.tsx` | Motion effects (see below) |
| `src/index.css` | Brand tokens and effect styles (`tg-` classes) |

## Brand

- Colors are CSS variables in `src/index.css`: `--blue` `#0055ff`, `--orange` `#ff5500`, `--bg` and `--fg` (white/black, swapped by the `.dark` class on the app root).
- Type: Space Grotesk (`font-display`) for headings, Inter for body text, JetBrains Mono (`font-mono`) for labels and small text.

## Motion rules (the Golden Boy kit, same as RobertLazau.com)

- **What to animate:** only `transform` and `opacity`, plus small paint-only touches (a text color glint, a card light). Never animate layout.
- **Easing:** `--tg-ease-cut` (`cubic-bezier(0.76, 0, 0.24, 1)`) for things that open or close.
- **Reduce motion:** every effect needs a `prefers-reduced-motion` fallback that shows the finished state.
- **Mouse-only effects:** put them behind `(hover: hover) and (pointer: fine)`.
- **Text:** keep all of it in the prerendered HTML. Never hide content until JavaScript runs, and never hide something that was already on screen at load.
- **The phone number comes first.** Nothing may delay or hide it; people calling may be stranded.
- **Libraries:** don't add animation libraries. `motion` is already in the bundle.
- **Phones:** nothing may make the page scroll sideways (`scrollWidth` must equal the viewport width).

## Effects in `src/effects.tsx` (styles in `index.css`)

| Effect | Where | What it does |
| --- | --- | --- |
| `.tg-glint` / `.tg-sweep-text` | Home: the big phone number | The number catches the light once after load: each digit glints in turn on desktop, one sweep on phones. Readable from the first frame. |
| `Letterbox` | Home: the "Gresham, Oregon" photo band | Widescreen bars open the first time it scrolls into view. If the band already peeks into the first screen on load, it stays as is. |
| `MagneticLink` | "Call Now" buttons: home hero, service pages, town pages | The button leans toward the cursor. |
| `usePageEffects` + `.tg-glow` | Home: the four service tiles and the review cards | A soft light follows the mouse: white on the tiles (over their blue hover fill), blue on the review cards. |

## Lead events and Speed Insights

- `src/leadEvents.ts` counts leads as Vercel Web Analytics custom events (Pro plan): `Call Click`, `Text Click`, `Email Click` and `Directions Click`, from one click listener started in `src/main.tsx`. `App.tsx` also sends `Send Location Click` and `Junk Car Quote Click`.
- Each event has two properties at most (Pro's limit): `page` and `spot`. `spot` comes from the nearest `data-spot` attribute (`big-number`, `hero`, `bottom`, `mobile-bar`, `menu`), else `header`, `footer`, the section id, or `page`. Give a new call button a `data-spot` if you want it counted on its own.
- Never put names, phone numbers, plates or message text in an event.
- Speed Insights (`<SpeedInsights />` in `src/main.tsx`) records real visitors' load speed. It has to be switched on for the project in Vercel too.

