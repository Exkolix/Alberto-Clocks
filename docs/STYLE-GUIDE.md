# Alberto Watch Company: Look and Feel

Open `docs/style-guide.html` in Live Server to SEE everything below. Screenshots of the finished Home are in `docs/reference/`. Match them.

## The vibe in one sentence
A quiet gallery for fine watches. Dark rooms for photos, ivory rooms for reading, a little gold, very few words.

## Rules that matter most
1. **Dark for photo screens, ivory for reading screens.** Products, Gallery, Price List = dark. About, Support, Contact, Site Map = ivory (mix is fine, alternate sections).
2. **Gold is the only accent** (`var(--c-gold)`): prices, thin lines, hover, active tab, the ONE main button. Steel blue is only for tiny focus highlights.
3. **Very little text.** One short line per card. Details appear on click (popup, accordion, tab).
4. **One font**: Montserrat. Headings Light, UPPERCASE, wide spacing. Body 14px desktop, 16px phone.
5. **Corners 6px or less. Thin 1px lines.** No heavy shadows, no gradients on buttons.
6. **Use the variables.** `var(--c-gold)`, never `#C9A25A`. Use `.wrap`, `.section--dark`, `.section--ivory`, `.title`, `.btn-gold` etc. from `docs/style-guide.html`.

## Do not use
Badges, chips, stat rows ("25 years, 40 awards"), testimonials, certifications, invented history, Swiss/Geneva wording, CHF, real brand names, "Book appointment", currency switchers, PDF downloads.

## Facts to use
- Cities: Abuja, Lagos, Port Harcourt. Prices in USD.
- Email info@albertowatch.com
- Address 22 Adeola Odeku Street, Victoria Island, Lagos
- Phone +234 800 000 0102

## Motion (add a class, nothing else)
| Class | Effect |
|---|---|
| `reveal` | fades up when scrolled into view |
| `reveal reveal--up` | slides up from further down (cards) |
| `style="--i:2"` | stagger delay: 0, 1, 2, 3... |
| `split` + inner `<span>` | heading rises out of a mask |
| `reveal-img` | picture wipes open |

Do not write your own animation or JavaScript. Need something new? Ask Obash.

## Images
Use files in `assets/img/`. Photos go in a 4:5 portrait tile. Keep names; Obash swaps real photos in later. Always add `alt`.

## Check before you push
- [ ] Looks like the Home screenshots (dark or ivory, gold accent, calm)
- [ ] Opens at `index.html#/yourscreen` with no red errors in the console (F12)
- [ ] Fine at 390px (phone), 768px (tablet), 1440px (desktop). No sideways scrolling
- [ ] Text min 14px, nothing cut off
- [ ] Only the two files you own were changed
- [ ] The last line of your view is still the Live Server comment
