/**
 * THE shared motion system. One Lenis config + named GSAP timeline presets so
 * choreography is governed and consistent across every cinematic chapter and
 * reusable on sibling brands later. Do not re-improvise animations per component.
 *
 * Easing is controlled and restrained — no bounce, elastic, or spin (brief §1).
 */
import type { LenisOptions } from 'lenis';

/* ---------------------------------------------------------------------------
   TOKENS
   ------------------------------------------------------------------------- */
export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
} as const;

/** GSAP-compatible cubic-bezier easings (match Tailwind's transition tokens). */
export const EASE = {
  inOutQuart: 'power4.inOut',
  outExpo: 'expo.out',
  outQuart: 'power3.out',
  inQuart: 'power3.in',
} as const;

/* ---------------------------------------------------------------------------
   LENIS
   ------------------------------------------------------------------------- */
export const lenisOptions: LenisOptions = {
  // Tuned for a heavy, controlled industrial feel — never floaty.
  lerp: 0.1,
  duration: 1.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  // Native momentum on touch reads better than smoothing on mobile.
  syncTouch: false,
};

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---------------------------------------------------------------------------
   GSAP REGISTRATION (client-only, idempotent)
   ------------------------------------------------------------------------- */
let registered = false;

/**
 * Registers GSAP plugins exactly once. Returns the gsap namespace + ScrollTrigger.
 * Imported dynamically so GSAP never lands in the server bundle.
 */
export async function registerGsap() {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/**
 * Loads GSAP + the (free) SplitText plugin for scene copy reveals. Dynamic so
 * SplitText only ships to clients that run the cinematic, not the Lenis path.
 */
export async function loadScene() {
  const { gsap } = await import('gsap');
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(SplitText);
  return { gsap, SplitText };
}

/* ---------------------------------------------------------------------------
   NAMED TIMELINE PRESETS
   Centralised choreography. Each returns a paused GSAP timeline the caller can
   attach to a ScrollTrigger or play directly. Implemented progressively across
   phases; signatures are stable from Phase 0.
   ------------------------------------------------------------------------- */

type Gsap = typeof import('gsap').gsap;
type Target = gsap.TweenTarget;

interface RevealOpts {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

/** Settle-up reveal: opacity + small Y translate (transform/opacity only). */
export function revealUp(gsap: Gsap, targets: Target, opts: RevealOpts = {}) {
  const { y = 24, duration = DURATION.base, stagger = 0.08, delay = 0 } = opts;
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    { autoAlpha: 1, y: 0, duration, stagger, delay, ease: EASE.outExpo },
  );
}

/** Line-draw: scaleX a hairline from origin (blueprint / progress rails). */
export function lineDraw(gsap: Gsap, targets: Target, duration = DURATION.slow) {
  return gsap.fromTo(
    targets,
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, duration, ease: EASE.inOutQuart },
  );
}

/** Vertical counterpart to lineDraw: scaleY a rail from its top (timelines). */
export function lineDrawY(gsap: Gsap, targets: Target, duration = DURATION.slow) {
  return gsap.fromTo(
    targets,
    { scaleY: 0, transformOrigin: 'top center' },
    { scaleY: 1, duration, ease: EASE.inOutQuart },
  );
}

/** Logo-settle: a logo arrives with restraint (no spin/bounce). */
export function logoSettle(gsap: Gsap, target: Target) {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: 16, filter: 'blur(6px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: DURATION.slow, ease: EASE.outExpo },
  );
}
