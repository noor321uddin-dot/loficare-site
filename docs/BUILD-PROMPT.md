# LofiCare landing page: build prompt for Claude Fable 5.1 at max effort

Version 2, 2026-09-26, revised after the review pass recorded in `2026-09-26-loficare-landing-build-prompt-review.md`. Paste everything below the rule into a fresh Claude Code session. Model: Claude Fable 5.1, effort max. Start the session with the working directory set to a new, empty folder for the site (see 0.2).

---

**Quick start, the order of operations.** Read the brief and the logo files. Set up the repository and the gates. Argue and record decisions D1 to D6. Run the direction flow. Stop once, show the user the rulings and the direction, and wait for a go. Build the hero and prove it at 390 and 1440. Build the body, the backend, the Bangla layer and discoverability. Run every gate, one inspection round, one fix batch, one confirmation round. Hand off with the four documents and the report. Everything below is the detail.

## 0. Session setup

1. Read these files in full before doing anything else. Paths are inside the Lofi sales repo at `C:\Users\benza\OneDrive\Desktop\Lofi sales`:
   - `docs/loficare/brief/loficare-landing-page-guideline.txt`, the 14-page creative brief (the PDF sits beside it).
   - `docs/loficare/brand/loficare-mark.png` (the mark, transparent background) and `docs/loficare/brand/loficare-lockup-dark.png` (mark plus wordmark on the dark ground). Copy both into the project.
   - This prompt, end to end, including section 15 (open decisions) and section 16 (placeholders).
2. Create the site in its own folder and its own git repository, outside OneDrive if at all possible, for example `C:\dev\loficare-site`. node_modules inside a synced folder is slow and flaky. If it has to live on the Desktop, exclude node_modules from OneDrive sync first.
3. Invoke these skills, in this order, and follow them: `superpowers:brainstorming` (classify the work as architectural; this prompt answers its questions, so keep the question round to what is genuinely open), `ui-ux-pro-max`, `impeccable`, `design-taste-frontend`. If a skill is not installed, say so once and apply the rules of this prompt in its place. Precedence when they disagree: the brief wins over this prompt, this prompt wins over the skills, and the logo wins over the brief for palette only (section 4). In impeccable's terms, the assembly moment in section 6 and the palette in section 4 are pinned by the brief: the direction roll chooses the visual world around them, never whether they exist.
4. Token discipline. No parallel agent fan-out. The team deliberation in section 2 happens in the main context, is written to a file, and the whole of `docs/DECISIONS.md` stays under 1,200 words. The only subagents allowed are the two impeccable ships: the finish reviewer and the documenter.
5. Evidence rule. Never report a check as passed without running it and reading its output. Never report the site as done before section 13 is fully green.
6. One human checkpoint. The user is present. After phase 3 (decisions and direction) stop, show the six rulings and the chosen direction in under 200 words, and wait for a go. That stop satisfies the brainstorming approval gate. There are no other stops unless something in this prompt turns out to be impossible, in which case say what and why, propose the nearest thing, and wait.
7. Imagery policy. No stock photography and no generated photographs of hospitals, staff or patients: the brief wants real Bangladeshi context or nothing, and nothing real exists yet. The launch page is carried by the mark, typography, schematics and real working components. Photo slots are reserved, sized and listed in section 16. If an image generation tool exists, use it only for abstract textures and the Open Graph background, never for anything a visitor could read as a photo of a real place or a real product.

## 1. Mission

Build a production-ready marketing site for LofiCare, a hospital and diagnostic centre management platform for Bangladesh. One landing page with three doors (facility, doctor, patient), an English and Bangla layer, two working forms with a real backend, and the support pages the brief needs (patient how-it-works, privacy, terms, thank-you). It ships as a deployable repository with a README, not as a mockup.

The one sentence the page must land: LofiCare runs a diagnostic centre or hospital on one connected system, and you can start today with online appointments, free.

The three jobs, in priority order: convince a diagnostic centre or hospital to book a demo; let an independent doctor start free on the live appointment module; let a patient find and book a doctor.

Naming. The brand is written LofiCare, one word, matching the lockup. The live module is LofiCare Appointments. The facility product is the LofiCare platform.

## 2. The team and how it argues

You play four people. Each has a real position and a real bias, and the point of the argument is a better site, not consensus.

