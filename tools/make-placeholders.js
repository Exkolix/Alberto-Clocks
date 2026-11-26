// Generates unbranded SVG placeholder art. Run: node tools/make-placeholders.js
// Replace the files in assets/img/ with real photos later (keep the same names or update data/watches.json).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'assets', 'img');
const out = (p, s) => { p = path.join(root, p); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

function watch(o) {
  const { cx, cy, r, face, rim, strap, hands = '#e8e2d0', accent = '#C9A25A', mode = 'dress', subdials = false } = o;
  let s = '';
  // strap
  s += `<rect x="${cx - r * 0.46}" y="${cy - r * 2.6}" width="${r * 0.92}" height="${r * 5.2}" rx="${r * 0.12}" fill="${strap}"/>`;
  s += `<rect x="${cx - r * 0.46}" y="${cy - r * 2.6}" width="${r * 0.92}" height="${r * 5.2}" rx="${r * 0.12}" fill="url(#sheen)" opacity=".35"/>`;
  // case + bezel
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 1.1}" fill="#000" opacity=".35" filter="url(#blur)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 1.06}" fill="${rim}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 1.06}" fill="url(#sheen)" opacity=".5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.94}" fill="#0b0b0b" opacity=".45"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="${face}"/>`;
  if (mode === 'skeleton') {
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1, gx = cx + Math.cos(a) * r * 0.32, gy = cy + Math.sin(a) * r * 0.32;
      s += `<circle cx="${gx}" cy="${gy}" r="${r * 0.28}" fill="none" stroke="${accent}" stroke-width="${r * 0.025}" stroke-dasharray="${r * 0.05} ${r * 0.045}"/>`;
    }
  }
  if (mode === 'smart') {
    s += `<path d="M ${cx - r * 0.7} ${cy} A ${r * 0.7} ${r * 0.7} 0 0 1 ${cx + r * 0.2} ${cy - r * 0.67}" fill="none" stroke="${accent}" stroke-width="${r * 0.07}" stroke-linecap="round"/>`;
    s += `<path d="M ${cx + r * 0.7} ${cy} A ${r * 0.7} ${r * 0.7} 0 0 1 ${cx} ${cy + r * 0.7}" fill="none" stroke="#C9A25A" stroke-width="${r * 0.07}" stroke-linecap="round"/>`;
    s += `<text x="${cx}" y="${cy + r * 0.14}" fill="#fff" font-family="Arial,sans-serif" font-size="${r * 0.42}" font-weight="300" text-anchor="middle" letter-spacing="2">10:10</text>`;
  } else {
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2, big = i % 5 === 0, r1 = r * 0.86, r2 = r * (big ? 0.74 : 0.8);
      s += `<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * r2}" y2="${cy - Math.cos(a) * r2}" stroke="${hands}" stroke-width="${r * (big ? 0.035 : 0.012)}" opacity="${big ? 1 : 0.55}"/>`;
    }
    if (subdials) {
      [[-0.32, 0.05], [0.32, 0.05], [0, 0.42]].forEach(([dx, dy]) => {
        s += `<circle cx="${cx + dx * r}" cy="${cy + dy * r}" r="${r * 0.2}" fill="none" stroke="${hands}" stroke-width="${r * 0.012}" opacity=".7"/>`;
        s += `<line x1="${cx + dx * r}" y1="${cy + dy * r}" x2="${cx + dx * r + r * 0.1}" y2="${cy + dy * r - r * 0.1}" stroke="${accent}" stroke-width="${r * 0.015}"/>`;
      });
    }
    // hands at 10:10
    s += `<line x1="${cx}" y1="${cy}" x2="${cx - r * 0.38}" y2="${cy - r * 0.22}" stroke="${hands}" stroke-width="${r * 0.05}" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + r * 0.2}" y2="${cy - r * 0.62}" stroke="${hands}" stroke-width="${r * 0.035}" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="${cy + r * 0.12}" x2="${cx + r * 0.42}" y2="${cy + r * 0.3}" stroke="${accent}" stroke-width="${r * 0.012}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.045}" fill="${accent}"/>`;
  // crown
  s += `<rect x="${cx + r * 1.04}" y="${cy - r * 0.1}" width="${r * 0.14}" height="${r * 0.2}" rx="${r * 0.03}" fill="${rim}"/>`;
  // glass glint
  s += `<path d="M ${cx - r * 0.8} ${cy - r * 0.35} A ${r * 0.9} ${r * 0.9} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.85}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="${r * 0.05}" stroke-linecap="round"/>`;
  return s;
}

