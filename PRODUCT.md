# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro 5 with the Node adapter (server output), TypeScript, Tailwind v4, one vanilla Three.js island behind a benchmark, GSAP ScrollTrigger for scroll choreography, and the Node built-in `node:sqlite` for lead storage (zero native modules, which matters on this Windows machine where Smart App Control blocks unsigned binaries). Chosen in `docs/DECISIONS.md` D2 and D7. Deploy target: one Node process in Docker with a volume for the database, region chosen by the team.

## Users

Primary: the owner or manager of a diagnostic centre or a hospital in Bangladesh, reading on a phone from a shared Facebook link or on a desktop at the office, deciding whether LofiCare can run their whole facility and whether to book a demo.

Secondary: an independent doctor with one or more chambers who wants the booking line and the serial to stop living in an assistant's head, and who can start free on the appointment module today.

Supporting: a patient who wants to book a doctor without a phone call, in Bangla or English.

## Product Purpose

LofiCare is an 18-module hospital and diagnostic centre management platform built for Bangladesh: patients, doctors and referrers, billing, samples and reports, imaging, inpatient, pharmacy, workforce, analytics, on one connected record. The appointment module is live and free to start; the rest is early access and opens through a demo conversation. Success for this site is facility demo requests (split diagnostic centre versus hospital) and doctor trial starts; patient find-your-doctor clicks are a supporting conversion.

## Positioning

Not a chamber app. The complete platform for the whole facility, built for Bangladesh: local workflows, local payment rails, Bangla and English, data held in the country, an append-only audit trail, and diagnostics depth that matches how centres earn (referrer earnings, barcoded samples, verification before release, fast report delivery). Global enterprise systems are not built for a Chittagong diagnostic centre; local tools are built for one doctor's desk. And you can start today, free, on the one module that touches every patient.

## Capabilities

Live today: LofiCare Appointments (online booking, queue, front desk, public booking link, reminders). Early access, defined and being built: the other 17 modules listed in the brief §7.4 by tier (Core, Diagnostics, Clinical, Hospital, Supply, Operations, Engagement, Insight).

## Constraints

- Only the appointment module may be shown as available; every other module is "Early access". No fabricated screenshots, statistics, user counts, testimonials or client logos.
- No fixed platform price and no appointment price that can rot. Anchors: "start free" and "less than three patients a month".
- No HIPAA or SOC2 claims. No red call to action. No em dashes anywhere. No filler words (delve, leverage, seamless, robust, elevate, unleash, next-gen, revolutionize).
- Mobile first at 360 to 390px, fast on a mid-range Android on 4G, WCAG AA, 44px tap targets, reduced motion respected.
- English primary with a real Bangla layer: patient section, booking flow, primary CTAs, header, footer, sticky bar, form labels, trust and compliance lines.
- Data promise: patient data stays in Bangladesh, so the site's own hosting region is a documented decision.

## Terminology

LofiCare (the brand and platform, one word). LofiCare Appointments (the live module). The LofiCare platform (the facility product). Diagnostic centre, hospital, chamber, referrer, serial (the queue number), front desk.

## Evidence

True today: built in Bangladesh; patients' data stays in Bangladesh; the platform is defined as an 18-module system with appointments live. Not yet available: testimonials, user counts, founding-cohort numbers, no-show figures. Proof at launch leads with the founder story and the Bangladesh-built promise.

## Assets

`brand/loficare-mark.png` (aqua gradient mark, transparent), `brand/loficare-lockup-dark.png` (mark and wordmark on near-black teal), the creative brief in `docs/brief/`. Binding visual constraint volunteered by the user: the palette derives from the final logo, not from the brief's blue.

## Voice

Plain, confident, credible, short sentences. Concrete specifics over superlatives. Each claim defensible.

## Open decisions (assumed defaults, confirm at the checkpoint)

Founder cohort sizes (copy avoids numbers); demo channel (form plus WhatsApp plus phone); find-your-doctor destination (`/patients/how-it-works` until a directory exists); contact numbers and domain (placeholders); which Bangla strings beyond the mandatory set ship in this release (English fallback, marked).