- **FE-A, frontend developer, ten years, Three.js and motion.** Wants the one authored WebGL moment to be unforgettable. Bias: ambition over budget.
- **FE-B, frontend developer, ten years, HTML, CSS, typography, accessibility.** Wants every pixel to hold on a 360px Android on 4G. Bias: will cut motion before cutting speed.
- **BE, backend developer, ten years.** Owns the forms, storage, validation, spam, notifications, i18n plumbing, deploy. Bias: fewer moving parts, everything observable.
- **PM, the manager.** Owns the brief, the honesty rules, the conversion metric and the token budget. Rules every dispute.

Deliberation protocol, run once per decision point below and never re-opened without new evidence:

1. Each role states a position in at most 80 words.
2. One rebuttal round, at most 50 words each, aimed at a specific weakness in another position.
3. PM rules, in writing, citing the non-negotiable that decided it. Tie-break order: honesty rules, then mobile 4G performance, then conversion clarity, then craft ambition.
4. The ruling and the losing arguments go into `docs/DECISIONS.md` as a table row: decision, options, ruling, reason, what would reopen it. Chat gets one line per decision.

Decision points (exactly these, plus any that surface with a written reason):

- **D1 Theme.** Light clinical base with one deliberate dark band for the hero and the final call (PM default), or a fully dark page matching the lockup ground. The taste rules allow one theme switch per page if it is a composed color-block story, never random alternation.
- **D2 Stack.** Astro 5 with the Node adapter, TypeScript, Tailwind v4, one vanilla Three.js island, GSAP ScrollTrigger for scroll choreography (PM default), or Next.js App Router with React Three Fiber. BE argues operations, FE-B argues first-load JavaScript, FE-A argues authoring speed.
- **D3 Hero technique.** The SVG and CSS transform assembly is mandatory: it is the mobile experience, the reduced-motion experience and the fallback everywhere. The question is whether the instanced Three.js assembly (section 6) ships as the enhancement at 768px and up. Benchmark rule: it ships only if it holds 50 fps in Chrome DevTools with 4x CPU slowdown at 1024px, stays under its budget (section 11), and the poster loads first. Otherwise the SVG version ships alone and the WebGL island stays behind a flag with its measurements recorded.
- **D4 The "Book a demo" mechanism.** Inline `#demo` section with the short form plus WhatsApp and phone links (PM default, matches brief §17.3 and is easiest to measure), or a slide-over form opened from every demo button.
- **D5 Type pairing.** One Latin family for display and body plus one Bangla family, two families total (section 5).
- **D6 The "Available now" badge.** Brief's Calm Green with a check icon and the words, or an ink-filled badge with the words in pale aqua. The badge must read as different from the aqua brand color and must not rely on color alone.

## 3. The brief, condensed to what binds

Everything here comes from the guideline. Where the brief has more detail, the brief wins.

**Positioning.** Not a chamber app. An 18-module platform that runs the whole facility: patients, doctors and referrers, billing, samples and reports, imaging, inpatient, pharmacy, workforce, analytics. Say "one platform for your whole facility," never "another app for your chamber." The four things we win on: built for Bangladesh (local workflows, local payment rails, Bangla and English, data stays in the country); one connected system; diagnostics depth (referrer commissions, barcoded samples, result verification, imaging, fast report release); you can start today, free, on appointments.

**The honesty rule that carries the launch.** Only the appointment module is shown as available. Every other module is "Early access" in a neutral color, never "Available," never with a fabricated screenshot. No invented statistics, no user counts, no stock testimonials, no fake client logos, no no-show percentage, no HIPAA or SOC2 claims. No fixed platform price anywhere; the appointment price is anchored as "less than three patients a month" and "start free," never a number that can rot.

**Copy voice.** Plain, confident, short sentences. No em dashes anywhere, not in copy, alt text, code comments or commit messages. No filler: delve, leverage, seamless, robust, elevate, unleash, next-gen, revolutionize. Never state an unverified claim about anyone as fact.

**The 18 modules by tier.**

| Tier | Modules | Status |
|---|---|---|
| Core | Facility, people and access control; Patient identity and registry; Doctor, referrer and earnings; Service catalogue and pricing; Appointment, queue and front desk; Visit and order desk; Billing, payments and counter; Credit accounts (corporate, insurance, health card) | Appointments: Available now, free. Rest: Early access |
| Diagnostics | Sample, collection, barcode and QR; Result entry, verification and quality control; Imaging and radiology; Report release, delivery and archive | Early access |
| Clinical | Clinical records, prescription and digital forms | Early access |
| Hospital | Inpatient: admission, ward, OT, emergency and ancillary | Early access |
| Supply | Pharmacy and inventory | Early access |
| Operations | Workforce, assets and compliance | Early access |
| Engagement | Communication, patient portal and service desk | Early access |
| Insight | Reporting, analytics and MIS | Early access |

