# CLAUDE.md — Emcan Group website

Conventions and guardrails for working in this repo. Read before editing.

## What this is
A cinematic industrial marketing site for **Emcan Group** (Saudi industrial group, 4 companies).
The homepage is a single pinned cinematic scroll journey — **Design → Build → Power → Control** —
followed by a premium corporate homepage. Quality bar: top global digital agency. Expensive through
discipline, not effect-stacking.

## Stack (do NOT change without asking)
- **Next.js 15** App Router, **TypeScript**, React Server Components by default.
- **Tailwind CSS v3** with design tokens as CSS custom properties (`app/globals.css`). No magic numbers.
- **Lenis** smooth scroll, driven by **GSAP's ticker on one rAF loop** (`components/system/LenisProvider.tsx`).
- **GSAP + ScrollTrigger (+ SplitText)** for choreography. **Motion** (`motion/react`) for component micro-interactions.
- **next-intl** for `/en` + `/ar` locale routing and RTL.
- Media: `next/image`; cinematic media is externally hosted (CDN), referenced via `lib/config.ts`. No in-browser 3D.
- Lead capture: `POST /api/contact` → forwards to a Google Apps Script endpoint (`/apps-script/Code.gs`).
- **No** database, CMS, auth, or extra UI libraries (no MUI/Chakra/shadcn). This is a bespoke system.

## Design system (the source of truth)
- Tokens: `app/globals.css` (`:root`). Tailwind maps them in `tailwind.config.ts`.
- **Official Emcan palette** — Gray `#5a5c5f`, Royal Green `#299617`, Bright Blue `#69aadd`,
  Harvest Gold `#d8a93a`, Golden Beige `#ddbe6c`. Neutrals extend Gray into a cinematic dark ramp.
- **Type** — English **Montserrat**, Arabic **Tajawal** (self-hosted via `next/font`, `lib/fonts.ts`).
- Per-company accent: Consultants=beige (Design), Al Omran=gold (Build), Modern Energy=green (Power),
  Rama=blue (Control). See `lib/config.ts` (`COMPANIES`, `CHAPTER_ACCENT`).
- **Art-direction bans:** no cartoon/low-poly 3D, neon, glow spam, glassmorphism overuse, cheap gradients,
  everything-as-a-floating-card, bouncy/elastic/spinning easing, generic icon grids as primary content,
  stock-photo clichés, or fake data of any kind.

## Motion rules
- All choreography goes through `lib/motion.ts` (named presets + Lenis config). Don't re-improvise per component.
- Animate **only** `transform`, `opacity`, and `clip-path`. Never animate layout properties.
- Primary scrub technique = image-sequence on `<canvas>` (preload-decoded frames). Pinned `<video>` only for play-through beats.
- One rAF loop; pause rendering on `document.hidden`; respect `prefers-reduced-motion` (static keyframes + fades, all copy/CTAs preserved).
- Mobile: design the mobile story path, don't just shrink desktop.

## Conventions
- Use `@/…` import alias (repo root). Use locale-aware nav from `lib/i18n/navigation.ts`, never bare `next/link`.
- Server Components by default; add `'use client'` only when needed (interaction, refs, browser APIs).
- All user-facing copy lives in `messages/{en,ar}.json`. Arabic is professional placeholder — **mark for editorial review**.
- Match surrounding code style. Comment the *why*, not the *what*.

## Hard guardrails (ask the operator first)
- Changing the stack or adding any dependency beyond those already in `package.json`.
- Inventing company facts, figures, clients, awards, certifications, or project values.
  Use clearly-marked **editable config/placeholders** instead. Real data lives in `_brand-source/` (brand guide + profile PDF).
- Anything that would weaken an acceptance criterion (§11 of the brief).

## Acceptance bar (must hold)
Lighthouse mobile: Perf ≥ 85, Best Practices 100, SEO 100, A11y ≥ 95. Zero console errors. No horizontal
overflow 320–2560px. CLS < 0.1. Keyboard operable end-to-end with visible focus. SSR OG + JSON-LD. Every
config asset has a fallback; no dead buttons; no lorem ipsum.

## Commands
```bash
npm run dev        # local dev (http://localhost:3000 → redirects to /en)
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Layout of the repo
See the brief (§3) and the directory tree. Key files: `lib/config.ts` (data + flags),
`lib/motion.ts` (motion system), `app/globals.css` (tokens), `lib/i18n/*` (routing),
`components/system/*` (providers + fallbacks). Build proceeds in **phases with checkpoints** — see the
brief §14. Stop at each checkpoint.

## Build status (resuming?) → read `docs/CONTINUE-HERE.md` first
**Phases 0–6 are done and committed on `main`** (scaffold → design system/nav → cinematic
engine greybox → chapter copy → corporate sections from REAL profile data → contact form +
Apps Script → i18n/RTL/persistence). **Remaining: Phase 7 (demo/debug panel + analytics
hooks), Phase 8 (Lighthouse/a11y hardening + `/docs` + replacement checklist).**
`docs/CONTINUE-HERE.md` has the full state, file map, and Phase 7–8 specs.

## Working discipline (the precision — follow exactly)
- **Phased checkpoints:** build a phase → verify → commit (end message with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`) → summarize → **STOP for
  operator "proceed."** Don't skip ahead.
- **Bash sandbox is read-only here:** filesystem-mutating commands (`mkdir`/`mv`/`rm`/
  `npm install`/`git …`) need `dangerouslyDisableSandbox: true`; write file contents with
  the Write/Edit tools.
- **Never `npm run build` while `next dev` is running** — it corrupts the dev `.next`
  (`Cannot find module './vendor-chunks/…'`). To build: stop the dev server → kill port
  3000 → `npm run build` → `rm -rf .next` (kill `next build`/`jest-worker` and retry if
  `.next/types/*` is briefly locked) → restart dev.
- **Headless-preview limits:** the preview tab is treated as hidden (throttled rAF → GSAP
  lags; CSS transitions pause) and **screenshots reset scroll to 0** (can't capture below
  the fold). Verify via SSR `curl|grep`, `curl` API tests, and `preview_eval` (DOM/state +
  canvas pixel sampling); screenshots only for at-top states. Never `await
  requestAnimationFrame` in `preview_eval` (hangs). If the preview context detaches after
  reload/navigation, `preview_stop` then `preview_start`.
- **Style:** Server Components by default; logical CSS props (`ms/me/ps/pe/start/end`);
  directional glyphs use `rtl:rotate-180`; animate only transform/opacity/clip; static
  internal links use the locale-aware `Link` (not `<a>`); **no `@typescript-eslint/*`
  eslint-disable comments** (those rules aren't registered → the comment itself errors the
  build).
