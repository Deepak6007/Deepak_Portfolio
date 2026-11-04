// D7 monogram, rebuilt from Deepak's original mark with exact, shared geometry.
// Every stem leans at slope K (dx per dy), every corner cut runs at slope C,
// bars share thickness T, stems share width W, and the D/7 gaps are equal.
const K = 0.46;   // stem lean
const C = 1.37;   // corner-cut slope
const T = 97;     // bar thickness
const W = 108;    // stem width (horizontal)
const H = 513;    // overall height

const r = (n) => Math.round(n * 10) / 10;
const pts = (a) => 'M' + a.map(([x, y]) => `${r(x)} ${r(y)}`).join('L') + 'Z';

// gap = perpendicular gap between the D and the 7 (41 in the original artwork)
function mark({ gap = 41, dot = true } = {}) {
  const gx = gap * Math.sqrt(1 + K * K);           // the same gap measured horizontally on a leaning edge
  // D: open bracket with a cut top-left corner and a cut shoulder
  const B = 497, Cy = 148, Cx = B + C * Cy;         // outer shoulder
  const wallX = (y) => Cx - K * (y - Cy);           // outer right wall
  const inX = (y) => wallX(y) - W;                  // inner right wall
  const Ix = 462;                                   // inner top-right corner, at y = T
  const Hy = (Cx - W + K * Cy - Ix + C * T) / (C + K); // inner cut meets inner wall
  const Hx = Ix + C * (Hy - T);
  const yB = H - T;                                 // top of the bottom bar
  // 7: flag bar under the D's top bar, stem leaning to bottom-left
  const top7 = T + gap, bot7 = top7 + T;
  const Lx = 400;                                   // right end of the 7's bar
  const Mx = Lx - K * (H - top7);                   // stem bottom, right
  const Nx = Mx - W;                                // stem bottom, left
  const Ox = Nx + K * (H - bot7);                   // stem meets bar underside
  const Kx = 57, Px = Kx + C * T;                   // bar's cut left end
  const Ex = Mx + gx;                               // D's bottom bar starts one gap after the stem

  const D = [[0, 0], [B, 0], [Cx, Cy], [wallX(H), H], [Ex, H], [Ex + K * T, yB], [inX(yB), yB], [Hx, Hy], [Ix, T], [C * T, T]];
  const seven = [[Kx, top7], [Lx, top7], [Mx, H], [Nx, H], [Ox, bot7], [Px, bot7]];
  const out = { d: pts(D), seven: pts(seven), width: Cx, height: H };
  if (dot) {
    const x0 = wallX(H) + gx;                       // full stop, one gap after the D
    out.dot = pts([[x0, H], [x0 + T, H], [x0 + T + K * T, yB], [x0 + K * T, yB]]);
    out.width = x0 + T + K * T;
  }
  return out;
}
module.exports = { mark, T, H };
