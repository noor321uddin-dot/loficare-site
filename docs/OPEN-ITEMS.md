# Open items

Everything that ships marked as a placeholder or awaits the LofiCare team. Build prompt section 16.

| Item | Where in code | Who resolves it |
|---|---|---|
| Bangladeshi phone number and WhatsApp number | `CONTACT_PHONE`, `CONTACT_WHATSAPP` in `.env`; links carry `data-placeholder="contact"` | LofiCare team |
| Domain | `SITE_URL` in `.env`, `site` in `astro.config.mjs` | LofiCare team |
| Outbound webhook (GoHighLevel inbound webhook URL) | `LEAD_WEBHOOK_URL` | LofiStack ops |
| SMTP for lead emails | `SMTP_URL`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | LofiStack ops |
| Analytics domain | `ANALYTICS_DOMAIN`; the consent banner and the Plausible-compatible loader only activate when it is set | LofiStack ops |
| Facebook link preview test | after deploy, run the Sharing Debugger on `/` and `/bn/` and paste into a test post; steps in `docs/reports/seo-check.md` | LofiStack ops |
| Hosting region | `compose.yaml` volume; the data promise makes this a decision | LofiCare team |
| Real screenshots of the appointment module | replace the chrome of the booking widget in `src/components/sections/Appointments.astro` | LofiCare product |
| Sample doctor booking link `loficare.app/dr-rahman` | `src/components/sections/Doctors.astro` | LofiCare product |
| Real photographs of Bangladeshi facilities and chambers | no photo slots ship in this release by decision; add when real photos exist | LofiCare team |
| Founding-cohort line and testimonials | `Trust.astro` (line only when true), `Cohorts.astro` empty slots | LofiCare team |
| Privacy notice and terms of use | `src/content/legal.ts`; drafts at `/privacy` and `/terms` with every placeholder in brackets and highlighted (legal entity, addresses, emails, hosting region, processors, retention periods, response time, supervisory authority, governing law and court, notice period, liability wording); the Bangla route carries summaries and needs a full translation after review | Legal, then native reviewer |
| Native review of every Bangla string | `src/i18n/bn.json`; `npm run check:i18n` lists the 114 keys still falling back to English | Native reviewer |
| Module names in Bangla | `src/components/sections/Platform.astro` (English only) and `Hero.astro` tile titles | Native reviewer |
| Real module statuses | only appointments is "Available now"; move a badge only with the team's confirmation | LofiCare product |
| LCP under 2.5 s on simulated slow 4G | 2.9 s today with a performance score of 92; next levers are a smaller Latin subset for the hero headline and loading GSAP after first paint | Build |
| Test database | `data/leads.db` holds test rows; delete before the first deployment | Build |
