/**
 * Central configuration: company data, feature flags, asset references, env reads.
 * Cinematic media is externally hosted (CDN) and referenced here — never bundled.
 * Real figures/clients are NEVER invented; placeholders are explicitly marked.
 */

export type CompanyId = 'consultants' | 'alomran' | 'energy' | 'rama';
export type Chapter = 'design' | 'build' | 'power' | 'control';

export interface Company {
  id: CompanyId;
  chapter: Chapter;
  /** 01–04 lifecycle index */
  index: '01' | '02' | '03' | '04';
  /** Brand accent token name (maps to Tailwind color + CSS var) */
  accent: 'beige' | 'gold' | 'green' | 'blue';
  /** Web-ready logo in /public/brand */
  logo: string;
}

/**
 * The four companies in lifecycle order. Names/positioning copy live in the i18n
 * message catalogues (messages/*.json) so they translate; structural data lives here.
 */
export const COMPANIES: Company[] = [
  { id: 'consultants', chapter: 'design', index: '01', accent: 'beige', logo: '/brand/emcan-consultants.png' },
  { id: 'alomran', chapter: 'build', index: '02', accent: 'gold', logo: '/brand/emcan-alomran.png' },
  { id: 'energy', chapter: 'power', index: '03', accent: 'green', logo: '/brand/emcan-energy.png' },
  { id: 'rama', chapter: 'control', index: '04', accent: 'blue', logo: '/brand/rama-technology.png' },
];

/** Accent CSS values keyed by chapter — used to theme cinematic scenes. */
export const CHAPTER_ACCENT: Record<Chapter, string> = {
  design: 'var(--c-beige)',
  build: 'var(--c-gold)',
  power: 'var(--c-green)',
  control: 'var(--c-blue)',
};

/* ---------------------------------------------------------------------------
   CINEMATIC JOURNEY
   Five scrubbed chapters (Design → Build → Power → Completion → Control) plus a
   final group reveal. Frame counts are discrete image-sequence frames; the real
   `source` (CDN base URL) is filled in later — until then a procedural greybox
   source renders placeholder frames. See docs/ASSET-MANIFEST.md.
   ------------------------------------------------------------------------- */
export type CinematicChapterId = 'design' | 'build' | 'power' | 'completion' | 'control';
export type CinematicAccent = Company['accent'] | 'steel';

export interface CinematicChapter {
  id: CinematicChapterId;
  order: 1 | 2 | 3 | 4 | 5;
  accent: CinematicAccent;
  company?: CompanyId;
  /** Discrete frames on desktop / mobile (mobile is lighter per brief §6). */
  frames: number;
  framesMobile: number;
  /** Real image-sequence source; when absent the greybox procedural source is used. */
  source?: { baseUrl: string; ext: 'jpg' | 'webp' | 'png'; pad: number };
}

/**
 * Real cinematic frames live in /public/cinematic/<id>/NNN.webp, extracted from
 * the Kling camera-move passes (each pass chained from one locked "anchor" still,
 * so all five states read as the same building — Design blueprint → Build steel →
 * Power night → Completion daylight → Control blue-hour). The engine shares one
 * `source` per chapter across desktop/mobile, and mobile loads the first
 * `framesMobile` frames of that sequence — so `framesMobile` is kept equal to
 * `frames` here to play the FULL push-in on mobile (frames are light WebP);
 * lowering it would truncate the camera move before the final composition.
 */
export const CINEMATIC_CHAPTERS: CinematicChapter[] = [
  { id: 'design', order: 1, accent: 'beige', company: 'consultants', frames: 40, framesMobile: 40, source: { baseUrl: '/cinematic/design/', ext: 'webp', pad: 3 } },
  { id: 'build', order: 2, accent: 'gold', company: 'alomran', frames: 40, framesMobile: 40, source: { baseUrl: '/cinematic/build/', ext: 'webp', pad: 3 } },
  { id: 'power', order: 3, accent: 'green', company: 'energy', frames: 40, framesMobile: 40, source: { baseUrl: '/cinematic/power/', ext: 'webp', pad: 3 } },
  { id: 'completion', order: 4, accent: 'steel', frames: 48, framesMobile: 48, source: { baseUrl: '/cinematic/completion/', ext: 'webp', pad: 3 } },
  { id: 'control', order: 5, accent: 'blue', company: 'rama', frames: 40, framesMobile: 40, source: { baseUrl: '/cinematic/control/', ext: 'webp', pad: 3 } },
];

/* ---------------------------------------------------------------------------
   FEATURE FLAGS
   ------------------------------------------------------------------------- */
export const FLAGS = {
  /**
   * "continuous" → one master image sequence drives all chapters.
   * "chapters"   → five independent scenes. Both paths must work (see brief §6).
   */
  MEDIA_MODE: 'chapters' as 'continuous' | 'chapters',
  /** Master switch for the cinematic stage; falls back to static keyframes when off. */
  CINEMATIC_ENABLED: true,
} as const;

/* ---------------------------------------------------------------------------
   SITE
   ------------------------------------------------------------------------- */
/**
 * Real head-office contact details, sourced from the live emcan.sa production site.
 * `href` values are ready-to-use tel:/mailto: links.
 */
export const CONTACT = {
  address: 'Al Badriyah Building, Saud Al Faisal Street, Al Khalidiyah Dist., P.O. Box 7689, Jeddah 21472, Kingdom of Saudi Arabia',
  phone: { display: '+966 12 606 60 24', href: 'tel:+966126066024' },
  email: { display: 'info@emcan.sa', href: 'mailto:info@emcan.sa' },
  /** The day range is translated (messages: contact.info.hoursValue). */
  hoursTime: '8:00 AM – 5:00 PM',
} as const;

export const SITE = {
  name: 'Emcan Group',
  domain: 'experience.emcan.sa',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://experience.emcan.sa',
  /** Editable — replace with the official corporate contact when confirmed. */
  social: {
    handle: '@emcangroup',
  },
} as const;

/* ---------------------------------------------------------------------------
   ENV (server-only reads live in their route handlers; these are safe defaults)
   ------------------------------------------------------------------------- */
export const ENV = {
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? '',
  analyticsEnabled: Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID),
} as const;