**Primary actions.** Facility: Book a demo. Doctor: Start free with Appointments. Patient: Find your doctor. One label per intent across the whole page; no synonyms.

**Language.** English primary, a real EN / বাংলা toggle, not machine translation baked in. The patient section, the booking flow, the primary CTAs, the header, the footer, the sticky bar, the form labels and the trust and compliance lines ship in real Bangla. Everything else may fall back to English in this release, marked so a native reviewer can finish it.

**Layout rules from the brief.** Phone first at 360 to 390px. Sticky minimal header: logo left, language toggle and one primary CTA right, quiet links to the doctor and patient sections. Sticky bottom CTA bar on mobile. Container about 1140px, 16px gutters on mobile, no horizontal scroll. Section spacing 64 to 96px desktop, 40 to 56px mobile. Buttons 8 to 12px radius, tap targets 44px minimum. Every interactive element has hover, focus, disabled and loading states.

**Measurement.** Track facility demo requests split by diagnostic centre versus hospital, doctor trial starts, and patient find-your-doctor clicks. Instrument hero CTA click, form start and form complete, per audience. Consent banner defaulting to the privacy-preserving choice. No personal data in a URL.

**Discoverability.** The Facebook link preview is the first channel: a purpose-made Open Graph image, a strong title, a one-line description. Favicon and app title set.

## 4. Brand: the logo decides the palette

The brief's palette (Trust Blue, Marigold) predates the final logo. The final logo is an aqua gradient mark on a near-black teal ground, so the brief's teal ban is void and the palette is re-derived from the logo. Keep every role the brief defined; change the values.

Sampled from the logo files:

| Element | Hex |
|---|---|
| Mark gradient, saturated end | #40E8E0 |
| Mark gradient, mid | #67F1E9 |
| Mark gradient, pale end | #A7FCF6 |
| Lockup ground, darkest | #001818 |
| Lockup ground, lifted | #002424 |
| Lockup ground, mid teal | #126260 |

Palette roles. Define them as CSS custom properties and never write a raw hex in a component.

| Role | Token | Value | Use and contrast note |
|---|---|---|---|
| Ink 950 | `--ink-950` | #041A1A | Dark bands, footer, the hero ground. Not pure black. |
| Ink 900 | `--ink-900` | #062626 | Lifted dark surfaces on ink bands. |
| Ink 800 | `--ink-800` | #0B3534 | Borders and edges on dark surfaces. |
| Aqua 400 | `--aqua-400` | #40E8E0 | The mark, the WebGL moment, large accents on dark ground only. Fails contrast on white for text, so never body text on light. |
| Aqua 300 | `--aqua-300` | #67F1E9 | Gradient companion, glow edges. |
| Aqua 200 | `--aqua-200` | #A7FCF6 | Text and icons on ink (passes AA on ink 950). |
| Teal 700 | `--teal-700` | #0B6B67 | Links, headings accents and key icons on light surfaces (6.4:1 on white). |
| Teal 600 | `--teal-600` | #0E7C78 | Large text and UI strokes on light (5.0:1 on white). |
| Wash 100 | `--wash-100` | #D3F6F3 | Callout panels, chips on light. |
| Wash 50 | `--wash-50` | #EAFBFA | Alternating section backgrounds on light. |
| Off-white | `--paper` | #F6FAFA | Page and card background. Not pure white. |
| Slate | `--slate` | #46605F | Secondary text on light (6.8:1 on white). Tinted from the teal hue, never neutral gray. |
| Mist | `--mist` | #D8E6E5 | Borders, dividers, input outlines, the "Early access" badge. |
| Marigold | `--marigold` | #F5871F | Primary CTA fill only, one per screen. White text on it fails AA (2.5:1), so the label is ink 950 (7.2:1). |
| Calm Green | `--green` | #1F9D74 | Only the "Available now" mark, sparingly, always with a check icon and the words (see D6). |
| Signal Red | `--red` | #D64545 | Form errors and warnings only. Never a CTA, never decoration. |