function svg(w, h, body, bg = ['#2c2a28', '#0f0f0f']) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="bg" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>${body}</svg>`;
}

const W = {
  'heritage-1962-chronograph': { face: '#e8dcc0', rim: '#b88a4a', strap: '#5a3a22', hands: '#2a2118', subdials: true },
  'aviator-mk-ii': { face: '#1f2a22', rim: '#8a8f94', strap: '#4a3524', subdials: false },
  'deco-dress-1938': { face: '#f2ead8', rim: '#c9a25a', strap: '#232020', hands: '#222' },
  'monarch-tourbillon': { face: '#10151f', rim: '#d9d2c0', strap: '#1a1a1a', subdials: true },
  'regent-perpetual': { face: '#2b2b33', rim: '#C9A25A', strap: '#2b1f18', subdials: true },
  'sovereign-skeleton': { face: '#0b0b0b', rim: '#9aa3ab', strap: '#1c1c1c', mode: 'skeleton' },
  'pulse-one': { face: '#050505', rim: '#2e2e2e', strap: '#161616', mode: 'smart', accent: '#7FA3B8' },
  'pulse-pro-titanium': { face: '#0a0f14', rim: '#8a8f94', strap: '#3a3f44', mode: 'smart', accent: '#7FA3B8' },
  'nova-lite': { face: '#0b0b0b', rim: '#c0b7a8', strap: '#d8c9b0', mode: 'smart', accent: '#C9A25A' },
  'abyss-diver-300': { face: '#0d2a3a', rim: '#1d1d1d', strap: '#101010', hands: '#f2f2f2', accent: '#7FA3B8' },
  'solar-trail': { face: '#39492f', rim: '#4a4a46', strap: '#6b5a3a', hands: '#efe9d2' },
  'velocity-racer': { face: '#1a1a1a', rim: '#8e2e2e', strap: '#222', subdials: true, accent: '#d6483c' }
};
Object.entries(W).forEach(([id, o]) => out(`watches/${id}.svg`, svg(800, 1000, watch({ cx: 400, cy: 500, r: 230, ...o }))));

// Collection cards (tall) in four moods
const C = {
  vintage: ['heritage-1962-chronograph', ['#4a3a2a', '#1a130d']],
  luxury: ['monarch-tourbillon', ['#33383f', '#0c0d10']],
  smart: ['pulse-pro-titanium', ['#2b3238', '#0b0d10']],
  sport: ['abyss-diver-300', ['#123344', '#050a0d']]
};
Object.entries(C).forEach(([k, [id, bg]]) => out(`collections/${k}.svg`, svg(800, 1000, watch({ cx: 400, cy: 520, r: 250, ...W[id] }), bg)));

// Gallery teaser: three crops
out('gallery/g1.svg', svg(800, 1000, watch({ cx: 520, cy: 560, r: 430, ...W['regent-perpetual'] }), ['#3a2f26', '#0e0b09']));
out('gallery/g2.svg', svg(800, 1000, watch({ cx: 300, cy: 440, r: 300, ...W['sovereign-skeleton'] }), ['#2a2f36', '#0a0b0d']));
out('gallery/g3.svg', svg(800, 1000, watch({ cx: 420, cy: 640, r: 360, ...W['abyss-diver-300'] }), ['#10303f', '#040709']));
out('gallery/g4.svg', svg(800, 1000, watch({ cx: 400, cy: 500, r: 330, ...W['monarch-tourbillon'] }), ['#1d2430', '#07090c']));
out('gallery/g5.svg', svg(800, 1000, watch({ cx: 380, cy: 560, r: 300, ...W['aviator-mk-ii'] }), ['#33281d', '#0c0907']));

// Workshop (gears)
function gear(cx, cy, r, teeth, col, sw) {
  let d = '';
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.88 : r;
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1);
  }
  return `<path d="${d}Z" fill="none" stroke="${col}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="none" stroke="${col}" stroke-width="${sw}" opacity=".7"/><circle cx="${cx}" cy="${cy}" r="${r * 0.12}" fill="${col}"/>`;
}
out('misc/workshop.svg', svg(800, 1000, gear(300, 380, 210, 22, '#C9A25A', 5) + gear(560, 640, 150, 16, '#b9b2a2', 4) + gear(250, 760, 90, 12, '#7FA3B8', 3), ['#322b24', '#0e0c0a']));

