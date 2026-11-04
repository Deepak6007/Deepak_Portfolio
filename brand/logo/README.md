# D7 logo: files and how to use them

The D7 monogram is Deepak's own mark (the 7 sits inside the D), redrawn with exact geometry:

- Every leaning stroke shares one angle.
- Every corner cut shares another angle.
- Both bars are the same thickness.
- The gaps between the D and the 7 are equal.

The orange block works as a full stop. It's the only accent, and it uses the website's signal orange.

## Files

| File | Use it for |
|---|---|
| `d7-monogram-dark.svg` | Main mark on dark backgrounds (studio grey + orange) |
| `d7-monogram-light.svg` | On white or light backgrounds (graphite + orange) |
| `d7-monogram-white.svg`, `d7-monogram-black.svg` | One colour: stamps, embossing, single-colour print |
| `d7-lockup-horizontal-*.svg` | Mark + name on one line: email signatures, title slides, video end cards |
| `d7-lockup-stacked-*.svg` | Mark + name on two lines: square layouts, posters, business cards |
| `d7-app-icon.svg` | The mark on a graphite tile |
| `d7-avatar-1080.png` | Profile picture for Instagram, Behance and LinkedIn |
| `watermark-monogram-white.png` / `-black.png` | Watermark, mark only, full strength (set the opacity in your editor) |
| `watermark-lockup-white.png` / `-black.png` | Watermark, mark + name, full strength |
| `*-35.png` | The same watermarks already at 35% opacity, ready to drop on (handy in phone apps without an opacity slider) |
| `*-preview.png` | Quick-look images of the masters |
| `source/` | The script that draws everything. Change `mark.js` and run `node build.js <project folder>` to regenerate. It needs the `sharp` and `opentype.js` npm packages. |

The name in the lock-ups is Barlow SemiBold converted to outlines, so the files look the same on any computer without the font installed.

On the website: `img/favicon.svg`, `img/favicon-32.png`, `img/apple-touch-icon.png` and `img/icon-512.png`. The small icons use slightly wider gaps so the D and 7 stay apart at 16 px.

## Colours

| Name | Hex |
|---|---|
| Graphite (background) | `#1A1A1A` |
| Studio grey (mark on dark) | `#ECECEA` |
| Signal orange (full stop only) | `#E2501D` |

## Rules

- **Clear space:** keep empty space around the mark at least as wide as the D's bar thickness. The SVGs already include it.
- **Minimum size:** the monogram is 16 px tall on screen, and the lock-up 24 px tall.
- **Orange:** only ever on the full stop, never on the D or the 7. In one-colour versions, the full stop takes the same colour as the mark.
- **Don'ts:** don't stretch, rotate, outline, add shadows or glows, recolour the letters, or put the mark back next to the panther.

## Watermarking renders and photos

1. Use the white watermark on dark images and the black one on light images.
2. Set it to 30–40% opacity. The `-35` files are already at 35%.
3. Place it over part of the subject (for example across the lower body of a car), not in an empty corner, where it's easy to crop out.
4. Size it at about 30–50% of the image width for the lock-up, or 12–20% for the mark alone.
5. Post images a little smaller than your originals, and keep the full-size files and project files as proof that the work is yours.

A watermark discourages reposting and shows who made the image. It doesn't register a trademark: that's done separately through IP India.
