import { defineMiddleware } from 'astro:middleware';
import { loadEnv } from './lib/env.mjs';

/* Configuration is validated on the first request in dev (server/start.mjs does it at boot in production),
   and every response carries the baseline security headers. */
export const onRequest = defineMiddleware(async (ctx, next) => {
  try {
    loadEnv(import.meta.env);
  } catch (err) {
    console.error(String((err as Error).message || err));
    return new Response('Server configuration error. See the server log.', { status: 500 });
  }
  const res = await next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
});
