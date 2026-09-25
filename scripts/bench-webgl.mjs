// The D3 benchmark for the WebGL hero tier: 1024 px wide, CPU throttled 4x, frame rate sampled while the
// assembly plays and then idles. Ships only if it holds 50 fps. Needs a served build (BASE) and Chrome.
// Usage: BASE=http://127.0.0.1:4399 node scripts/bench-webgl.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4399';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync('docs/screens', { recursive: true });
mkdirSync('docs/reports', { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=default', '--enable-unsafe-webgpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1 });
const cdp = await page.createCDPSession();
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 });

const tier = await page.waitForFunction(() => document.querySelector('.stage')?.getAttribute('data-tier') || null, { timeout: 20000 }).then((h) => h.jsonValue()).catch(() => 'undecided');
const renderer = await page.evaluate(() => {
  const c = document.querySelector('.webgl canvas');
  const gl = c && (c.getContext('webgl2') || c.getContext('webgl'));
  const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
  return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'no canvas';
});

const samples = [];
for (let i = 0; i < 10; i++) {
  await new Promise((r) => setTimeout(r, 500));
  samples.push(await page.evaluate(() => (window.__lcHero ? Math.round(window.__lcHero.getFps()) : 0)));
}
const during = samples.slice(0, 4);
const idle = samples.slice(4);
const avg = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
const progress = await page.evaluate(() => (window.__lc && window.__lc.tl ? window.__lc.tl.progress() : 'n/a'));
await page.screenshot({ path: 'docs/screens/hero-webgl-1024.png', clip: { x: 0, y: 0, width: 1024, height: 768 } });

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: 'docs/screens/hero-webgl-1440.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
await browser.close();

const pass = tier === 'webgl' && avg(during) >= 50 && avg(idle) >= 50;
const md = [
  '# WebGL hero tier benchmark (decision D3)',
  '',
  `Run ${new Date().toISOString()} against ${BASE}. Headless Chrome, 1024 by 768, CPU throttled 4x. Renderer: ${renderer}.`,
  '',
  `- Tier chosen at runtime: ${tier}`,
  `- Frame rate while the assembly plays (first 2 s of sampling): ${during.join(', ')} fps, average ${avg(during)}`,
  `- Frame rate at idle (next 3 s): ${idle.join(', ')} fps, average ${avg(idle)}`,
  `- Assembly timeline progress at the end of sampling: ${progress}`,
  `- Pass threshold: 50 fps in both windows with the WebGL tier active. Result: ${pass ? 'PASS' : 'FAIL'}`,
  '',
  'Captures: docs/screens/hero-webgl-1024.png and hero-webgl-1440.png.',
  'The runtime keeps its own guard: the island bows out on any device that renders under 42 fps in its first half second, and never loads under 768 px, under reduced motion, with less than 4 GB of device memory, or without WebGL2.',
];
writeFileSync('docs/reports/webgl-bench.md', md.join('\n') + '\n');
console.log(md.join('\n'));
process.exit(pass ? 0 : 1);
