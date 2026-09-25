# LofiCare site

The marketing site for LofiCare, the hospital and diagnostic centre platform for Bangladesh. One landing page with three doors (facility, doctor, patient), English and Bangla, two lead forms with a real backend. Built with Astro 7 (Node adapter), Tailwind 4, GSAP, and the Node built-in SQLite for leads.

Product truth lives in `PRODUCT.md`, every design and engineering ruling in `docs/DECISIONS.md`, the creative brief in `docs/brief/`, the build prompt in `docs/BUILD-PROMPT.md`.

## Run

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

The site is at http://127.0.0.1:4321 (English) and /bn/ (Bangla).

## Build and start

```bash
npm run build
npm start
```

`npm start` validates the configuration first and refuses to start on a bad one, then serves `dist/` on `HOST`:`PORT` (defaults 0.0.0.0:4321). Static routes are prerendered; the API routes run on the server.

## Configuration

Every variable is listed in `.env.example`. Nothing is required to run: without `LEAD_WEBHOOK_URL` or `SMTP_URL` leads are stored only, and `/api/health` says which channels are on.

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical origin, used for canonical and hreflang tags |
| `DATABASE_PATH` | SQLite file for leads and deliveries (default `./data/leads.db`) |
| `LEAD_WEBHOOK_URL` | Every lead is POSTed here as flat JSON. A GoHighLevel inbound webhook URL works as is |
| `SMTP_URL`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Email a copy of every lead |
| `TURNSTILE_SECRET`, `TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile; off when empty |
| `ANALYTICS_DOMAIN` | Plausible-compatible analytics, loaded only after consent |
| `CONTACT_PHONE`, `CONTACT_WHATSAPP` | The numbers behind the call and WhatsApp links |
| `RATE_LIMIT_PER_10MIN` | Per-IP submissions per form per ten minutes (default 10) |
| `PUBLIC_WEBGL_HERO` | `off` ships the SVG hero alone; by default capable desktops load the WebGL tier after the page has loaded |

## Leads

- `POST /api/demo-request` and `POST /api/trial-start` accept JSON or a plain form post. Validation errors come back per field in the visitor's language. A plain form post redirects to `/thank-you`.
- Spam: honeypot field, minimum fill time, per-IP rate limit, optional Turnstile. Spam is stored with `spam = 1` and never delivered.
- Duplicates: the same phone or email within 24 hours is stored and flagged, never rejected.
- Delivery: one row per channel in `deliveries`, attempted at once, retried with `npm run leads:retry` (up to five attempts).
- `npm run leads:export` writes a UTF-8 CSV with a BOM so Excel shows Bangla correctly.
- `GET /api/health` reports database state, configured channels and counts.

The rate limiter is in memory and per process, which is right for one instance. Phone numbers are normalized to E.164 (+880). Only a salted hash of the visitor's IP is stored.

## Deploy

```bash
docker compose up -d --build
```

One container, one volume (`leads-data`) for the SQLite file. Host it in whatever region the team chooses: the site promises patients' data stays in Bangladesh, so where this database lives is a documented decision, not an accident. If the site ever moves to a serverless host, swap `src/lib/db.mjs` to Turso or libSQL; the rest does not change.

## Hero tiers

The hero assembly always ships as SVG with GSAP: that is the first paint, the phone experience and the fallback. Desktops of 768 px and wider with WebGL2 and enough memory load `src/lib/webgl-hero.ts` after the page has loaded and hand the same animation over to it; the island bows out by itself if it cannot hold 42 fps. `npm run build` then `BASE=http://127.0.0.1:4399 node scripts/bench-webgl.mjs` against a served build re-runs the decision D3 benchmark.

## Fonts

Two families ship: Manrope for Latin and Anek Bangla for Bangla. `npm run fonts` (Python with fonttools and brotli) rebuilds the three small files in `public/fonts/`: a basic-Latin Manrope subset the headline renders from without waiting on a swap, and Anek Bangla as static 700 and 400 instances subset to every Bangla string found in `src/`. Run it after adding Bangla copy.

## Quality gates

```bash
npm run check:copy       # no dashes, filler, certification claims, prices or fake counts in copy or built HTML
npm run check:contrast   # every text pair against WCAG AA
npm run check:i18n       # mandatory Bangla present, fallbacks listed
npm run typecheck
npm run build
```
