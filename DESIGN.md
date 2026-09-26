---
name: LofiCare
description: The queue board. A light room with one dark screen in it; numbers as facts, one warm colour that asks.
colors:
  ink-950: "#041A1A"
  ink-900: "#062626"
  ink-800: "#0B3534"
  aqua-400: "#40E8E0"
  aqua-300: "#67F1E9"
  aqua-200: "#A7FCF6"
  teal-700: "#0B6B67"
  teal-600: "#0E7C78"
  wash-100: "#D3F6F3"
  wash-50: "#EAFBFA"
  paper: "#F6FAFA"
  card: "#FFFFFF"
  slate: "#46605F"
  mist: "#D8E6E5"
  mist-on-ink: "#9CB7B5"
  marigold: "#F5871F"
  marigold-hover: "#E8801B"
  green: "#167A5C"
  red: "#C43B3B"
typography:
  display:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 40px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(26px, 3vw, 34px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(20px, 2vw, 22px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 19px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  bangla-body:
    fontFamily: "Anek Bangla Variable, Hind Siliguri, Noto Sans Bengali, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  bangla-heading:
    fontFamily: "Anek Bangla Variable, Hind Siliguri, Noto Sans Bengali, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 40px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  control: "10px"
  tile: "16px"
  board: "12px"
  pill: "999px"
spacing:
  gutter: "16px"
  gutter-wide: "24px"
  stack-xs: "6px"
  stack-sm: "12px"
  stack: "24px"
  stack-lg: "48px"
  section-mobile: "44px"
  section: "80px"
  container: "1140px"
components:
  button-primary:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.ink-950}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.marigold-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.teal-700}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  badge-available:
    backgroundColor: "{colors.card}"
    textColor: "{colors.green}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  badge-early-access:
    backgroundColor: "{colors.card}"
    textColor: "{colors.slate}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.tile}"
    padding: "20px"
  board:
    backgroundColor: "{colors.ink-950}"
    textColor: "{colors.aqua-200}"
    rounded: "{rounded.board}"
    padding: "14px 16px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "48px"
---

# LofiCare design system

## Overview

