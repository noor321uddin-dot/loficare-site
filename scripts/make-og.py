"""Build the Open Graph share image and the favicon set from the brand files.
Run from the project root: python scripts/make-og.py
Output: public/og/loficare-og.png (1200x630), public/brand/favicon-32.png, public/brand/apple-touch-icon.png (180x180)."""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
os.makedirs('public/og', exist_ok=True)

INK = (4, 26, 26)
AQUA_200 = (167, 252, 246)
MIST_ON_INK = (156, 183, 181)
W, H = 1200, 630


def load_font(size, weight=700):
    """Manrope from the fontsource package, converted from woff2 with fontTools; Segoe UI Bold as the fallback."""
    try:
        from fontTools.ttLib import TTFont
        src = 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'
        out = 'data/manrope-variable.ttf'
        if not os.path.exists(out):
            os.makedirs('data', exist_ok=True)
            f = TTFont(src)
            f.flavor = None
            f.save(out)
        font = ImageFont.truetype(out, size)
        try:
            font.set_variation_by_axes([weight])
        except Exception:
            pass
        return font, 'Manrope'
    except Exception as e:  # noqa: BLE001
        return ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', size), f'Segoe UI Bold (fallback: {e.__class__.__name__})'


# 1. canvas
img = Image.new('RGB', (W, H), INK)

# 2. the mark, from the transparent PNG, tight-cropped to its box (528..1472 in the 2000 px file)
mark = Image.open('brand/loficare-mark.png').convert('RGBA').crop((520, 520, 1480, 1480))
mark = mark.resize((400, 400), Image.LANCZOS)
img.paste(mark, (70, (H - 400) // 2), mark)

# 3. the wordmark, keyed out of the lockup: find the bright pixels below the mark
lock = Image.open('brand/loficare-lockup-dark.png').convert('RGB')
arr = np.array(lock).astype(float)
lum = arr.max(axis=2)
ys, xs = np.where((lum > 90) & (np.arange(lock.height)[:, None] > 1500))
x0, x1, y0, y1 = xs.min() - 8, xs.max() + 8, ys.min() - 8, ys.max() + 8
wm = arr[y0:y1, x0:x1]
alpha = np.clip((wm.max(axis=2) - 48) / 40, 0, 1) * 255  # keys out the dark ground and its faint decorative lines
wmi = Image.fromarray(np.dstack([wm, alpha]).astype('uint8'), 'RGBA')
scale = 430 / wmi.width
wmi = wmi.resize((430, int(wmi.height * scale)), Image.LANCZOS)
tx = 520
img.paste(wmi, (tx, 150), wmi)

# 4. the one-line description and the live-module line
draw = ImageDraw.Draw(img)
font_h, name_h = load_font(40, 700)
font_s, name_s = load_font(26, 500)
draw.multiline_text((tx, 150 + wmi.height + 30), 'The hospital and diagnostic\ncentre platform,\nbuilt for Bangladesh.', fill=AQUA_200, font=font_h, spacing=8)
draw.text((tx, 150 + wmi.height + 30 + 168), 'Online appointments live today, free to start.', fill=MIST_ON_INK, font=font_s)

img.save('public/og/loficare-og.png', optimize=True)
print('og image written', img.size, 'headline font:', name_h, 'wordmark crop:', (x0, y0, x1, y1))

# 5. favicons
m = Image.open('brand/loficare-mark.png').convert('RGBA').crop((500, 500, 1500, 1500))
m.resize((32, 32), Image.LANCZOS).save('public/brand/favicon-32.png')
m.resize((192, 192), Image.LANCZOS).save('public/brand/icon-192.png')
touch = Image.new('RGBA', (180, 180), INK + (255,))
mm = m.resize((140, 140), Image.LANCZOS)
touch.paste(mm, (20, 20), mm)
touch.convert('RGB').save('public/brand/apple-touch-icon.png')
print('favicons written')
