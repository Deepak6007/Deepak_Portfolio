# Asset tools

Run `npm install` once in the project folder for the 3D tools. Run `pip install pillow "rembg[cpu]"` for the cut-out tool.

| Task | Command |
|---|---|
| Compress a GLB (keep 20% of triangles) | `node tools/slim-model.mjs big.glb models/name.glb 0.2` |
| Inspect a GLB | `node tools/inspect-model.mjs models/name.glb` |
| Cut out a render or photo | `python tools/cutout.py render.jpg img/studies/name.webp` |
| Turn a pencil sketch into white line art | `python tools/cutout.py sketch.jpg img/studies/name.webp --lines` |

`slim-model.mjs` replaces the model's materials with one plain material and strips textures, because the site paints models in `js/viewer.js` (`data-color`, `data-metal`, `data-rough` on the canvas).
