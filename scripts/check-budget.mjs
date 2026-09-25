// check:budget. Measures the built home page against the performance budget in the build prompt (section 11).
// Run after `npm run build`.
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const root = 'dist/client';
if (!existsSync(`${root}/index.html`)) { console.error('dist/client/index.html missing: run npm run build first'); process.exit(1); }

const html = readFileSync(`${root}/index.html`, 'utf8');
const scripts = [...html.matchAll(/<script type="module" src="([^"]+)"/g)].map((m) => m[1]);
const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
const gz = (p) => gzipSync(readFileSync(path.join(root, p))).length;
const kb = (n) => (n / 1024).toFixed(1) + ' KB';

/* Follow static imports so shared chunks (GSAP, ScrollTrigger, the tracking adapter) count toward first load.
   Dynamic import() targets are not followed: they load on demand. */
const staticGraph = (entries) => {
  const seen = new Set();
  const visit = (p) => {
    if (seen.has(p)) return;
    seen.add(p);
    const src = readFileSync(path.join(root, p), 'utf8');
    const dir = path.posix.dirname(p);
    for (const m of src.matchAll(/(?:^|[;\s}])import\s*(?:[^'"()]*?from\s*)?["']([^"']+)["']/g)) {
      const ref = m[1];
      if (!ref.startsWith('.') && !ref.startsWith('/')) continue;
      visit(ref.startsWith('/') ? ref : path.posix.normalize(path.posix.join(dir, ref)));
    }
  };
  entries.forEach(visit);
  return [...seen];
};
const firstLoadFiles = staticGraph(scripts.filter((s) => !/three/i.test(s)));
const islandFiles = staticGraph(scripts.filter((s) => /three/i.test(s)));
const jsFirstLoad = firstLoadFiles.reduce((a, p) => a + gz(p), 0);
const jsIsland = islandFiles.reduce((a, p) => a + gz(p), 0);
const css = styles.reduce((a, p) => a + gz(p), 0);
const htmlGz = gzipSync(html).length;

const fontFiles = new Set();
for (const s of styles) for (const m of readFileSync(path.join(root, s), 'utf8').matchAll(/url\(([^)]+\.woff2?)\)/g)) fontFiles.add(m[1].replace(/['"]/g, ''));
const families = new Set([...fontFiles].map((f) => path.basename(f).split('-')[0]));

const rows = [
  ['first-load JavaScript, gzipped', jsFirstLoad, 90 * 1024],
  ['Three.js island, gzipped', jsIsland, 160 * 1024],
  ['CSS, gzipped', css, 45 * 1024],
  ['HTML, gzipped', htmlGz, 60 * 1024],
  ['font families referenced by the home CSS', families.size, 2],
];
let failures = 0;
console.log('metric'.padEnd(46) + 'value'.padStart(12) + 'budget'.padStart(12));
for (const [name, value, budget] of rows) {
  const ok = value <= budget;
  if (!ok) failures++;
  const isBytes = typeof value === 'number' && name.includes('gzipped');
  console.log(`${ok ? 'ok   ' : 'FAIL '}${name}`.padEnd(46) + String(isBytes ? kb(value) : value).padStart(12) + String(isBytes ? kb(budget) : budget).padStart(12));
}
console.log(`scripts: ${scripts.join(', ') || 'none'}`);
console.log(`font families: ${[...families].join(', ')}`);
console.log(`check:budget ${failures ? failures + ' failure(s)' : 'ok'}`);
process.exit(failures ? 1 : 0);
