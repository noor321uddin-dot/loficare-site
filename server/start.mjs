// Production entry: validate configuration, then start the built Astro server (Node adapter, standalone mode).
// Run with: node --env-file-if-exists=.env server/start.mjs
import { loadEnv } from '../src/lib/env.mjs';

try {
  const env = loadEnv(process.env);
  console.log(`[loficare] configuration ok. webhook=${env.webhook} email=${env.email} turnstile=${env.turnstile} analytics=${env.analytics} db=${env.DATABASE_PATH}`);
} catch (err) {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

process.env.HOST ??= '0.0.0.0';
process.env.PORT ??= '4321';
await import('../dist/server/entry.mjs');
