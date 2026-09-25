# Decisions

Protocol: each role states a position, one rebuttal round, PM rules citing the non-negotiable. Tie-break order: honesty, mobile 4G performance, conversion clarity, craft ambition. Rulings marked "provisional" are shown as variants on the board so the user can overrule them.

| # | Decision | Options | Ruling | Reason | Reopens if |
|---|---|---|---|---|---|
| D1 | Theme | Light page with two mirrored ink bands vs fully dark vs light with a visitor toggle | Light by default, no ink bands, plus a light/dark toggle the visitor controls (user decision 2026-09-26) | The user set the theme: light, with the logo in its light colour, and a selectable color mode. FE-A argued to keep one ink band for the mark's glow; PM ruled the toggle gives the ink world to anyone who wants it and the light page stays one theme, which the taste rules require. The queue board survives as a component: a dark screen in a bright room | Never; user decision |
| D2 | Stack | Astro 5 + Node adapter vs Next.js + R3F | Astro | FE-B: zero JavaScript by default keeps first load under 90 KB; BE: one Node process, no framework server tax; FE-A conceded authoring speed is similar with a vanilla Three island; PM: performance is a conversion feature | A React-only dependency becomes essential |
| D3 | Hero technique | SVG/CSS assembly mandatory; WebGL tier as desktop enhancement | As stated | FE-A wanted WebGL on capable phones; FE-B: phones are the majority and the SVG tier must be the real experience; PM ruled on the 4G tie-break; WebGL ships at 768px+ only after the 50 fps benchmark | Benchmark passed 2026-09-26 (docs/reports/webgl-bench.md): the WebGL tier ships on capable desktops behind its runtime guard; phones keep the SVG tier |
| D4 | Book a demo mechanism | Inline `#demo` section with form + WhatsApp + phone vs slide-over | Inline section, provisional | BE: one form, one endpoint, one place to measure; FE-B: a slide-over on mobile fights the sticky bar; PM: the brief's §17.3 default | The user picks the channel-first variant on the board |
| D5 | Type pairing | Manrope + Anek Bangla; Figtree + Hind Siliguri; Hanken Grotesk + Noto Sans Bengali | Manrope + Anek Bangla, provisional | FE-B: both variable, both subset well, x-heights sit together, neither is an AI default; FE-A: Manrope's geometry echoes the mark's ring; PM: credible for a hospital buyer. The brief's Poppins/Plus Jakarta + Hind Siliguri stays as the safe exit | The user picks another pair on the board |
| D6 | Available-now badge | Calm Green with check + words vs ink-filled badge with pale aqua text | Calm Green, provisional | PM: the brief's honest-color rule wins; FE-B: green (hue 160) and aqua (hue 178) sit close, so the badge always carries the check icon and the words, never color alone | The user finds the green reads as brand on the board |
| D7 | Lead storage | Drizzle + better-sqlite3 vs `node:sqlite` built-in | `node:sqlite` | BE: zero native modules; Smart App Control on this machine blocks unsigned binaries, and a lead table needs no ORM; swap path to Turso/libSQL documented in README | The site moves to a serverless host |
| D8 | Direction choice mechanism | impeccable decision page vs a variants board | Variants board at `/variants` | The user asked for variations per section to give input; one board with two or three options per section is the checkpoint, and impeccable's concept roll seeds the hero directions on it | Done: the board was deleted on 2026-09-26 after the picks were ruled |

| D9 | Color mode toggle | Header icon button vs footer-only vs system preference only | Header icon button (sun/moon from the icon set) plus the same control in the footer; light on first visit regardless of the OS preference (the user set light as the default), the choice persists in localStorage, an inline script applies `data-theme` before first paint so there is no flash | BE: no cookie, no server involvement, one attribute; FE-B: 44px target, label announced, no layout shift when the label changes; FE-A: the mark glows on ink, so dark mode is worth offering, not forcing; PM: the user asked for it | Never; user decision |

