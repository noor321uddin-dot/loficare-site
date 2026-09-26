// check:contrast. Reads the hex tokens from src/styles/tokens.css and verifies every
// text-on-background pair the site uses against WCAG AA (4.5:1 body, 3:1 large text and UI).
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const tokens = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)) tokens[m[1]] = m[2];
tokens['dark-fg'] = '#F2FBFA';
tokens['card'] = '#FFFFFF';

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground token, background token, minimum, what it is]
const pairs = [
  ['ink-950', 'paper', 4.5, 'body text on the page'],
  ['slate', 'paper', 4.5, 'secondary text on the page'],
  ['slate', 'wash-50', 4.5, 'secondary text on wash'],
  ['teal-700', 'paper', 4.5, 'links and accents on the page'],
  ['teal-700', 'wash-50', 4.5, 'links on wash'],
  ['teal-600', 'paper', 3, 'large text and UI strokes on the page'],
  ['ink-950', 'card', 4.5, 'text on cards'],
  ['slate', 'card', 4.5, 'secondary text on cards'],
  ['white', 'orbit-600', 4.5, 'primary button label'],
  ['white', 'orbit-700', 4.5, 'primary button label, hover'],
  ['orbit-600', 'paper', 4.5, 'secondary button label on paper'],
  ['green', 'paper', 4.5, 'Available now badge text'],
  ['green', 'card', 4.5, 'Available now badge on cards'],
  ['red', 'paper', 4.5, 'form error text'],
  ['dark-fg', 'ink-950', 4.5, 'dark mode body text'],
  ['mist-on-ink', 'ink-950', 4.5, 'dark mode secondary text'],
  ['mist-on-ink', 'ink-900', 4.5, 'dark mode secondary text on cards'],
  ['aqua-200', 'ink-950', 4.5, 'dark mode links'],
  ['aqua-400', 'ink-950', 3, 'dark mode large text and UI'],
  ['dark-fg', 'ink-900', 4.5, 'dark mode text on cards'],
];

let failures = 0;
console.log('pair'.padEnd(46) + 'ratio   min');
for (const [fg, bg, min, what] of pairs) {
  if (!tokens[fg] || !tokens[bg]) { console.log(`missing token: ${fg} or ${bg}`); failures++; continue; }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${(ok ? 'ok   ' : 'FAIL ') + what} (${fg} on ${bg})`.padEnd(46) + r.toFixed(2).padStart(5) + '   ' + min);
}
console.log(`check:contrast ${pairs.length} pairs, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
