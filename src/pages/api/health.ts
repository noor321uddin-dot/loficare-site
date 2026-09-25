import type { APIRoute } from 'astro';
import { loadEnv } from '../../lib/env.mjs';
import { getDb, stats } from '../../lib/db.mjs';

export const prerender = false;

export const GET: APIRoute = () => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  try {
    const env = loadEnv(import.meta.env);
    let db = false;
    let counts: Record<string, number> = {};
    try { counts = stats(getDb(env.DATABASE_PATH)); db = true; } catch (err) { console.error('[health] db', err); }
    const body = {
      ok: db,
      db,
      config: { webhook: env.webhook, email: env.email, turnstile: env.turnstile, analytics: env.analytics },
      ...counts,
      time: new Date().toISOString(),
    };
    return new Response(JSON.stringify(body), { status: db ? 200 : 503, headers });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String((err as Error).message || err) }), { status: 500, headers });
  }
};
