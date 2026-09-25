// Production entry: validate configuration, then serve the built site from one Node process.
// Static files (prerendered pages, hashed assets, precompressed .br/.gz variants) are served by sirv,
// everything else goes to the Astro handler (API routes), and responses are compressed in-process so the
// site is fast even without a reverse proxy in front. Run with: node --env-file-if-exists=.env server/start.mjs
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import compression from 'compression';
import sirv from 'sirv';
import { loadEnv } from '../src/lib/env.mjs';

try {
  const env = loadEnv(process.env);
  console.log(`[loficare] configuration ok. webhook=${env.webhook} email=${env.email} turnstile=${env.turnstile} analytics=${env.analytics} db=${env.DATABASE_PATH}`);
} catch (err) {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { handler } = await import(pathToFileURL(path.join(root, 'dist/server/entry.mjs')).href);

const compress = compression({ threshold: 1024 });
const assets = sirv(path.join(root, 'dist/client'), {
  gzip: true,
  brotli: true,
  etag: true,
  setHeaders(res, pathname) {
    const immutable = pathname.startsWith('/_astro/');
    res.setHeader('Cache-Control', immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=300, must-revalidate');
  },
});

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 4321);
createServer((req, res) => compress(req, res, () => assets(req, res, () => handler(req, res)))).listen(port, host, () => {
  console.log(`[loficare] serving on http://${host}:${port}`);
});
