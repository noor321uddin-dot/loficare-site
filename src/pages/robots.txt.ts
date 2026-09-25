import type { APIRoute } from 'astro';

export const prerender = true;
const site = ((import.meta.env.SITE_URL as string | undefined) || 'http://127.0.0.1:4321').replace(/\/$/, '');

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you
Disallow: /bn/thank-you

Sitemap: ${site}/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
