# Discoverability and measurement check, 2026-09-26

Fetched from the dev server at 127.0.0.1:4321 with curl. Production values follow `SITE_URL`.

## Head tags on `/`

- `<title>` LofiCare, the hospital and diagnostic centre platform for Bangladesh (68 characters)
- `<meta name="description">` Run a diagnostic centre or hospital on one connected system. Online appointments are live today and free to start. Book a demo for the full platform. (152 characters)
- canonical `/`, hreflang `en` `/`, `bn` `/bn/`, `x-default` `/`
- `og:type` website, `og:site_name` LofiCare, `og:title`, `og:description`, `og:url`, `og:image` `/og/loficare-og.png` 1200 by 630 with alt text, `og:locale` en_GB, `og:locale:alternate` bn_BD
- `twitter:card` summary_large_image, `twitter:title`, `twitter:description`, `twitter:image`
- `theme-color` #F6FAFA, switched to #041A1A by the color-mode toggle
- favicon SVG, 32 px PNG, 180 px Apple touch icon, web manifest

On `/bn/`: canonical `/bn/`, `og:locale` bn_BD, title লফিকেয়ার, বাংলাদেশের হাসপাতাল ও ডায়াগনস্টিক সেন্টার প্ল্যাটফর্ম.

## Structured data

Three JSON-LD objects on the home page, only defensible fields: Organization (name, url, logo, areaServed BD), WebSite (name, url, inLanguage), SoftwareApplication (LofiCare Appointments, BusinessApplication, Web, description, an Offer at price 0 described as "Free to start, first 500 appointments, no card", publisher). No ratings, no counts, no review markup.

## Sitemap and robots

`/sitemap.xml` lists the four public paths in both languages, eight URLs, each with `hreflang` alternates. `/robots.txt` allows everything except `/api/`, `/variants`, `/thank-you` and `/bn/thank-you`, and points at the sitemap. Both are prerendered at build time. The thank-you and variants pages also carry `noindex, nofollow`.

## Share image

`/og/loficare-og.png`: 1200 by 630, 107 KB, the mark and the wordmark keyed from the real lockup on ink, headline "The hospital and diagnostic centre platform, built for Bangladesh." in Manrope, subline "Online appointments live today, free to start." Built by `python scripts/make-og.py`, which also writes the favicon set.

## Consent and events

- No banner and no measurement unless `ANALYTICS_DOMAIN` is set. With a domain, the banner shows once, offers "Only what is needed" and "Allow analytics", links to the privacy notice, and stores the choice in the browser.
- Events queue before consent and flush after it. Verified in the browser: a click on the facility door queued `door_click {audience: facility}`; after accepting, the queue emptied and the console provider printed the event. No third-party script was loaded because no domain is configured.
- Provider: a Plausible-compatible script loaded only after consent. Event names are the ones in the build prompt section 10b, fired from `data-track` attributes and the form scripts (`form_start`, `form_complete` with facility type).

## How to test the Facebook preview before launch

1. Deploy with the real `SITE_URL` so the `og:image` URL is public.
2. Open the Facebook Sharing Debugger at https://developers.facebook.com/tools/debug/ and paste the home URL. Press "Scrape again" after any change.
3. Check that the card shows the share image, the title and the one-line description, then paste the link into a test post in a private group and confirm the preview renders.
4. Repeat for `/bn/`.
