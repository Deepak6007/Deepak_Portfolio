# Deepak Bojjagani portfolio site

Static portfolio for freelance clients and recruiters. Hosted on GitHub Pages at
https://deepak6007.github.io/Deepak_Portfolio/ (repo: Deepak6007/Deepak_Portfolio).
This folder replaces the older single-file site in `../Deepak_Portfolio_Static` and the Next.js build in `../Deepak-Portfolio-V2`.

## Claude Code setup
- Agents in `.claude/agents/`: content-editor, design-reviewer, asset-optimizer, photography-page-builder, deploy-helper. Use them for matching tasks.
- `/preview` starts the local server. Asset scripts are in `tools/` (see `tools/README-tools.md`).

## Run locally
No build step. ES modules need a server: `python -m http.server 8000`, then open http://localhost:8000.

## Structure
- `index.html`: every section (hero, work, services, about, contact) plus the case-study `<dialog>`s and the lightbox
- `css/style.css`: design tokens at the top; one file, no framework
- `js/main.js`: phone menu, project reveal, dialogs, lightbox, 4-step brief builder. `WHATSAPP`, `EMAIL`, `SHEET_ENDPOINT` are set at the top
- `js/viewer.js`: three.js viewers. The hero bike loads immediately; `.mini-canvas` viewers load lazily. Viewers behind an open dialog pause
- `vendor/three/`: three.js 0.160.0 bundled locally (importmap in `index.html`)
- `models/`: web-optimised GLB files (meshopt-compressed, textures stripped, painted in code)
- `apps-script/Code.gs`: optional Google Sheet inbox for briefs

## Design rules (keep consistent)
- Font: Barlow 400/500/600 (self-hosted in `fonts/`, latin + latin-ext), a grotesk drawn from California highway signage. Headlines weight 600; body 400. Avoid AI-default faces (Inter, Instrument Sans, IBM Plex, DM Sans, Space Grotesk, Outfit, Plus Jakarta Sans).
- Colours: graphite #1A1A1A (matches render backgrounds), studio grey #ECECEA, muted #A6A6A2, hairline #3A3A3A. Signal orange #E2501D is used only for status (availability dot, active step).
- Project tints: bike #C8312A, Dodge #9C6E43, wheel/Alias #4F6FB0, joystick #2E7F8C.
- Surfaces: `.glass` is now an opaque card (`--surface` plus a 1px `--line` border). No backdrop blur, pointer glow, drifting blobs, coloured halos, pulsing dots or pill wrappers on static text. Buttons and chips use 8px corners. The nav is a full-width bar with a bottom rule.
- Motion: one hero load sequence, a shutter reveal on project media, user-driven 3D. The polaroid tilt on photography.html is intentional. Respect `prefers-reduced-motion`. Don't add fade-ups to every section.
- Copy: sentence case, plain verbs, no all-caps eyebrows, no "→" in buttons, British spelling (modelling, visualisation).

## Content facts
- Name: Deepak Bojjagani (professional). Main specialisation: Autodesk Alias / Class-A surfacing. The portfolio is automotive-focused. Don't claim CMF or Figma/UI work.
- Experience: Maruti Suzuki (design intern, alloy & steel wheels, May–Sep 2025, Gurugram), Heed Jetboards (industrial designer, Mar 2025, Mysuru), AS Dream Studio (photography intern, Jun–Jul 2024, Bengaluru). B.A.&D. Industrial & Product Design, MSRUAS, 2021–2025.
- Links: WhatsApp +91 99662 73444, email deepak7designer@gmail.com (client work), linkedin.com/in/deepakbojjagani, instagram.com/deepak_07_official, behance.net/deepak6007.
- Projects: 01 Hero Sports Bike, 02 Dodge Challenger, 03 Alloy wheel concept (from a Pinterest reference, Class-A surfaced in Alias; shown as the 3D model on the home page), 04 Jetboard joystick (3D model). The Alias form studies and product models are in More studies, not a project.
- More studies cards: tool icons (simple-icons SVG sprite at the top of `index.html`) plus background-removed model cut-outs in `img/studies/`. Clicking a card opens the full board.
- Photography: removed from the home page. It becomes a separate `photography.html` walkthrough following Deepak's Behance Photography Portfolio (behance.net/gallery/240645241): cover, about, gear (Canon EOS 90D, 18–135 mm, 50 mm), contents, then chapters for Portrait, Monochrome, Nature, Street, Jewellery, Food, Lifestyle products, Products, Ceramic products and Photography, with polaroid-style frames on charcoal. Use ONLY the photos from that Behance portfolio (originals from Deepak). Never use other laptop photos. The Canon card (`E:\Camera photos`) holds a private family event: never use it.
- Excluded as unfinished: BMW M3 (ongoing), VYTRON E1, Aston Martin Valen, HomeEvo, Life Vest, SpyderBot. The BMW night-city animation is excluded because it uses downloaded car models.
- Source assets live on E: under `work\`, `internship works\`, and `portfolio\deepak\New portfolio\` (2026 PDF and PSDs).

## Open items
- `photography.html` is built from photos cropped out of the Behance slides (`img/photography/<chapter>/`, about 300–600 px wide). Swap in Deepak's original camera files when he sends them.
- The Behance thank-you slide lists Instagram @deepak.07.jpg and +91 93800 86551; the site uses @deepak_07_official and +91 99662 73444. Confirm which the photography page should use.
- Vercel: `vercel.json` (clean URLs, security and cache headers, no build step), `.vercelignore`, `404.html`, `robots.txt`. Waiting on the domain: then update og:url/og:image, add a canonical link and `sitemap.xml`.
- Before every push run `node tools/version-assets.mjs`: it tags CSS/JS links with a content hash (?v=) so browsers fetch changed files at once.
- Deploy: the live repo's `main` publishes through `.github/workflows/static.yml`. This folder isn't a git repo; copy it into a clone of the repo (skip `.claude/launch.json`) and push.
- `files/Deepak-B-Resume.pdf` still shows the old LinkedIn URL (deepak6007). Replace it with an updated résumé.
- Optional: deploy `apps-script/Code.gs` and set `SHEET_ENDPOINT`.
