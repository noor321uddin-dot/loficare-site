// leads:export. Writes every lead to a UTF-8 CSV (BOM included so Excel opens Bangla correctly).
// Usage: npm run leads:export [-- path/to/file.csv]
import { writeFileSync } from 'node:fs';
import { loadEnv } from '../src/lib/env.mjs';
import { getDb } from '../src/lib/db.mjs';

const env = loadEnv();
const db = getDb(env.DATABASE_PATH);
const rows = db.prepare('SELECT * FROM leads ORDER BY id').all();
const cols = ['id', 'created_at', 'form', 'audience', 'name', 'facility', 'facility_type', 'role', 'branches', 'phone', 'email', 'contact_raw', 'message', 'language', 'status', 'duplicate', 'spam', 'source_page'];
const esc = (v) => (v == null ? '' : `"${String(v).replace(/"/g, '""')}"`);
const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
const out = process.argv[2] || `data/leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
writeFileSync(out, '﻿' + csv, 'utf8');
console.log(`${rows.length} lead(s) written to ${out}`);
