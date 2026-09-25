// Quality round captures: full-page screenshots at 1440 and 390 for both home routes, the hero repro for the
// impeccable reviewer, and axe-core on every route. Needs a built site served at BASE (default 127.0.0.1:4399)
// and a Chrome binary (CHROME_PATH). Run: node scripts/capture.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4399';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = ['/', '/bn/', '/patients/how-it-works', '/privacy', '/terms', '/thank-you?form=demo', '/bn/patients/how-it-works', '/bn/privacy', '/bn/terms', '/bn/thank-you?form=trial'];

mkdirSync('docs/screens', { recursive: true });
mkdirSync('docs/reports/axe', { recursive: true });
mkdirSync('.impeccable/review', { recursive: true });

const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const axeVersion = JSON.parse(readFileSync('node_modules/axe-core/package.json', 'utf8')).version;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] });

const open = async (route, width, height) => {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
  return page;
};

// 1. axe on every route
const results = [];
for (const route of routes) {
  const page = await open(route, 1440, 900);
  await page.addScriptTag({ content: axeSource });
  const r = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));
  const violations = r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
  results.push({ route, seriousCount: violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').length, violations });
  await page.close();
}

// 2. screenshots
for (const [route, name] of [['/', 'home'], ['/bn/', 'home-bn']]) {
  for (const [w, h, label] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const page = await open(route, w, h);
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `docs/screens/${name}-${label}.png`, fullPage: true });
    if (route === '/' && w === 1440) await page.screenshot({ path: '.impeccable/review/hero-repro.png', fullPage: false });
    if (route === '/' && w === 390) await page.screenshot({ path: 'docs/screens/home-mobile-viewport.png', fullPage: false });
    await page.close();
  }
}
await browser.close();

writeFileSync('docs/reports/axe/axe.json', JSON.stringify(results, null, 2));
const lines = [
  '# axe-core results',
  '',
  `Run ${new Date().toISOString()} against ${BASE}, axe-core ${axeVersion}, 1440 px viewport, reduced motion.`,
  '',
  '| Route | Critical or serious | All violations |',
  '|---|---|---|',
  ...results.map((r) => `| ${r.route} | ${r.seriousCount} | ${r.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes})`).join(', ') || 'none'} |`),
];
writeFileSync('docs/reports/axe/README.md', lines.join('\n') + '\n');
console.log(lines.join('\n'));
console.log('screens: docs/screens/*.png, hero repro: .impeccable/review/hero-repro.png');
process.exit(results.some((r) => r.seriousCount) ? 1 : 0);
