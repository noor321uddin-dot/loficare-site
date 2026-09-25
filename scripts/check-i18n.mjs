// check:i18n. Lists dictionary keys present in English and missing in Bangla, fails when a key
// from the mandatory bilingual set is missing, and fails on dashes in either dictionary.
import { readFileSync } from 'node:fs';

const en = JSON.parse(readFileSync(new URL('../src/i18n/en.json', import.meta.url), 'utf8'));
const bn = JSON.parse(readFileSync(new URL('../src/i18n/bn.json', import.meta.url), 'utf8'));

// Brief §12: patient section and booking flow, primary CTAs, header, footer, sticky bar, form labels, trust and compliance lines.
const mandatoryPrefixes = ['meta.', 'nav.', 'lang.', 'theme.', 'hero.cta', 'doors.', 'trust.', 'sticky.', 'footer.', 'patients.', 'demo.', 'form.', 'data.'];

const missing = Object.keys(en).filter((k) => !(k in bn));
const mandatoryMissing = missing.filter((k) => mandatoryPrefixes.some((p) => k.startsWith(p)));
const extra = Object.keys(bn).filter((k) => !(k in en));
const dashes = [];
for (const [name, dict] of [['en', en], ['bn', bn]]) {
  for (const [k, v] of Object.entries(dict)) if (/[–—]/.test(v)) dashes.push(`${name}:${k}`);
}

console.log(`keys: en ${Object.keys(en).length}, bn ${Object.keys(bn).length}`);
if (missing.length) console.log(`bangla falls back to english for ${missing.length} key(s): ${missing.join(', ')}`);
if (mandatoryMissing.length) console.log(`MANDATORY keys missing in bangla: ${mandatoryMissing.join(', ')}`);
if (extra.length) console.log(`keys only in bangla (unused?): ${extra.join(', ')}`);
if (dashes.length) console.log(`dashes in dictionaries: ${dashes.join(', ')}`);

const failures = mandatoryMissing.length + extra.length + dashes.length;
console.log(`check:i18n ${failures ? failures + ' failure(s)' : 'ok'}`);
process.exit(failures ? 1 : 0);
