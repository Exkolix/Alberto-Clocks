# Alberto Watch Company: project context for Claude

Read this first in any new chat. Owner: Obash (student, Aptech Sem 1 eProject). Repo: Exkolix/Alberto-Clocks (private).

## How to work with Obash
- **Only build or change files when he clearly asks.** A question gets an answer, not a build. If unsure, ask.
- Ask when under about 80% sure. Make **small targeted edits**, never rebuild. He is token-limited, so be brief and batch work.
- Teaching style: real-life analogy first, then the file doing the work, then how they interact, one step at a time.
- Commit and push to `main` in this repo when he asks for a change (end commits with the attribution lines the harness gives). Teammates pull.
- Verify visually or with a headless browser before saying it works, and say what was and was not checked.

## The project
Single-page responsive luxury watch site, due **Wed 10 Dec 2026** (Sem 1 frozen **Mon 30 Nov**). Deliverables: working site, report, diagrams, ReadMe.doc, demo video, zip. Brief: `original-brief.txt` (if present).
Required: logo + menu (Products, Technology, Store Locator, Support), line-ups with a watch list each, watch detail popup, Price List, Gallery, Site Map/About/Contact (email, address, phone), ticker at the bottom (date, time, location via HTML5 geolocation), visitor count top right beside the logo, menu hover/active colour, fade transitions. Must work in all leading browsers.

## Stack and how to run
Plain HTML/CSS/JS + Bootstrap 5.3 + jQuery 3.7. No build step.
- Hash router (`#/home`, `#/products?line=luxury`). Screens are fragments in `views/*.html`, fetched by `js/router.js`.
- Open `index.html` with VS Code Live Server (or any static server). Double-click (file://) also works through `js/views-bundle.js` and `js/fallback-data.js`.
- **After editing any view or `data/watches.json`, run `node tools/bundle.js`** to refresh those two bundled files.
- **Live Server rule:** every view must end with the comment `<!-- </body> (keeps VS Code Live Server ... last line) -->`. Never type that closing body tag anywhere else in a view (Live Server injects its script before it and cuts the file). `bundle.js` adds the marker; `router.js clean()` strips injections.
- Data: `data/watches.json` (3 line-ups: vintage, luxury, smart; 9 fictional watches). Placeholder art: `tools/make-placeholders.js` writes SVGs; real photos replace files in `assets/img/` (keep names, or update paths in one edit).
- Hero video `assets/video/hero.mp4` does not exist yet (poster only).

## Design (see docs/STYLE-GUIDE.md and docs/style-guide.html)
Gallery-like luxury: dark for photo screens, ivory for reading screens. Montserrat (Light 300, uppercase, wide tracking for headings; body 14px desktop, 16px phone). Tokens in `css/tokens.css`: black #0B0B0B, charcoal #1A1A1A, ivory #F7F3EA, gold #C9A25A (primary: prices, hairlines, hover, active, main button), steel #7FA3B8 (rare), ink #1E1712. Deeper blacks (`.section--deep` #050505, `.section--void` #000) are used on Featured, Services, Gallery teaser. Corners 6px, hairlines, one short line per card, details via popup/accordion/tab.
**Never:** badges/chips, stat rows, testimonials, invented history, Swiss/Geneva/CHF, real brand names, "Book appointment", currency switcher, PDF downloads. Prices USD. Cities: Abuja, Lagos, Port Harcourt. Contact: info@albertowatch.com, 22 Adeola Odeku Street, Victoria Island, Lagos, +234 800 000 0102.
Photo goal: real photos should bring colour in some places (Collections, Services, Gallery, window); Featured uses watch photos on dark backgrounds.

## Done (Home + shell), owner Obash
- Header (hamburger, logo, price-list/store icons, visitor count), hamburger menu (desktop hover sub panel on ivory; Collections shows a tile mosaic: Luxury tall, Vintage and Smart stacked), footer, **ticker at the very bottom of the footer (not fixed)**, watch popup (Bootstrap modal).
- Home: sticky shared hero/collections video stage that dims then pauses; Our Collections is a pinned **one-step** scene (heading first, then 3 cards slide up one after another, reversible); Featured carousel (6 watches, no prices, arrows + swipe, one-time load animation); Services (hairline row, deep black); fixed "window" photo section; Gallery teaser (5-tile bento, no animation).
- **Products** (`#/products`, built by Obash/Claude, Nov 27): dark screen, left sidebar filters (collection checkboxes, log-scale price slider, clear), sort, 3-col grid (2 on tablet/phone, filters collapse to a "Filters" button under 992px), card = photo + name + gold price, click opens the shared popup. Files: `views/products.html`, `css/products.css`, `js/products.js`. `?line=a,b` preselects and stays in sync via `history.replaceState`.
- Motion lives in `js/motion.js` (reveals, parallax, stage, scene, header progress line). Respects reduced motion.
- Removed by decision: Sport & Dive collection (and its watches).

## Pending
- Menu check on phone; phone and Firefox/Edge visual checks; real `hero.mp4`; real photos (one batch swap); Services photos (undecided).
- Screens still to build (routes exist, show "Coming soon"): price-list, technology, gallery, store-locator (+contact), support (+services), about, sitemap. Watch popup is a shared component.
- Reports, diagrams, ReadMe.doc, demo video, final zip.

## Team and ownership
Obash owns tokens, shell, all JS, Home, `css/tokens|base|shell|components|home.css`, `data/`. Two teammates (HTML/CSS only; reliability unknown): **A** Products, Price List, popup content; **B** Gallery, About, Store Locator + Contact, Support, Technology, Site Map. Each screen = `views/<name>.html` + `css/<name>.css`, one owner per file. Start from `views/_template.html`. Read `docs/TEAM-GUIDE.md` (setup, hooks, status board, schedule) and `docs/GALLERY-BRIEF.md`. Git test: `team.txt`.

## Gotchas learned
- Use `minmax(0, 1fr)` not `1fr` for carousel/grid parents (mobile widening).
- IntersectionObserver ignores clipped targets: put clip-path on the `img`, not the wrapper.
- Animation fill `both` overrides inline opacity: use `backwards`.
- When moving CSS blocks, check braces balance (an unclosed media query broke the menu labels once).
