// Runs Lighthouse (mobile form factor, simulated slow 4G and 4x CPU) on the English and Bangla home pages
// against a served build and writes the reports plus a summary. Usage: BASE=http://127.0.0.1:4399 npm run lighthouse
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4399';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pages = [['/', 'home'], ['/bn/', 'home-bn']];
mkdirSync('docs/reports/lighthouse', { recursive: true });

const rows = [];
let worstPerf = 100;
for (const [p, name] of pages) {
  const out = `docs/reports/lighthouse/${name}`;
  const r = spawnSync('npx', ['lighthouse', BASE + p, '--chrome-flags=--headless=new --no-sandbox --disable-gpu', '--form-factor=mobile', '--throttling-method=simulate', '--only-categories=performance,accessibility,best-practices,seo', '--output=json', '--output=html', `--output-path=${out}`, '--quiet'], { env: { ...process.env, CHROME_PATH: CHROME }, shell: true, encoding: 'utf8' });
  if (r.status !== 0 && !readFileSync(`${out}.report.json`, 'utf8')) { console.error(r.stderr); process.exit(1); }
  const rep = JSON.parse(readFileSync(`${out}.report.json`, 'utf8'));
  const c = rep.categories;
  const a = rep.audits;
  const s = (k) => Math.round(c[k].score * 100);
  worstPerf = Math.min(worstPerf, s('performance'));
  rows.push(`| ${p} | ${s('performance')} | ${s('accessibility')} | ${s('best-practices')} | ${s('seo')} | ${a['first-contentful-paint'].displayValue} | ${a['largest-contentful-paint'].displayValue} | ${a['total-blocking-time'].displayValue} | ${a['cumulative-layout-shift'].displayValue} |`);
}
const md = [
  '# Lighthouse, mobile simulation',
  '',
  `Run ${new Date().toISOString()} against ${BASE}. Mobile form factor, simulated slow 4G and 4x CPU slowdown (Lighthouse defaults). Full reports beside this file.`,
  '',
  '| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |',
  '|---|---|---|---|---|---|---|---|---|',
  ...rows,
  '',
  `Budget (build prompt section 11): performance 90 or better, LCP under 2.5 s, INP under 200 ms, CLS under 0.1. Worst performance score this run: ${worstPerf}.`,
];
writeFileSync('docs/reports/lighthouse/README.md', md.join('\n') + '\n');
console.log(md.join('\n'));
process.exit(worstPerf >= 90 ? 0 : 1);
