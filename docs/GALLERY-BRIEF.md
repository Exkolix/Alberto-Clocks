# Gallery page: brief for the teammate

**Files you own:** `views/gallery.html` and `css/gallery.css`. Open it at `index.html#/gallery`. Start from `views/_template.html`. Read `docs/STYLE-GUIDE.md` first.

## What the brief says
"Gallery can be added for viewing different images." So: a page of watch photos that can be viewed larger.

## Layout (dark page, black background)
- Page head at the top (`.page-head`): title **Gallery**, one short line.
- Then a "bento" grid of photos on black with thin gaps (about 8px), corners 6px:
  - one large tile in the middle (spans two rows)
  - two stacked tiles on the left, two stacked on the right
  - repeat this 5-tile block down the page for as many photos as we have (use 10 placeholders: 2 blocks)
- The Home page already has one 5-tile block in this style: see `.gallery-tiles` and `.g-tile` in `css/home.css`. Copy the idea into your own `gallery.css` with your own class names (for example `.gal-grid`, `.gal-item`).
- Phone (under 768px): big tile on top, then a 2 x 2 grid.
- Hover: thin gold border (`var(--c-gold)`) and a slight brightness lift. No text on the tiles.

## What each photo needs
```html
<a class="gal-item" href="assets/img/gallery/g1.svg" data-full="assets/img/gallery/g1.svg">
  <img src="assets/img/gallery/g1.svg" alt="Short description of the photo" loading="lazy">
</a>
```
- `data-full` = the large version. Obash will add the click-to-enlarge viewer (lightbox) later, so do not write JavaScript.
- Always add `alt` text.
- Images fill their tile: `width:100%; height:100%; object-fit:cover`.

## Animation (classes only)
- Add `reveal-img` to each tile and `style="--i:0"`, `--i:1`... so the photos wipe in one after another.
- Heading: `class="title split"` with an inner `<span>`.

## Photos
We use placeholders in `assets/img/gallery/` (g1 to g5). Real photos will replace them later with the same file names, so do not rename.

## Do not
No captions, badges, prices or filters on this page. No other files. Keep the last line of your view file.

## Done when
- [ ] Looks right at 390, 768 and 1440 px wide, no sideways scrolling
- [ ] No red errors in the console (F12)
- [ ] Only your two files changed