| D11 | Fonts on the LCP path | Fontsource variable files with swap vs subsets with optional and static weights | Manrope basic-Latin subset (14 KB, `font-display: optional`, preloaded) declared after the full face so the headline never waits on a swap; Anek Bangla as two static weights (700 and 400, 51 KB each) built from the site's own Bangla text, inlined and preloaded on the Bangla route, added after load on the English route; GSAP loads after the load event | FE-B: the LCP element is the headline and its font swap was the LCP; BE: the subsets are reproducible by `npm run fonts`; PM: LCP went from 2.9 s to 1.4 s and 2.1 s | New Bangla copy outside `src/` or a third weight |
| D10 | AA token corrections | Keep the brief's hex values vs tune within hue | Calm Green #1F9D74 becomes #167A5C, Signal Red #D64545 becomes #C43B3B | check:contrast measured 3.26:1 and 4.16:1 on paper; the brief itself says hex values are a starting point and contrast is a hard requirement; hue and role are unchanged | Never |

## Board picks, ruled by the team on 2026-09-26

The user delegated the row picks to the team with three constraints: light theme, the logo in its light colour, a selectable color mode. Each row: FE-A and FE-B positions in a phrase, BE where it mattered, PM ruling.

| Row | Pick | Argument in one line |
|---|---|---|
| World | W-A The queue board | Assigned by the roll; on a light page the board becomes the one dark object, a screen in a bright room, which is exactly what it is in life. W-B declined: its hairline rows would fight the light page's calm. Its discipline donated: every number on the page is set as a fact, tabular and one weight heavier |
| Theme | Light, with toggle | D1 |
| Hero | H-1 Split, mark assembling right | H-2 needs an ink ground, which the user retired. H-3 puts the live module first but loses the pinned assembly; the live module gets the whole appointments section instead |
| Doors | D-1 Stepped tiles | Widths carry priority; D-2 is ink rows; D-3 hides two doors behind a tap |
| Trust | R-2 Bangla first | The one line that must be bilingual anyway; Bangla leading says built here in the language itself |
| Problem | P-1 Two columns and a joining line | FE-A wanted P-2's scattered slips; FE-B: absolute positioning at 360px is a layout risk; PM: the joining line is the page's second motion moment and it is the brief's own picture |
| Platform | G-1 Tier rows with chips | The only one of the three that reads on a phone with eighteen honest badges; G-3 keeps a place as a small legend beside the heading |
| Diagnostics | X-1 Flow stepper plus referrer statement | Clarity beat X-2's ambition on the tie-break; X-2 donates its barcode marks to the five steps |
| Hospitals | S-2 Ring of departments | A radial family the page otherwise lacks; collapses to a centered record card with stacked chips under 768px |
| Appointments | L-1 Sticky benefits plus live booking widget | The brief's four headlines intact and the only real product demonstration on the page, labelled sample data |
| Doctors | Q-2 The signboard | Local and specific; the QR is generated from the placeholder link, not drawn |
| Patients | U-2 The message thread | Proves no account, a code, a reminder, in the words the patient will actually receive; Bangla first |
| Data | C-1 Statement plus the ledger | The append-only promise shown, not described; rows labelled sample |
| Cohorts | F-1 Two cohort panels, honest empty slots | F-2 depends on a founder note nobody has written |
| Pricing | M-2 The ladder | Tells land-and-expand in the order it happens; no numbers |
| FAQ | A-1 One accordion | The six questions do not split cleanly by audience |
| Close | E-1 Form with channels beside it | One place to measure everything (D4) |
| Type | Y-1 Manrope + Anek Bangla | D5 |
| Badge | B-1 Calm Green with check and words | D6 |
| Sticky bar | K-2 Context-aware label | Each reader sees their own door; the two labels are sized to the longer one so nothing shifts |

Human checkpoint passed 2026-09-26: the user set the theme and delegated the picks. The hero is built next.