LofiCare is the hospital and diagnostic centre platform for Bangladesh, and this site sells it to facility owners first, doctors second, patients third. The visual world is the queue board: the waiting-room serial display every owner watches all day. On the site that becomes a light room with one dark object in it. The page is paper and wash; ink appears only where a screen would exist in life (the queue board inside the booking widget, the doctor's signboard, the record hub), and numbers are set as facts, tabular and one weight heavier than the text around them. One warm colour, marigold, does the asking. Aqua is the brand's light: it lives on the mark and on ink, never as text on paper.

Light is the default by the owner's decision, and the visitor may switch to dark; dark mode remaps the semantic roles onto the ink ramp instead of introducing a second palette. Every colour is a CSS custom property in `src/styles/tokens.css`; components never carry a raw hex.

## Colors

Strategy: committed. Teal carries the mark, the module system and the objects; paper and wash carry the reading sections; marigold is reserved for the single primary action on a screen.

- **Paper and wash** (`paper`, `wash-50`, `wash-100`): the page, alternating section grounds, tile fills.
- **Ink ramp** (`ink-950`, `ink-900`, `ink-800`): the dark objects on the light page and the whole page in dark mode. Never pure black.
- **Aqua ramp** (`aqua-400`, `aqua-300`, `aqua-200`): the mark's gradient, the lit appointment cross, and text or icons on ink. `aqua-400` on paper fails contrast for text and is used only for large shapes.
- **Teal** (`teal-700`, `teal-600`): links, headings accents and UI strokes on light surfaces. `teal-700` on paper measures 6.0:1, `teal-600` 4.8:1.
- **Slate and mist** (`slate`, `mist`, `mist-on-ink`): secondary text and hairlines, tinted from the teal hue, never neutral gray. `mist-on-ink` is the only secondary text on ink.
- **Marigold** (`marigold`, `marigold-hover`): primary buttons only, with an ink label; white on marigold fails contrast at 2.5:1.
- **Green** (`green`): only the "Available now" badge, always with a check icon and the words. Darkened from the brief's value to pass 4.5:1 on paper.
- **Red** (`red`): form errors and warnings only, never a call to action, never decoration.

Dark mode (`html[data-theme="dark"]`) remaps `--bg`, `--bg-alt`, `--fg`, `--fg-muted`, `--line`, `--accent`, `--accent-strong`, `--tile`, `--tile-line` and `--card` onto the ink and aqua ramps. Marigold, green and red keep their values.

## Typography

Two families, self-hosted and subset: Manrope Variable for every Latin role, Anek Bangla for Bangla. Basic Latin comes from a 14 KB Manrope subset with `font-display: optional`, preloaded, so headlines never wait on a swap; other Latin ranges use the full face with swap. Anek Bangla ships as static 700 and 400 instances (51 KB each) subset to the site's own text, preloaded on the Bangla route and added after load on the English route; Latin characters inside Bangla runs fall through to Manrope. Weights: 700 for display, headlines, titles, labels and numbers; 400 for body. Display tracks at -0.02em; Bangla never tracks.

Scale: display 32 to 40 px, headline 26 to 34 px, title 20 to 22 px, lede 17 to 19 px, body 16 px, label 14 px. Body line height 1.5; display 1.08; Bangla headings 1.4 so matras and descenders never clip, and Bangla body runs 17 px against the Latin 16. Measure stays between 46 and 72 characters (`.lede` 46ch, legal body 70ch). Numbers use tabular figures and weight 700 (`.num`).

No kicker or eyebrow labels above headings. Emphasis by weight and size only, never by gradient or a second family.

## Layout

- Container 1140 px, centered, 16 px gutters on phones and 24 px from 768 px. No horizontal scroll at 375 px or 1280 px (verified).
- Section rhythm: 44 px vertical padding on phones, 80 px from 768 px, grounds alternating paper and wash. More space above a heading than below it.
- Breakpoints as used: 480 (header demo button appears), 640 (form fields pair up), 768 (two-column sections, ring, sticky widget, sticky bar hidden), 900 (header quiet links, demo layout), 1024 (larger ring).
- Sticky header 68 px with a blurred paper ground; sticky bottom bar on phones with safe-area padding and a context-aware label.
- Layer scale, fixed: overlays 10, header 20, sticky bar 30, consent 40, dialogs 50.
- The hero band is capped at 720 px so the composition never floats; the queue board sits at up to 520 px on desktop and full width on phones.

## Elevation & Depth

The page is flat. Hierarchy comes from grounds (paper against wash, card against paper) and 1 px `mist` hairlines, not from shadows. Shadows exist only on things that float above the page or emit their own light: the consent box (`0 12px 32px rgba(4, 26, 26, 0.18)`, an offset and a soft blur) and the backlit signboard (inset aqua light, because a signboard is lit). Nothing glows on paper.

## Shapes

One radius system: 10 px on controls (buttons, inputs, toggles), 16 px on tiles and cards, 12 px on the board, pills (999 px) on chips, badges and the language toggle. The mark's tiles are squares with a 12-unit corner in a 1000-unit box. Borders are 1 px `mist` on cards and 1.5 px on controls; the "Available now" chip takes a green border, dashed borders mark honest empty slots.

## Components

- **Buttons**: primary (marigold, ink label), secondary (transparent, teal text, teal stroke), quiet (transparent, ink text, mist stroke). 48 px tall, 44 px minimum tap target, 3 px aqua focus ring, 1 px press translate. One primary per screen.
- **Badges**: `badge-ok` for the one live module, green outline with a check icon and the words; `badge-early` in mist for everything else. Never colour alone.
- **Chips**: pill, card ground, mist border; the live chip takes the green border.
- **Cards and tiles**: card ground, mist border, 16 px radius, 20 to 28 px padding. Cards only where elevation communicates hierarchy; lists use hairlines.
- **The board**: ink ground, aqua-200 text, `label` in mist-on-ink, `big` numbers at 40 px in aqua-400. The one dark object on the light page.
- **Forms**: label above input, helper below, error below in red text and a red border, radio choices as bordered pills that fill with wash when checked, 48 px inputs, honeypot off-screen.
- **Accordion**: native `details`, hairline between items, caret rotates when open.
- **Booking widget**: a real component with three states (pick, code, done), sample data labelled.
- **Queue board (hero)**: the waiting-room display as a component: ink ground, room rows, `now serving` numbers in aqua-400 stepping forward every few seconds on sample data, a clock and the next serials; static under reduced motion.
- **Assembly (platform)**: eighteen named SVG tiles, focusable, assembling into the mark on scroll with GSAP loaded lazily; the cross is lit and the caption names whichever tile is under the pointer or focus.
- **Specimen label (diagnostics)**: a white sticker with a real QR and a Code 39 strip for a sample id, beside a five-station rail whose fill follows the scroll.
- **Record ring (hospitals)**: spokes draw, departments with icons leave the record along their angle and settle, one pulse; on phones a hub card with a two-column chip grid.
- **Voices**: doctor quotes from `src/content/voices.ts` only; an honest empty state with three dashed places until real words exist.
- **Toggles**: language as a two-segment pill, colour mode as a 44 px icon button with sun and moon from Phosphor.
- **Icons**: Phosphor regular only, `currentColor`, 18 to 22 px inline.

## Do's and Don'ts

- Do keep marigold for the single most important action per screen; do keep the "Available now" badge on the appointment module alone.
- Do write numbers as facts: tabular, heavier, real units.
- Do keep one motion moment per section, exponential ease-out, and collapse everything to static under reduced motion.
- Do keep the page light and put ink only on objects; dark mode remaps tokens rather than restyling.
- Don't add eyebrows, section numbers, scroll cues, gradient text, glows on paper, hard offset shadows, emoji or hand-drawn icons.
- Don't use red for a call to action, and don't put aqua text on paper.
- Don't use an em dash anywhere, in copy, alt text or code comments.
- Don't paint an unbuilt module as available, and don't invent numbers, logos or quotes.
