# CONTINUE-HERE — Emcan Group website (session handoff)

Read this first if you are a fresh session. It tells you exactly where the build is, what
must happen first, and how the operator wants to proceed. `CLAUDE.md` and the memory index
(auto-loaded) are the other sources of truth — read those too, especially the memory files
linked throughout this doc.

---

## 1. Status — much further along than the old Phase 0–6 framing below suggests

The cinematic is no longer greybox — **all 5 chapters run on real Higgsfield-generated
footage**, the corporate homepage has grown well beyond Phase 4, and a full honest
content/UX audit has just been done. Read these memory files for the detailed trail (in
rough chronological order):

- `cinematic-real-assets-integrated` — the anchor→5-states→Kling pipeline, config-only wiring.
- `native-binding-gatekeeper-fix` — if `next dev`/`build` fail with native `.node` binding
  errors on this machine (Node 26/macOS), this is the fix.
- `feedback-calm-trustworthy-tone` — **standing quality bar**: the whole site must feel calm
  and build trust in 5 seconds. Applies to every future change, not just the intro.
- `pending-intro-sequence-and-billboard-fix` — the Al Omran billboard realism fix and the
  Higgsfield-generated "4 companies → Emcan Group logo" intro video are both shipped
  (`public/intro/emcan-reveal.{mp4,webm}` + poster, wired into `LoadingScreen.tsx`).
- `scrolltrigger-timing-and-raf-preview-trap` — if you add another scroll-reveal section,
  read this first (real GSAP timing bug + a hard rule: never gate production logic on
  `requestAnimationFrame`, it can genuinely never fire in a backgrounded/hidden tab).
- `prelaunch-devnote-leaks-and-honest-audit` — **read this one fully before touching
  anything.** It's the source for §2 below.

Since Phase 6, the following also landed (not yet reflected in any commit — **there is no
git repo yet**, see §5):
- Real leadership section (`components/sections/Leadership.tsx`) — Chairman + 4 directors,
  real bios/photos, sourced from the live emcan.sa production site.
- Real company milestones/timeline (`components/sections/Milestones.tsx`) — now dynamic
  (scroll-triggered reveal + a filling rail), 1980s→Today.
- Real head-office contact details (address/phone/email/hours) in `lib/config.ts`
  (`CONTACT`), wired into `ContactForm.tsx` and `Footer.tsx`.
- Rama Technology's "Control" chapter got a full real HTML/CSS MES/IoT dashboard
  (`RamaDashboard.tsx`) — live-looking OEE/line-status/sensor readouts, clearly labelled
  "illustrative," RTL-correct, its stray always-visible disclaimer bug is fixed.
- The Al Omran (build) and Modern Energy (power) chapters now have the real company logos
  baked into the scene (hoarding board / genset badge) with a realistic weathered look —
  no longer flat "pasted decal" AI look.
- An opening intro video: the 4 company logos calmly converge into the Emcan Group logo,
  paired with the text hook "Four specialized companies. One integrated industrial
  solution." — the very first thing every visitor sees.

Stack pinned: Next `15.5.19`, React 19, Tailwind 3.4, next-intl 4, gsap 3.13, lenis 1.1,
motion 11. Node 26 locally (needs the native-binding fix — see memory).

---

## 2. FIRST TASK — clean up 3 internal dev-notes leaking onto the live site — ✅ DONE (2026-07-04)

Removed `footer.reviewNote`, `stats.note`, `clients.note` (JSX + both locale JSON keys).
Verified: EN/AR key parity (340=340), `npm run typecheck` clean, clean `npm run build`, SSR
`curl | grep` for all three strings on `/en` and `/ar` returns nothing.

---

## 3. SECOND TASK — the rest of the honest-audit findings — ✅ RESOLVED (2026-07-04)

All four settled with the operator:

- **Stats.** Updated to match emcan.sa's own public claims: `04 companies / 20+ years / 500+
  projects / 100+ clients` (was `04 / 13 sectors / 15+ / KSA`). Changed in `content/group.ts`
  `STATS` + both locale files' `stats.items`.
- **Client logos.** ✅ Done — 13 of 14 real client logos sourced from official sources,
  downloaded to `public/logos/`, wired into `Credentials.tsx` (white-chip rendering so mixed
  logo color schemes all stay legible). Tamer falls back to text (site is bot-protected,
  no clean official logo found). See [[client-logos-sourcing]] for full details.
- **Domain.** Canonical = **`experience.emcan.sa`** (not `emcangroup.com.sa`/`.com`/`emcan.sa`
  bare). Updated `SITE.domain`/`SITE.url` in `lib/config.ts`, and fixed a hardcoded `www.`
  prefix in `Footer.tsx` that would've produced the wrong `www.experience.emcan.sa`.
- **Pepsi Mega Factory mention.** Operator confirmed: keep as-is, already public on emcan.sa.

**Important correction from the operator, read [[experience-subdomain-is-additive-not-replacement]]:**
`experience.emcan.sa` is a **new, additional** site — it does **not** replace the existing
live `emcan.sa` production site, which keeps running unchanged. Factor this into §4 below:
the deploy is a subdomain add-on, not a cutover, and the existing site/DNS must not be
touched.

---

## 4. THIRD TASK — deploy to `experience.emcan.sa` via cPanel (operator has cPanel access)

**Do this interactively, one step at a time — the operator explicitly asked not to get a
full guide dumped at once.** Do not write a DEPLOYMENT-GUIDE.md and call it done; walk them
through it live.

Important context to establish before the first step:
- This is a **Next.js 15 app with SSR** (`/api/contact` is a dynamic route; `next-intl`
  needs middleware for locale routing) — it is **not** a static site, so a plain
  upload-the-files-to-`public_html` approach will not work as-is. The deployment method
  depends entirely on what the operator's cPanel host actually supports:
  - If the host offers **"Setup Node.js App"** (Phusion Passenger) — this is the
    straightforward path: Next.js can run there in standalone/production mode.
  - If the host is **static-hosting only** (no Node.js App support) — a static export
    (`next export` / `output: 'export'`) would be needed, which **breaks** the `/api/contact`
    route (would need to point the form at the Apps Script endpoint directly from the
    client, bypassing the Next.js API route) and needs care with `next-intl` middleware
    (would need to switch to a build-time/static locale strategy). Don't assume this path
    without confirming with the operator first — it's a real architecture change, not just
    a deploy config change.
  - **First step in the new session: ask the operator to check their cPanel dashboard for
    a "Setup Node.js App" (or similar) option, and what Node.js versions it lists.** That
    single answer determines everything else about how this proceeds.
- Environment variables the app needs, wherever it runs (from `grep -rn "process\.env\."`
  across `lib/` and `app/`):
  - `NEXT_PUBLIC_SITE_URL` — should become `https://experience.emcan.sa` (or whatever the
    final canonical domain is — resolve §3's domain question first).
  - `NEXT_PUBLIC_ANALYTICS_ID` — optional, analytics stay disabled without it.
  - `LEADS_ENDPOINT_URL` — **required** for the contact form to actually deliver leads (the
    Apps Script Web App URL — see `apps-script/Code.gs`).
  - `LEADS_SHARED_SECRET` — optional shared secret for that endpoint.
  - `.env.example` in the repo root currently exists but is **empty** — worth filling in
    with these four keys (names only, no real values) as part of this task.
