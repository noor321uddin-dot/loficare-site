import type { APIRoute } from 'astro';

export const prerender = true;

const site = ((import.meta.env.SITE_URL as string | undefined) || 'http://127.0.0.1:4321').replace(/\/$/, '');
const paths = ['/', '/patients/how-it-works', '/privacy', '/terms'];

const entry = (loc: string, en: string, bn: string) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="bn" href="${bn}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
  </url>`;

export const GET: APIRoute = () => {
  const body = paths.flatMap((p) => {
    const en = site + p;
    const bn = site + '/bn' + p;
    return [entry(en, en, bn), entry(bn, en, bn)];
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