Color strategy (impeccable's vocabulary): Committed. The page is light. Ink appears as two mirrored bands, the opening (header and hero) and the close (the demo section and the footer as one continuous band), and nowhere in between; that is the page's one composed theme switch, not alternation. Teal carries the bands and the module system, paper and wash carry the reading sections, marigold does the asking. Secondary text on ink uses `--mist-on-ink` #9CB7B5 (8.5:1 on ink 950), never slate. Verify every text-on-background pair with the contrast script in section 12 before the first commit that touches tokens.

Layer scale, fixed: content overlays 10, sticky header 20, sticky mobile bar 30, consent banner 40, dialogs 50. Nothing else sets a z-index.

Brand assets to produce: favicon set from the mark (SVG, 32px PNG, 180px Apple touch), an Open Graph image at 1200 by 630 (mark and wordmark on ink 950, the one-line description in aqua 200), and a static poster render of the assembled hero mark for fallbacks.

## 5. Typography

Two families total, both free and self-hosted with `font-display: swap`, subset to Latin and Bengali respectively, the Latin variable font preloaded.

- **Latin, one family for display and body, weights 400 to 700.** The brief names Poppins or Plus Jakarta Sans for headings and Inter for body; the two-family cap means one Latin face must carry both. The team argues D5 from this shortlist, judged on Bangla harmony, x-height and credibility for a hospital buyer: Figtree, Manrope, Onest, Hanken Grotesk, Public Sans, Geist. The brief's own faces stay available as the safe exit if the argument stalls.
- **Bangla, one family.** Hind Siliguri (the brief's canon), Noto Sans Bengali (variable, pairs with Noto Sans) or Anek Bangla (variable, modern). Bangla headings need line-height 1.4 or more so matras and descenders never clip, no letter-spacing on Bangla text, and Bangla body sits about 5 percent larger than the Latin body at the same slot. Ship at most two Bangla weights (400 and 700) if the family is static, subset with `pyftsubset` to the Bengali block (U+0980 to U+09FF), the zero-width joiners (U+200C, U+200D), the danda marks (U+0964, U+0965) and the Bangla digits, and test a conjunct-heavy sentence at every breakpoint before trusting the subset.
- **Scale, mobile first.** Body 16px minimum, line-height 1.5. H3 20 to 22px, H2 26 to 30px, H1 32 to 40px, scaling up on desktop with display capped where the hero still fits one viewport. Measure 60 to 75 characters on desktop. Numbers set one weight heavier than their surrounding text.
- No kicker or eyebrow labels above headings anywhere. No gradient text. Emphasis by weight and size only.

## 6. The design concept and the one authored moment

**The spine.** The brief's problem statement is "a facility runs on too many disconnected systems." The whole page dramatizes disconnected pieces becoming one system, and the LofiCare mark is that system. The memory test: if a visitor leaves after one viewport, an hour later they should describe "the modules snapping together into the LofiCare mark, with the appointment cross lit up," not a mood.

**The hero moment, specified.** Eighteen rounded tiles, one per module, drift as a loose cloud in ink space with thin aqua rim light. As the visitor scrolls the first viewport (or on a four-second idle timeline if they do not), the tiles converge into the geometry of the mark: the ring, the L, and the cross. The appointment tile becomes the central cross and holds the aqua gradient; the other seventeen settle as ink tiles with mist edges, honestly unlit because they are early access. The assembled mark then holds still; hovering or focusing a door in the band below pulses the tile that door refers to. This mechanic is borrowed from metic.studio's scroll-driven "from a line to a button" build-up, applied to our own subject.

The mark exists only as a PNG. First task of phase 4: trace it into an SVG by hand from the PNG, as a handful of paths (the ring, the L, the cross), and make that SVG the logo asset everywhere, favicon included. The SVG paths are also the data: sample eighteen target positions along them, seventeen on the ring and the L, the cross for the appointment tile, so the SVG assembly and the WebGL assembly converge on the same geometry.

The assembly ships in two tiers:

- **SVG and CSS tier, mandatory.** Eighteen `<g>` tiles animated with transforms and opacity, driven by GSAP ScrollTrigger on scroll or by the idle timeline. This is what phones, reduced-motion visitors, crawlers and any device that fails the checks below receive. It must be beautiful on its own; it is not a consolation.
- **WebGL tier, the enhancement (FE-A owns it, FE-B polices it).** One canvas, one InstancedMesh for the eighteen tiles, one draw call. Any dust particles capped at 3,000. No post-processing bloom; fake the glow with emissive color and one additive sprite. Device pixel ratio capped at 1.5. Rendering pauses when the canvas leaves the viewport or the tab is hidden. Touch input handled alongside pointer input. The island loads after the `load` event or on idle, only at 768px and wider, only when `prefers-reduced-motion` is not set, WebGL2 is available and `navigator.deviceMemory` is 4 or more, and only after the D3 benchmark passes.

Rules for both tiers: the hero headline, subtext and both CTAs render as HTML before any script runs, and the core message never waits for the canvas. A static poster of the assembled mark, rendered from the SVG so the tiers match, is the reserved-size first paint in AVIF with a WebP fallback. A visitor who arrives through an anchor link, or who has already seen the assembly this session (a sessionStorage flag), gets the assembled state immediately. No cursor effects, no cursor trails, no custom cursors.

**Elsewhere on the page, motion is material, not decoration.** One scroll-driven assembly (the hero), one animated line drawing where pieces join (the problem section), state transitions on accordions and forms, and press feedback on buttons. No identical fade-up entrance on every section, no infinite loops on informational sections, no marquee more than once, no scroll cues, no parallax. Every animation must be justifiable in one sentence as hierarchy, storytelling, feedback or state change, and everything above a hover collapses to static under `prefers-reduced-motion`.

**Inspiration, harvested 2026-09-25, and what to take from each.**

- Codrops Creative Hub, Three.js tag (tympanus.net/codrops/hub/tag/three-js/): "Volatile Nexus" and "Interactive 3D Cluster" for particles and nodes that read as one connected system; "3D Wave Grid" for a grid of cubes as a module field; "Skeleton Fluid Reveal" (x-ray style hover) as a reference for the imaging module teaser only if it stays subtle; "Pixel Image Effect" as a working precedent for Astro plus Three.js plus GSAP. Take the techniques, not the demos. Do not borrow tunnels, games, datamosh, catapults or cursor lenses; they are the wrong register for a hospital buyer.
- Awwwards Three.js collection (awwwards.com/awwwards/collections/three-js/): "Total Property Network" as proof that a corporate site can carry a restrained WebGL moment; "Moooi Paper Play" and "Blueyard" for scroll-tied WebGL that stays calm. The gaming and metaverse entries are anti-references here.
- Awwwards medical category (awwwards.com/websites/medical/): mostly agency marketing, mid-scored, years old. The bar in this category is low, which means a credible, fast page with one authored moment stands out. Do not copy its stock-photo habits.
- Untitled UI React components (untitledui.com/react/components): use the marketing section catalog (hero header, features, CTA, FAQ, social proof, pricing, footer, header navigation) as a structural checklist for what each section must contain and for its accessible form patterns, then reskin fully. Never ship a default-state component.
- metic.studio/en: the scroll-driven build-up narrative, the honesty of "one colour, one red," the fast hand-coded feel, and the way the primary action repeats with the same label. Do not copy its numbered steps (01/08), which our rules ban.
- cssdesignawards.com and awwwards.com front pages: current winners lean on kinetic type and full-screen motion. Take the craft level, not the register.

## 7. Page spine, section by section

Section ids are fixed and the order is fixed. Layout families: no two adjacent sections share one, no family appears more than twice on the page, and the page uses at least six distinct families. Copy is the brief's starter copy, tightened. Hero subtext is capped at 20 words and the hero holds at most four text elements: headline, subtext, primary CTA, secondary CTA.

| Id | Section | Layout family and visual | Copy anchor |
|---|---|---|---|
| `header` | Sticky header | Logo left; EN / বাংলা toggle and "Book a demo" right; quiet links "Doctors" and "Patients." Single line at 1024px, height 64 to 72px. | |
| `hero` | Platform-first hero on ink | Asymmetric split: copy left, the assembling mark right (canvas or poster). Dark band, one of two on the page. | H1: "Run your whole facility on one platform, built for Bangladesh." Sub: "One connected system for diagnostic centres and hospitals. Online appointments are live today and free to start." CTAs: Book a demo (marigold, ink label). Start free with Appointments (aqua outline). |
| `doors` | Three doors | Stepped tiles, not three equal cards: facility tile widest, doctor tile medium, patient tile quiet. | "Diagnostic centre or hospital? Book a demo." "Independent doctor? Start free with Appointments." "Patient? Find your doctor." |
| `trust` | Trust line | One full-width statement on wash, no logos. | "Built in Bangladesh. Your patients' data stays in Bangladesh." Founding-cohort line only when true. |
| `problem` | The problem | Headline, then two columns (facility, chamber doctor) with one animated line drawing of disconnected pieces joining. No stock photos of stressed staff. | H2: "A facility runs on too many disconnected systems." |
| `platform` | The 18 modules | Grouped chip grid by tier with sticky tier labels on desktop; appointments chip carries the Available now badge, the rest carry Early access in mist. This section earns the "complete platform" claim. | Tier names and module names from section 3, verbatim. |
| `diagnostics` | For diagnostic centres | Full-width horizontal flow schematic: collection, barcode, verification, release, delivery; plus a referrer statement schematic, both labelled Early access. CTA below. | H2: "Know what every referrer earns. Get reports out faster." CTA: Book a demo. |
| `hospitals` | For hospitals | Split: copy and an SVG schematic of departments reading one patient record. | H2: "One system for your whole hospital." CTA: Book a demo. |
| `appointments` | The live module | Sticky feature scroll: four benefits on the left pin while a real, working mini booking widget on the right (sample data, labelled "Interactive demo, sample data") changes state. Not a fake screenshot made of divs; a real component. | H2: "Start today with online appointments." Benefits: "No more phone calls to book." "The waiting room knows the queue." "Fewer empty chairs." "See your day from your phone." CTA: Start free with Appointments. |
| `doctors` | For independent doctors | Vertical stack: headline, body, one public booking link mock-up as a real component, CTA. | H2: "Run your chamber, starting this week." Anchor line: "It costs less than three patients a month when you upgrade." |
| `patients` | The patient section | Four-step walkthrough, horizontal scroll-snap on mobile, one row on desktop. Fully bilingual. | H2: "For your patients: book in a minute, skip the phone call." CTA: Find your doctor. |
| `data` | Data and control | Full-width statement with an append-only ledger component showing sample audit rows, labelled sample. | H2: "Your patients' data stays in Bangladesh, and every sensitive action is on the record." |
| `cohorts` | Proof and founding cohorts | Two-cell panel: Founding Diagnostic Centres and Hospitals; Founding Doctors. Testimonial slots designed as honest empty states, no quotes until real ones exist. | Scarcity and co-building copy from brief §7.11. |
| `pricing` | Pricing | Two columns: Appointments (free entry, anchor line, no numbers) and Platform (per facility, founder pricing, book a demo). | "Start free with your first 500 appointments. No card." |
| `faq` | FAQ | Accordion, six questions from brief §7.13, honest answers. | |
| `demo` | Demo request | Opens the closing ink band. The form from section 9 with WhatsApp and phone links beside it, both CTAs above the form. | H2: "One platform for your facility. Start today with appointments." Anchor line once more: "less than three patients a month." |
| `footer` | Footer | Continues the closing ink band. Contact, demo link, privacy, terms, language toggle, company line. | |
| `stickybar` | Sticky mobile CTA bar | Bottom bar, primary action for the section in view (demo by default, Start free inside the appointment and doctor sections). Safe-area padding. | |

Support pages: `/patients/how-it-works` (the Find your doctor destination until a directory exists, per brief §17.5; fully bilingual), `/privacy` and `/terms` (structured placeholders with the sections a Bangladeshi data-protection notice needs, marked for legal review), `/thank-you?form=demo|trial` (bilingual, with the WhatsApp link as the next step).

## 8. Component kit

Buttons (primary marigold with ink label, secondary aqua or teal outline, text link), module chips with status badges, the demo-request form, the one-field trial form, the FAQ accordion, the sticky header, the sticky mobile bar, the language toggle, the consent banner, the mini booking widget, the ledger component. One corner radius system: 10px on buttons and inputs, 16px on tiles, consistently. Icons from one line-icon family (Phosphor or Tabler), one per module, in teal 700 or slate; never emoji, never hand-drawn icon paths. Every interactive element has hover, visible focus ring, disabled and loading states, and 44px tap targets with 8px spacing.

## 9. Backend and forms (BE owns this)

Endpoints, on the chosen stack:

| Endpoint | Fields | Rules |
|---|---|---|
| `POST /api/demo-request` | name, facility name, facility type (diagnostic centre or hospital), role, phone or email (one required, both allowed), branches, message optional, language | Validate server-side with zod, normalize Bangladeshi phone numbers, honeypot field plus minimum-time check, rate limit per IP, store, then notify. |
| `POST /api/trial-start` | phone or email, name optional, language | Same protections. Store, then notify. |
| `POST /api/patient-interest` | area or doctor name, phone optional | Only if the team keeps a patient capture; otherwise the patient CTA is a plain link. |

Storage: SQLite through Drizzle with migrations, one `leads` table with audience, facility type, status, source page, language, a duplicate flag (same phone or email within 24 hours is stored and flagged, never rejected) and timestamps, plus a `deliveries` table that records every outbound attempt. Notifications: forward every lead to an outbound webhook when `LEAD_WEBHOOK_URL` is set (LofiStack runs GoHighLevel, so the payload uses flat field names ready for a GHL inbound webhook), and send an email through SMTP when `SMTP_URL` is set. Both optional, both logged, both retried by `npm run leads:retry` from the deliveries table. Phone numbers normalize to E.164 with the +880 country code and accept the common local forms (01XXXXXXXXX, +8801XXXXXXXXX, with spaces or dashes). Cloudflare Turnstile is supported behind `TURNSTILE_SECRET` and off by default, because the honeypot, the minimum-time check and the rate limit are keyless. Environment variables validate at boot with zod and the process refuses to start on a bad configuration. `GET /api/health` reports database and configuration state. A `npm run leads:export` command writes CSV. A `.env.example` lists every variable with a comment. Errors return field-level messages in the visitor's language; success redirects to the thank-you page carrying the form name only, never personal data.

Deployment: a single Node process behind a reverse proxy, with a Dockerfile and a `docker compose` file that mounts a volume for the SQLite file, so the site and its leads can be hosted in whatever region the team chooses (the brief's data promise makes hosting location a documented decision, not an accident). The README states the swap to Turso or libSQL if a serverless host is ever chosen. The in-memory rate limiter is per process and the README says so.

WhatsApp and phone: `wa.me` links with a prefilled first line per audience, and `tel:` links, both read from config, both flagged as placeholders until the real numbers land (section 16).

## 10. Internationalization

Routes `/` (English) and `/bn/` (Bangla) render the same page from two dictionaries in `src/i18n/en.json` and `src/i18n/bn.json`. The toggle links between the routes and remembers the choice in a cookie. `html lang`, `hreflang` alternates and canonical tags are set on every page. Bangla strings are written for real, by you, for the minimum set in section 3; missing keys fall back to English, get a `data-i18n-missing` attribute, and are listed by `npm run check:i18n` so a native reviewer can finish them. Numbers and dates render with the locale.

## 10b. Measurement

A `track(name, props)` adapter that no-ops until consent is granted, with a Plausible-compatible provider behind `ANALYTICS_DOMAIN` and a console provider in development. No cookies and no third-party requests before consent; the consent choice itself is stored in a first-party cookie. Events, exactly these names:

| Event | Props |
|---|---|
| `hero_cta_click` | audience: facility, doctor, patient; label |
| `door_click` | audience |
| `form_start` | form: demo, trial; language |
| `form_complete` | form; facility_type when form is demo; language |
| `find_doctor_click` | location on page |
| `whatsapp_click`, `phone_click` | audience |

The headline numbers are `form_complete` split by facility type and `form_complete` for trial. Never put personal data in an event or a URL.

## 11. Performance budget (FE-B enforces, PM signs)

| Metric | Budget |
|---|---|
| Lighthouse mobile performance, home, simulated 4G and mid-range CPU | 90 or better with the WebGL island excluded from first load |
| LCP | under 2.5 s |
| INP | under 200 ms |
| CLS | under 0.1 |
| First-load JavaScript, gzipped, excluding the lazy island | 90 KB or less |
| Three.js island, gzipped, tree-shaken | 160 KB or less, loaded after `load` or on idle |
| Fonts | two families, subset, swap, Latin variable preloaded |
| Images | AVIF with WebP fallback, width and height set, lazy below the fold, the hero poster preloaded |

Render the core message and both CTAs even if every image is still loading.

## 12. Quality gates and the scripts that enforce them

Add these to `package.json` and make them pass before any phase closes:

- `check:copy`: runs over the dictionaries, the content files and the rendered HTML of every route, never over CSS or scripts. Fails on any em dash or en dash, on the banned filler words, on "HIPAA" or "SOC 2," on any percentage or user count in visible copy, on any currency amount, and on the word "Available" inside the module grid on anything other than the appointment chip.
- `check:contrast`: computes WCAG ratios for every token pair used for text and fails below 4.5:1 for body and 3:1 for large text and UI.
- `check:i18n`: lists dictionary keys present in English and missing in Bangla, and fails if any key from the mandatory bilingual set is missing.
- `check:budget`: fails when the built bundles exceed section 11.
- `lighthouse`: mobile preset, simulated throttling, saved to `docs/reports/`.
- `axe`: zero critical or serious issues on every route.
- `typecheck`, `lint`, `build`.

The impeccable flow's own gates also apply: its direction contract as the first HTML comment in the body of the root layout, its detector run once on the changed targets, one batched inspection round at 390 and 1440 wide with screenshots saved under `docs/screens/`, the finish reviewer, then the documenter writing `DESIGN.md`.

## 13. Work plan and gates

Commit at the end of every phase with a message that names the phase. Do not start the next phase with a red gate.

1. **Setup.** Repository, stack from D2, tokens from section 4, fonts, `.env.example`, the scripts in section 12 wired and passing on an empty page. impeccable `init` writes `PRODUCT.md` from the brief.
2. **Decisions.** Run the deliberation protocol for D1 to D6. Write `docs/DECISIONS.md`.
3. **Direction.** Run impeccable's new-work flow, including its direction roll. The team argues the dealt directions against section 6 with the same protocol; the winning direction must keep the assembly moment and the honesty rules, or it loses. Record the direction contract. Then the one human checkpoint from 0.6.
4. **Hero first.** Vectorize the mark. Build the header, the hero (poster first, then the SVG assembly, then the WebGL island behind the D3 benchmark), the doors and the sticky bar. Capture 390 and 1440. Prove the hero before building past it.
5. **Body.** Build the remaining sections in spine order with real components for the appointment demo and the ledger. Run `check:copy` after every section.
6. **Backend.** Endpoints, storage, notifications, thank-you flow, export command. Test each endpoint with curl and paste the output into `docs/reports/backend-tests.md`.
7. **Bilingual.** Dictionaries, `/bn/` route, toggle, Bangla typography, `check:i18n`.
8. **Discoverability and measurement.** Title, meta, Open Graph image and tags, favicon set, JSON-LD for Organization and SoftwareApplication with only defensible fields, sitemap, robots, the consent banner and the event adapter with every event from 10b firing in the console provider. Verify the OG tags with a local fetch and record how to test the Facebook preview.
9. **Quality round.** All section 12 gates, impeccable inspection round, finish reviewer, documenter. Fix in one batch, confirm with one more round, stop polishing.
10. **Handoff.** README with run, build, deploy (Node process, Dockerfile) and environment variables; `docs/DECISIONS.md`; `docs/OPEN-ITEMS.md` listing every placeholder from section 16 and every Bangla key awaiting native review.

## 14. Definition of done and the final report

Done means: every gate in section 12 green with output on record; both languages render on every route; both forms submit end to end against the local database; screenshots at 390 and 1440 saved; the OG preview verified; the direction contract present in the built HTML; `PRODUCT.md`, `DESIGN.md`, `DECISIONS.md`, `OPEN-ITEMS.md` and the README written.

The final report to the user, in this order: what shipped, the D1 to D6 rulings in one line each, the gate results as a table with numbers, the open items, the three biggest risks you see, and how to run it. No claim without the output that backs it.

## 15. Open decisions from the brief, and the defaults you assume

| Decision | Default to build with |
|---|---|
| Real status of each module | Only appointments Available now; every other module Early access |
| Founder cohort sizes | Copy says "a small founding cohort of facilities and an open cohort of doctors," no numbers |
| Book a demo channel | Form plus WhatsApp plus phone (D4) |
| Naming | LofiCare, LofiCare Appointments, the LofiCare platform |
| Find your doctor destination | `/patients/how-it-works` until a directory exists |
| Appointment pricing display | "Start free" plus the three-patients anchor line, no figure |
| Palette sign-off | Section 4 values, verified by `check:contrast` |
| Domain and lockup | Files in section 0; domain a placeholder |
| Proof at launch | Founder story and Bangladesh-built lines, honest empty testimonial slots |

## 16. Placeholder registry

Every one of these ships clearly marked in code and listed in `docs/OPEN-ITEMS.md`: the Bangladeshi phone number, the WhatsApp number, the domain, the outbound webhook URL, the SMTP settings, the analytics domain, real product screenshots of the appointment module (replace the demo widget's chrome when they exist), real photographs of Bangladeshi facilities and chambers from the LofiCare team for the reserved photo slots, the founding-cohort line once true, testimonials once real, legal review of the privacy and terms pages, the hosting region decision, and native review of every Bangla string.