// Hero poster and window backdrop
out('misc/hero-poster.svg', svg(1920, 1080, watch({ cx: 1400, cy: 520, r: 430, face: '#3a2e24', rim: '#6a5238', strap: '#241a12', hands: '#d9b979', subdials: true }), ['#3b2c20', '#0a0806']));
let rings = '';
for (let i = 1; i < 10; i++) rings += `<circle cx="960" cy="1180" r="${i * 135}" fill="none" stroke="#C9A25A" stroke-opacity="${(0.34 - i * 0.03).toFixed(2)}" stroke-width="1.6"/>`;
let ticks = '';
for (let i = 0; i < 72; i++) { const a = Math.PI + (i / 72) * Math.PI, big = i % 6 === 0; ticks += `<line x1="${960 + Math.cos(a) * 1180}" y1="${1180 + Math.sin(a) * 1180}" x2="${960 + Math.cos(a) * (1180 - (big ? 60 : 28))}" y2="${1180 + Math.sin(a) * (1180 - (big ? 60 : 28))}" stroke="#C9A25A" stroke-opacity=".35" stroke-width="${big ? 3 : 1.5}"/>`; }
out('misc/backdrop.svg', svg(1920, 1080, `<ellipse cx="960" cy="1080" rx="1100" ry="520" fill="#C9A25A" opacity=".10" filter="url(#blur)"/>${rings}${ticks}`, ['#2a2016', '#060505']));

// Services: four editorial scenes. Lighter and warmer than the watch art so the Services row brings colour.
const paper = (w, h) => { let l = ''; for (let y = 120; y < h; y += 46) l += `<line x1="70" y1="${y}" x2="${w - 70}" y2="${y}" stroke="#1E1712" stroke-opacity=".10"/>`; return l; };
// Repair: warm walnut bench, brass gears, a screwdriver
out('services/repair.svg', svg(800, 1000,
  gear(300, 360, 230, 24, '#d9b979', 6) + gear(590, 640, 160, 18, '#C9A25A', 5) + gear(210, 760, 100, 12, '#e8e2d0', 4) +
  `<rect x="420" y="170" width="26" height="400" rx="6" fill="#e8e2d0" opacity=".85" transform="rotate(28 433 370)"/><rect x="396" y="520" width="74" height="190" rx="22" fill="#8e2e2e" opacity=".9" transform="rotate(28 433 615)"/>`,
  ['#7a5434', '#241709']));
// Appraisal: ivory paper, a loupe over a watch face
out('services/appraisal.svg', svg(800, 1000,
  paper(800, 1000) + watch({ cx: 400, cy: 470, r: 170, face: '#2b2b33', rim: '#C9A25A', strap: '#2b1f18', subdials: true }) +
  `<circle cx="470" cy="420" r="230" fill="#fff" fill-opacity=".10" stroke="#1E1712" stroke-width="22"/><line x1="636" y1="584" x2="760" y2="760" stroke="#1E1712" stroke-width="40" stroke-linecap="round"/>`,
  ['#f4eedf', '#b9ac90']));
// Servicing: steel-blue, balance wheel and hairspring
let spiral = ''; for (let i = 0; i < 260; i++) { const a = i * 0.16, rr = 14 + i * 0.95; spiral += (i ? 'L' : 'M') + (400 + Math.cos(a) * rr).toFixed(1) + ' ' + (470 + Math.sin(a) * rr).toFixed(1); }
out('services/servicing.svg', svg(800, 1000,
  `<circle cx="400" cy="470" r="290" fill="none" stroke="#e8e2d0" stroke-width="14" opacity=".9"/><circle cx="400" cy="470" r="250" fill="none" stroke="#C9A25A" stroke-width="3"/>` +
  `<path d="${spiral}" fill="none" stroke="#e8e2d0" stroke-width="3" opacity=".8"/><line x1="110" y1="470" x2="690" y2="470" stroke="#e8e2d0" stroke-width="10" opacity=".9"/><circle cx="400" cy="470" r="22" fill="#C9A25A"/>` +
  `<path d="M400 790c-34-48-52-78-52-104a52 52 0 01104 0c0 26-18 56-52 104z" fill="#C9A25A" opacity=".95"/>`,
  ['#86aabd', '#243642']));
// Retail: pale stone display, a plinth with a watch on it
out('services/retail.svg', svg(800, 1000,
  `<rect x="60" y="80" width="680" height="840" fill="none" stroke="#1E1712" stroke-opacity=".18" stroke-width="3"/><line x1="400" y1="80" x2="400" y2="920" stroke="#1E1712" stroke-opacity=".12" stroke-width="2"/>` +
  `<rect x="190" y="700" width="420" height="220" fill="#8b8576"/><rect x="190" y="700" width="420" height="22" fill="#b9b2a2"/>` +
  watch({ cx: 400, cy: 490, r: 150, face: '#f2ead8', rim: '#c9a25a', strap: '#232020', hands: '#222' }),
  ['#e2ddd2', '#9a9383']));

console.log('placeholders written');
