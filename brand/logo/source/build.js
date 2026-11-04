// Builds the D7 logo set: SVG masters, favicon set, avatar and watermark PNGs.
// Usage: node build.js <project root>
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const opentype = require('opentype.js');
const { mark, H } = require('./mark');

const root = process.argv[2];
const out = path.join(root, 'brand', 'logo');
fs.mkdirSync(out, { recursive: true });

const INK = '#ECECEA', GRAPHITE = '#1A1A1A', SIGNAL = '#E2501D', BLACK = '#000000', WHITE = '#FFFFFF';
const semibold = opentype.parse(fs.readFileSync(path.join(__dirname, 'barlow-600.ttf')).buffer);
const capRatio = semibold.tables.os2.sCapHeight / semibold.unitsPerEm;
const descRatio = 0.2; // room under the baseline for j and g

const r1 = (n) => Math.round(n * 10) / 10;

// Name as outlined paths, so the files look identical without Barlow installed.
function word(text, x, baseline, capHeight) {
  const size = capHeight / capRatio;
  const p = semibold.getPath(text, x, baseline, size, { kerning: true });
  return { d: p.toPathData(1), width: semibold.getAdvanceWidth(text, size, { kerning: true }), size };
}

function markPaths(m, ink, accent, dx = 0, dy = 0, scale = 1) {
  const g = `<g transform="translate(${r1(dx)} ${r1(dy)}) scale(${scale})">`;
  return g + `<path d="${m.d}" fill="${ink}"/><path d="${m.seven}" fill="${ink}"/>` +
    (m.dot ? `<path d="${m.dot}" fill="${accent}"/>` : '') + '</g>';
}

function svgDoc(w, h, body, bg, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r1(w)} ${r1(h)}" width="${r1(w)}" height="${r1(h)}" role="img" aria-label="${title}">` +
    `<title>${title}</title>` + (bg ? `<rect width="${r1(w)}" height="${r1(h)}" fill="${bg}"/>` : '') + body + '</svg>\n';
}

// Clear space around every artwork = one bar thickness of the mark (97 units).
const PAD = 97;
const m = mark();
const themes = {
  dark: { ink: INK, accent: SIGNAL },        // on graphite / dark photos
  light: { ink: GRAPHITE, accent: SIGNAL },  // on white / studio grey
  white: { ink: WHITE, accent: WHITE },      // one colour, reversed
  black: { ink: BLACK, accent: BLACK },      // one colour
};

const files = {};
const save = (name, svg) => { fs.writeFileSync(path.join(out, name), svg); files[name] = svg; };

// 1. Monogram
for (const [t, c] of Object.entries(themes)) {
  const w = m.width + PAD * 2, h = H + PAD * 2;
  save(`d7-monogram-${t}.svg`, svgDoc(w, h, markPaths(m, c.ink, c.accent, PAD, PAD), null, 'Deepak Bojjagani D7 monogram'));
}

// 2. Horizontal lock-up: monogram + name on one line, cap height 42% of the mark
{
  const cap = H * 0.42, gap = H * 0.3;
  const x = PAD + m.width + gap, baseline = PAD + H / 2 + cap / 2;
  for (const [t, c] of Object.entries(themes)) {
    const n = word('Deepak Bojjagani', x, baseline, cap);
    const w = x + n.width + PAD, h = H + PAD * 2;
    save(`d7-lockup-horizontal-${t}.svg`, svgDoc(w, h,
      markPaths(m, c.ink, c.accent, PAD, PAD) + `<path d="${n.d}" fill="${c.ink}"/>`, null, 'Deepak Bojjagani'));
  }
}

// 3. Stacked lock-up: two lines whose cap top and last baseline match the mark's top and bottom
{
  const size = H / (capRatio + 1.12);          // cap + one line of leading = mark height
  const cap = size * capRatio, lead = size * 1.12;
  const gap = H * 0.3, x = PAD + m.width + gap;
  for (const [t, c] of Object.entries(themes)) {
    const a = word('Deepak', x, PAD + cap, cap), b = word('Bojjagani', x, PAD + cap + lead, cap);
    const w = x + Math.max(a.width, b.width) + PAD, h = PAD + H + size * descRatio + PAD;
    save(`d7-lockup-stacked-${t}.svg`, svgDoc(w, h,
      markPaths(m, c.ink, c.accent, PAD, PAD) + `<path d="${a.d}" fill="${c.ink}"/><path d="${b.d}" fill="${c.ink}"/>`, null, 'Deepak Bojjagani'));
  }
}

// 4. App-icon tile: graphite square, wider gaps so the D and 7 stay apart at 16 px
function tile(size, { rounded = true, markShare = 0.7, gap = 62 } = {}) {
  const mm = mark({ gap });
  const s = (size * markShare) / mm.width;
  const dx = (size - mm.width * s) / 2, dy = (size - H * s) / 2;
  const rx = rounded ? size * 0.2 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${r1(rx)}" fill="${GRAPHITE}"/>` + markPaths(mm, INK, SIGNAL, dx, dy, +s.toFixed(5)) + '</svg>\n';
}

(async () => {
  const png = (svg, file, width) => sharp(Buffer.from(svg), { density: 300 }).resize({ width }).png().toFile(file);

  // Site favicon set
  const img = path.join(root, 'img');
  // Tab-size icons get a bigger mark and wider gaps so the 7 stays separate from the D at 16 px
  const small = tile(64, { markShare: 0.84, gap: 95 });
  fs.writeFileSync(path.join(img, 'favicon.svg'), small);
  await png(small, path.join(img, 'favicon-32.png'), 32);
  await png(tile(180, { rounded: false }), path.join(img, 'apple-touch-icon.png'), 180);
  await png(tile(512), path.join(img, 'icon-512.png'), 512);
  save('d7-app-icon.svg', tile(512));

  // Profile picture for Instagram and Behance (square; their circle crop keeps the mark inside)
  await png(tile(1080, { rounded: false, markShare: 0.56, gap: 41 }), path.join(out, 'd7-avatar-1080.png'), 1080);

  // Watermarks: transparent PNGs, full strength and ready-made 35% strength
  for (const t of ['white', 'black']) {
    await png(files[`d7-monogram-${t}.svg`], path.join(out, `watermark-monogram-${t}.png`), 800);
    await png(files[`d7-lockup-horizontal-${t}.svg`], path.join(out, `watermark-lockup-${t}.png`), 1600);
  }
  for (const f of ['watermark-monogram-white', 'watermark-lockup-white', 'watermark-monogram-black', 'watermark-lockup-black']) {
    const src = path.join(out, f + '.png');
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * 0.35);
    await sharp(data, { raw: info }).png().toFile(path.join(out, f + '-35.png'));
  }

  // Preview PNGs of the masters for quick viewing
  for (const name of ['d7-monogram-dark', 'd7-lockup-horizontal-dark', 'd7-lockup-stacked-dark']) {
    const svg = files[name + '.svg'].replace('aria-label', `style="background:${GRAPHITE}" aria-label`);
    const w = +svg.match(/width="([\d.]+)"/)[1];
    await sharp(Buffer.from(svg), { density: 300 }).resize({ width: Math.round(w) }).flatten({ background: GRAPHITE }).png().toFile(path.join(out, name + '-preview.png'));
  }
  console.log('built', Object.keys(files).length, 'svg masters');
})();