- Repo is **not a git repository yet**. cPanel's own "Git Version Control" feature is one
  legitimate path (push from local → pull on server), but isn't required — confirm what the
  operator actually wants (git-based deploy vs. manual build-and-upload) rather than
  assuming.
- **Never skip hooks, force-push, or run destructive git commands without explicit
  confirmation** — standard discipline, applies doubly once this touches a live production
  host with real DNS.

---

## 5. Locked decisions (do not relitigate)

- **Brand = the client's real identity.** Type: **Montserrat** (EN) + **Tajawal** (AR).
  Palette: Gray `#5a5c5f`, Royal Green `#299617`, Bright Blue `#69aadd`, Harvest Gold
  `#d8a93a`, Golden Beige `#ddbe6c`. Per-company accent: Consultants=beige, Al Omran=gold,
  Modern Energy=green, Rama=blue. Source: `_brand-source/Emcan Group Idnetity Draft 2.pdf`.
- **Real data, never fabricated.** `_brand-source/Emcan Group Profile.pdf` + the live
  emcan.sa site (audited this session, see memory) are the sources. Never invent facts,
  figures, clients, or awards — use clearly-marked editable config instead, and if
  something must stay a placeholder, it must read as *placeholder* only to the operator,
  never as live client-facing copy (this is exactly what task 1 above fixes).
- **Cinematic media is real Higgsfield-generated footage now**, config-wired via
  `CINEMATIC_CHAPTERS[].source` in `lib/config.ts` — see the memory files in §1 for the full
  production pipeline if more scenes ever need regenerating.

---

## 6. Working discipline (unchanged, still applies)

1. **Bash sandbox is read-only.** Filesystem-mutating commands (`mkdir`, `mv`, `rm`, `npm
   install`, `git …`) need `dangerouslyDisableSandbox: true`. Write file *contents* with
   Write/Edit tools.
2. **Never run `npm run build` while `next dev` is running** — corrupts the dev `.next`.
   Discipline: stop dev/preview server → kill port 3000 → `npm run build` → `rm -rf .next`
   (retry the rm if build workers still hold a lock) → restart dev.
3. **Headless-preview limits**: the preview tab is treated as *hidden* — `requestAnimationFrame`
   may never fire at all (not just throttled — see the ScrollTrigger memory file for a case
   where this caused a 30s tool hang), and **screenshots always reset scroll to 0** (can't
   capture below-the-fold content). Verify with **SSR `curl | grep`** (works great — extract
   full page text with a quick python tag-strip, this is how the honest-audit findings were
   found), **`preview_eval`** for DOM/computed-style assertions, and **screenshots only for
   at-top states**. Never gate production code timing on rAF — use `load`/timeouts instead.
4. **Match codebase style.** Server Components by default; `'use client'` only when needed
   (refs, browser APIs, GSAP). Logical CSS props (`ms/me/ps/pe/start/end`), never
   `ml/mr/left/right`. Animate only transform/opacity/clip. No `@typescript-eslint/*`
   eslint-disable comments (not registered here, errors the build). EN/AR key parity must
   stay exact after any messages/*.json edit.
5. **Never fabricate** company facts/figures/clients — see §5.

---

## 7. How to resume in a fresh session

Open a new session in this project dir (`CLAUDE.md` + the memory index load automatically)
and send:

> Continue the Emcan Group website. Read `docs/CONTINUE-HERE.md` for full state. Start with
> §2 (remove the 3 internal dev-notes leaking into live copy), verify clean (parity +
> typecheck + build + SSR grep for the removed strings), then walk through §3's open
> questions with me one at a time. Once that's settled, help me deploy to
> `experience.emcan.sa` via cPanel — go step by step, don't dump a full guide, and start by
> asking me what my cPanel's Node.js hosting options actually look like.

That's all it needs — the discipline and full decision trail live in `CLAUDE.md`, memory,
and this file.
