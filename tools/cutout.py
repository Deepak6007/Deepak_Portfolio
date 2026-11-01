"""Cut a product out of its background for the More studies cards.

Usage:
  python tools/cutout.py input.jpg img/studies/name.webp          # photo or render (uses rembg)
  python tools/cutout.py sketch.jpg img/studies/name.webp --lines  # pencil line art -> white lines

Needs: pip install pillow "rembg[cpu]"  (rembg downloads its model on first run)
"""
import sys
from PIL import Image
import numpy as np

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
if "--lines" in sys.argv:
    g = np.array(im.convert("L")).astype(float)
    alpha = np.clip((235 - g) * 2.2, 0, 255).astype("uint8")
    cut = Image.new("RGBA", im.size, (236, 236, 234, 0))
    cut.putalpha(Image.fromarray(alpha))
else:
    from rembg import remove, new_session
    cut = remove(im, session=new_session("isnet-general-use"), post_process_mask=True)
box = cut.getchannel("A").point(lambda v: 255 if v > 30 else 0).getbbox()
cut = cut.crop(box)
cut.thumbnail((900, 900), Image.LANCZOS)
cut.save(out, quality=86, method=6)
print("saved", out, cut.size)
