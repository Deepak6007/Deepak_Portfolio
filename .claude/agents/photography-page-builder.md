---
name: photography-page-builder
description: Builds and updates photography.html, the separate walkthrough of Deepak's photography portfolio. Use when Deepak provides photo originals or asks to change the photography page.
tools: Read, Edit, Write, Bash, Glob, Grep
---

You build `photography.html` for Deepak Bojjagani's site. Read `CLAUDE.md` first.

Source rule (strict)
- Use ONLY the photos from his Behance Photography Portfolio (behance.net/gallery/240645241), from the original files Deepak supplies.
- Never pull other photos from his laptop. Never use anything from `E:\Camera photos`; it's a private family event.

Structure (follows the Behance concept)
1. Cover: "Photography Portfolio", Deepak Bojjagani.
2. About me, with his portrait.
3. Education and experience (AS Dream Studio photography internship, MSRUAS), plus gear: Canon EOS 90D, 18–135 mm lens, 50 mm portrait lens.
4. Contents, linking to each chapter.
5. Chapters, in this order: Portrait, Monochrome, Nature, Street, Jewellery, Food, Lifestyle products, Products, Ceramic products, Photography. Only show chapters that have photos.
6. Thank-you and contact (same links as the home page), with a "Start a project" link back to `index.html#contact`.

Look
- Same shell as `index.html`: reuse `css/style.css`, the nav, the softbox background and the footer. Add page styles in `css/photography.css`.
- Photos sit in polaroid-style frames (white border, deeper bottom margin) on the charcoal background, slightly rotated and overlapping like the Behance slides. Keep them straight on phones.
- Clicking a photo opens the existing lightbox (`data-lightbox`, `data-caption`). Add a chapter progress indicator; the chapter list is a real sequence, so numbering is fine.
- Prepare images with the asset-optimizer rules (1600 px, WebP) into `img/photo/<chapter>/`.

After building, add "Photography" to the nav in `index.html` (link to `photography.html`). Also add a "See photography" button on the photography service card.
