// Writes .br and .gz siblings for every text asset in dist/client so the server can send them without
// compressing at request time. Runs as part of `npm run build`.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import path from 'node:path';

const root = 'dist/client';
const exts = new Set(['.html', '.css', '.js', '.mjs', '.svg', '.xml', '.txt', '.json', '.webmanifest']);
let count = 0;
let before = 0;
let after = 0;
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!exts.has(path.extname(f))) continue;
    const buf = readFileSync(p);
    if (buf.length < 1024) continue;
    const br = brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: buf.length } });
    const gz = gzipSync(buf, { level: 9 });
    writeFileSync(p + '.br', br);
    writeFileSync(p + '.gz', gz);
    count++; before += buf.length; after += br.length;
  }
};
walk(root);
console.log(`precompressed ${count} files: ${(before / 1024).toFixed(0)} KB raw, ${(after / 1024).toFixed(0)} KB brotli`);
