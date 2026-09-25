# Backend tests, 2026-09-26

Run with curl and node against the dev server at 127.0.0.1:4321 (Astro dev, Node adapter). Times are UTC from the server clock.

| # | Test | Request | Result |
|---|---|---|---|
| 1 | Health | `GET /api/health` | `{"ok":true,"db":true,"config":{"webhook":false,"email":false,"turnstile":false,"analytics":false},"leads":0,"spam":0,"pendingDeliveries":0}` |
| 2 | Valid demo, JSON | name, facility, facility_type diagnostic_centre, role, phone `01712 345678`, branches 2-3, ts 6 s old | 200 `{"ok":true,"id":1,"duplicate":false,"redirect":"/thank-you?form=demo"}`; stored phone `+8801712345678` |
| 3 | Empty demo, language bn | `{}` | 400 with five field errors in Bangla: name, facility, facility_type, role, contact |
| 4 | Bad phone and email | phone `12345`, email `not-an-email` | 400 `{"phone":"Enter a Bangladeshi phone number, like 01712 345678.","email":"Enter a valid email address."}` |
| 5 | Honeypot filled | valid fields plus `website=http://spam` | 200 ok (bots are not told), stored with `spam = 1`, no delivery queued |
| 6 | Duplicate phone within 24 h | same phone as test 2 | 200 `duplicate: true`, stored with `duplicate = 1` |
| 7 | Form post without Origin header | curl `--data`, Accept text/html | 403 from Astro's origin check. Browsers always send Origin, so this only blocks non-browser posts |
| 7b | Form post with Origin, rate-limited key | trial, contact `01912345678` | 303 to `/bn/#trial` (the failure redirect; the trial key was already over its limit from test 9) |
| 7c | Invalid demo form post with Origin | `name=A` | 303 to `/#demo` |
| 7d | Valid demo form post with Origin | full fields, email only | 303 to `/thank-you?form=demo` |
| 8 | Trial submitted 0 ms after ts | contact `dr.karim@example.com` | 200 ok, stored with `spam = 1` (minimum fill time 2.5 s) |
| 9 | Rate limit | 10 trial posts in a row from one IP | nine 200s then 429 on the eleventh trial request of the window (limit 10 per 10 minutes per form) |
| 10 | Stored rows | `SELECT id, form, phone, email, duplicate, spam FROM leads` | 13 rows: ids 2 and 4 spam, id 3 duplicate, phones normalized to E.164 |
| 11 | Export | `npm run leads:export -- data/test-export.csv` | `13 lead(s) written`, UTF-8 with BOM, 18 columns |
| 12a | Webhook delivery | local receiver on 127.0.0.1:4599, `queueAndDeliver(lead 1)` | `{tried:1, sent:1}`; receiver got the flat payload with 16 keys, phone `+8801712345678` |
| 12b | Failed delivery | webhook URL `http://127.0.0.1:9/hook` | row `status failed, attempts 1, last_error "fetch failed"` |
| 12c | Retry | `runPending` with the good URL | row `status sent, attempts 2, delivered_at set`; pending left 0 |
| 13 | Health after | `GET /api/health` | `leads 11, spam 2, pendingDeliveries 0` |
| 14 | Thank-you routes | `/thank-you?form=demo`, `/bn/thank-you?form=trial` | 200, 200 |

Gates after the phase: `check:copy` 0 violations over 8 files (built HTML included), `check:contrast` 18 of 18, `check:i18n` ok, `astro check` 0 errors, `astro build` 7 prerendered routes plus the three server endpoints.

Notes. Email delivery was not exercised (no SMTP in the test environment); it shares the delivery and retry path with the webhook, which was. Turnstile was not exercised (off by default). The test database is `data/leads.db`, ignored by git; delete it before the first real deployment.
