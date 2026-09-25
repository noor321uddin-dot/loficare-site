# Quality round, 2026-09-26

Build prompt phase 9. Every number below comes from a command run against the built site served by `server/start.mjs` on port 4399 (compression on), on this machine, on 2026-09-26.

## Gates

| Gate | Result |
|---|---|
| `check:copy` | 0 violations over 12 built files and the dictionaries |
| `check:contrast` | 18 of 18 pairs pass AA |
| `check:i18n` | mandatory Bangla set complete; 114 non-mandatory keys fall back to English (listed for the native reviewer) |
| `check:budget` | first-load JavaScript 46.0 KB gzipped of 90 allowed (shared chunks counted); CSS 14.3 KB; HTML 15.1 KB; two font families |
| `astro check` | 0 errors |
| `astro build` | 13 prerendered outputs, 14 text assets precompressed to brotli and gzip |

## Lighthouse, mobile simulation (slow 4G, 4x CPU)

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 92 | 100 | 100 | 100 | 2.6 s | 2.9 s | 0 ms | 0 |
| `/bn/` | 92 | 100 | 100 | 100 | 2.5 s | 2.9 s | 0 ms | 0.004 |

Before this round the same pages scored 82 and 83 with LCP at 3.8 and 3.6 s. Three changes moved them: the server now compresses in process and serves precompressed assets (the home page went from 75 KB to 25 KB on the wire), both stylesheets are inlined so nothing render-blocking is fetched, and the Latin font is preloaded. The 90 score budget is met. The LCP target of 2.5 s in the budget table is not: 2.9 s under simulated slow 4G, driven by the font swap on the headline. The honest next steps for LCP are a smaller Latin subset for the hero and deferring GSAP until after first paint; both are listed in open items.

## axe-core 4.13, all ten routes

0 violations of any impact on every route after two fixes: an invalid `autocomplete` token on the trial field (serious) and duplicate language landmarks in the header and footer (moderate). Report in `docs/reports/axe/`.

## impeccable detector

One advisory finding, a decorative grid background, in `src/pages/variants.astro`, the working board that is deleted before launch. Zero findings on the shipped surface.

## Finish review and verdict

The review (`docs/reports/finish-review.md`) returned `disposition: fix` with three material fixes: hero mark scale, hero band height, appointments rhythm. All three were applied in one batch and recaptured. Verdict pass on the recaptures: the assembled mark now spans about 360 px of the 1440 px viewport beside a two-line headline, the hero band is capped at 720 px so the doors sit at the fold, and the benefits column is dense. Scored: three of three fixes resolved. The review's keep line holds: paper and wash, no eyebrows, one motion moment per section, honest badges.

## Captures

`docs/screens/home-desktop.png` and `home-mobile.png` (full page, both routes), `home-mobile-viewport.png`, and the reviewer's `.impeccable/review/hero-repro.png`, all with reduced motion so nothing is hidden by animation timing.

## Not in this round

The WebGL hero tier was not attempted; decision D3 lets the SVG tier ship alone, and it does. Email delivery and Turnstile are configured but were not exercised (no SMTP or Turnstile keys in the test environment).
