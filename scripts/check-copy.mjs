// check:copy. Runs over the dictionaries, content files and built HTML, never over CSS or scripts.
// Fails on em or en dashes, filler words, certification claims, percentages, user counts,
// currency amounts, and "Available" on any module chip other than appointments.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
const walk = (dir, filter) => {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, filter);
    else if (filter(p)) files.push(p);
  }
};
walk(path.join(root, 'src/i18n'), (p) => p.endsWith('.json'));
walk(path.join(root, 'src/content'), (p) => p.endsWith('.md') || p.endsWith('.json'));
walk(path.join(root, 'dist/client'), (p) => p.endsWith('.html'));

const rules = [
  { name: 'em dash', re: /—/g },
  { name: 'en dash', re: /–/g },
  { name: 'filler word', re: /\b(delve|leverage|seamless(ly)?|robust|elevate|unleash|next-gen|revolutioni[sz]e|cutting-edge|game-changing)\b/gi },
  { name: 'certification claim', re: /\b(HIPAA|SOC\s?2|ISO\s?27001)\b/g },
  { name: 'percentage', re: /\d+(\.\d+)?\s?%/g },
  { name: 'user count', re: /\b\d[\d,]*\+?\s+(users|doctors|patients|facilities|hospitals|centres|centers|clinics)\b/gi },
  { name: 'currency amount', re: /(৳|\bTk\.?|\bBDT\b|\bUSD\b|\$)\s?\d/g },
];

const stripHtml = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&');

let violations = 0;
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const isHtml = file.endsWith('.html');
  const text = isHtml ? stripHtml(raw) : raw;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      const m = line.match(rule.re);
      if (m) {
        violations++;
        console.log(`${path.relative(root, file)}:${i + 1}: ${rule.name}: ${m[0]} | ${line.trim().slice(0, 100)}`);
      }
    }
  });
  if (isHtml) {
    const platform = raw.match(/<section[^>]*id="platform"[\s\S]*?<\/section>/i);
    if (platform) {
      const count = (platform[0].match(/Available now/g) || []).length;
      if (count > 1) {
        violations++;
        console.log(`${path.relative(root, file)}: "Available now" appears ${count} times in the module grid; only the appointment chip may carry it`);
      }
    }
  }
}
console.log(`check:copy scanned ${files.length} files, ${violations} violation(s)`);
process.exit(violations ? 1 : 0);
