# Team Guide: how we build together

**The idea:** Obash owns the building (header, menu, footer, colours, animations, all JavaScript). Each of you decorates your own rooms (screens). A screen is two files you own. It shows up inside the real site, so your work is visible the moment you save.

## 1. Setup (Wed 25 Nov, 10 minutes)
1. Install VS Code, Git, and the **Live Server** extension.
2. Clone the repo (Obash sends the link).
3. **Git test:** open `team.txt`, add your name on a new line, save, commit, `git pull`, `git push`. If this works, we use Git. If not by the end of the day, we use the fallback (section 7).
4. Open `index.html` with Live Server (right-click > Open with Live Server). You should see the Home page.

## 2. Who owns what
| Person | Screens | Files you edit |
|---|---|---|
| **A** | Products, Price List, Watch popup content | `views/products.html`, `css/products.css`, `views/price-list.html`, `css/price-list.css` |
| **B** | Gallery, About, Store Locator + Contact, Support, Technology, Site Map | `views/gallery.html` `css/gallery.css`, `views/about.html` `css/about.css`, `views/store-locator.html` `css/store-locator.css`, `views/support.html` `css/support.css`, `views/technology.html` `css/technology.css`, `views/sitemap.html` `css/sitemap.css` |
| **Obash** | Home, header, menu, footer, ticker, all `js/`, `css/tokens.css` `base.css` `shell.css` `components.css` `home.css`, `data/` | everything else |

**Never edit a file you do not own.** If you need a change there, message Obash.

## 3. How to build a screen
1. Copy `views/_template.html` to `views/<name>.html` (names: products, price-list, technology, gallery, store-locator, support, about, sitemap).
2. Create an empty `css/<name>.css`. The template's first line already links it (change `NAME`).
3. Open `index.html#/<name>` in Live Server. Edit, save, watch it update.
4. Use ready-made classes from `docs/style-guide.html`. Put only your screen's extra styling in your own css file, and scope it (for example `.gal-grid`, not `div`).
5. Do not add `<script>`. Do not touch the last line of your view.
6. Check with the list at the bottom of `docs/STYLE-GUIDE.md`, then push.

## 4. Hooks (so Obash's JavaScript can plug in later)
Add these ids/attributes to your markup. They do nothing visually.
- **Products:** grid `id="productGrid"`; line-up checkboxes `data-line="vintage|luxury|smart"`; `id="priceRange"`; `id="sortBy"`. Draw 4 example `.watch-card`s so we see the layout.
- **Price List:** `<table class="table-lux" id="priceTable">`, rows `<tr data-watch="heritage-1962-chronograph">`; line-up tabs with `data-line`; search `id="priceSearch"`.
- **Technology:** each topic `<article class="tech-item" data-key="mechanical">` (mechanical, automatic, quartz, solar, smart-sensors).
- **Gallery:** each image `<a class="g-item" data-full="assets/img/gallery/g1.svg"><img ...></a>`.
- **Store Locator + Contact:** city tabs with `.nav-lux` (Abuja, Lagos, Port Harcourt); map box `id="storeMap"`; form `id="contactForm"` using `.field`.
- **Support:** Bootstrap accordion with `.accordion-lux`; services block `id="services"`.

## 5. Rules
- One owner per file. Small commits. `git pull` before you start, `git push` when you stop.
- No copying code from other websites. Our own words, our own classes.
- Ask when unsure. A 1-line question beats a wrong screen.

## 6. Schedule
| Day | Goal |
|---|---|
| Wed 25 | Setup + git test |
| Thu 26 | First screen pushed (check-in with Obash) |
| Fri 27 | Second screen |
| Sat 28 | Remaining screens + fixes |
| Sun 29 | Polish, phone check |
| **Mon 30** | **Freeze (Sem 1)** |

## 7. Status board (so everyone's work shows)
Update your row when you push. Statuses: `Not started`, `In progress`, `Ready for review`, `Done`.

| Screen | Owner | Status | Open it at |
|---|---|---|---|
| Home | Obash | Done (v2) | `#/home` |
| Products | Obash | Done (v1) | `#/products` |
| Price List | Obash | Done (v1) | `#/price-list` |
| Technology | Obash | Done (v1) | `#/technology` |
| Gallery | B | Not started | `#/gallery` |
| Store Locator + Contact | B | Not started | `#/store-locator` |
| Support | B | Not started | `#/support` |
| About | B | Not started | `#/about` |
| Site Map | B | Not started | `#/sitemap` |

Screens still missing show a "Coming soon" page, so the site always works.

**Fallback if Git fails:** send your two files per screen to Obash in the group chat (zip). Obash drops them in.

## 8. Message to paste in the group
> Hi team. Download/clone the Alberto project. Read `docs/TEAM-GUIDE.md` first (5 min), then open `docs/style-guide.html` in Live Server to see our design. Do the git test in `team.txt` today. A: Products + Price List. B: Gallery, About, Store Locator/Contact, Support, Technology, Site Map. Each screen = 1 html + 1 css file you own. Don't edit anything else. First screen pushed by Thursday. Ask me anything.
