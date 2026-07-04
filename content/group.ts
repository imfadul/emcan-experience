/**
 * Group-level data. Real where sourced from the company profile; numeric stats are
 * EDITABLE config grounded in that profile (confirm exact figures with the client —
 * never invent). Labels/descriptions live in messages/*.json so they translate.
 */

/** Integrated capability pillars (profile: "Comprehensive End-to-End Solutions"). */
export const CAPABILITY_PILLARS = [
  'engineering',
  'construction',
  'smartManufacturing',
  'coldStorage',
  'smartBuilding',
] as const;

/** Industrial sectors served (profile: "Our Experiences"). */
export const SECTORS = [
  'industrial',
  'logistics',
  'energy',
  'infrastructure',
  'coldStorage',
  'smartManufacturing',
  'controlRoom',
  'airport',
  'port',
  'foodBeverage',
  'pharmaceutical',
  'chemicals',
  'automotive',
] as const;

/** Group strengths (profile: "Our Strengths"). */
export const STRENGTHS = [
  'inHouse',
  'optimalDesign',
  'standards',
  'process',
  'logistics',
  'legislation',
  'collaboration',
  'international',
  'epc',
] as const;

/** The four-stage delivery lifecycle (Design → Build → Power → Control). */
export const LIFECYCLE = ['design', 'build', 'power', 'control'] as const;

/**
 * Headline figures. EDITABLE — matches the figures emcan.sa states publicly
 * (20+ years, 500+ projects, 100+ clients), plus the four-company structure.
 */
export const STATS: { id: string; value: string }[] = [
  { id: 'companies', value: '04' },
  { id: 'years', value: '20+' },
  { id: 'projects', value: '500+' },
  { id: 'clients', value: '100+' },
];
