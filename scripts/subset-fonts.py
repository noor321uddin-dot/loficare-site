"""Builds the two small font files the site preloads.
- public/fonts/manrope-basic-v1.woff2: Manrope, basic Latin plus quotes and the ellipsis, for the headline (font-display: optional).
- public/fonts/anek-bangla-site-v1.woff2: Anek Bangla limited to the glyphs reachable from every Bangla string in the
  repository (dictionaries, legal content, components), with full layout closure so every conjunct those strings can
  form is present, plus all Bengali digits and punctuation.
Re-run after adding Bangla copy: python scripts/subset-fonts.py. Needs fonttools and brotli (pip)."""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
os.makedirs('public/fonts', exist_ok=True)
os.makedirs('data', exist_ok=True)

MANROPE = 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'
ANEK = 'node_modules/@fontsource-variable/anek-bangla/files/anek-bangla-bengali-wght-normal.woff2'


def run(args):
    r = subprocess.run([sys.executable, '-m', 'fontTools.subset', *args], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr)
        sys.exit(r.returncode)


# 1. Manrope basic Latin
run([MANROPE, '--unicodes=U+0020-007E,U+2018-201D,U+2026', '--flavor=woff2', '--output-file=public/fonts/manrope-basic-v1.woff2',
     '--layout-features=kern,liga,calt', '--no-hinting', '--desubroutinize'])

# 2. every Bangla string in the repository
bengali = re.compile(r'[ঀ-৿‌‍◌]+')
chunks = set()
for base, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.json', '.ts', '.astro', '.mjs')):
            text = open(os.path.join(base, f), encoding='utf-8').read()
            for m in bengali.finditer(text):
                chunks.add(m.group(0))
digits = ''.join(chr(c) for c in range(0x09E6, 0x09F0))
punct = '।॥৳◌'
sample = ' '.join(sorted(chunks)) + ' ' + digits + punct
open('data/bangla-text.txt', 'w', encoding='utf-8').write(sample)

# 3. two static instances (the site uses weights 400 and 700 only): the variable deltas are half the file
outputs = ['public/fonts/manrope-basic-v1.woff2']
for weight in (700, 400):
    ttf = f'data/anek-{weight}.ttf'
    out = f'public/fonts/anek-bangla-{weight}-v1.woff2'
    r = subprocess.run([sys.executable, '-m', 'fontTools.varLib.instancer', ANEK, f'wght={weight}', '-o', ttf, '-q'], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr)
        sys.exit(r.returncode)
    run([ttf, '--text-file=data/bangla-text.txt', '--unicodes=U+09E6-09EF,U+0964-0965,U+09F3,U+200C-200D,U+25CC,U+0020,U+002E,U+003A,U+003F,U+002C',
         '--layout-features=*', '--flavor=woff2', f'--output-file={out}', '--no-hinting', '--desubroutinize'])
    outputs.append(out)

for f in outputs:
    print(f, os.path.getsize(f), 'bytes')
print('bangla strings sampled:', len(chunks), 'chars:', len(set(sample)))
