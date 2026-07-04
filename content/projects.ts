import type { CompanyId } from '@/lib/config';

/**
 * Featured projects — REAL data sourced from the official Emcan Group company
 * profile (_brand-source/Emcan Group Profile.pdf). Names, clients, locations,
 * scope, BUA, and year are factual; nothing here is invented. Project imagery is
 * not yet available, so cards render editorially (see docs/ASSET-MANIFEST.md to
 * attach real renders/photography).
 */
export type ProjectSector =
  | 'logistics'
  | 'food-beverage'
  | 'pharma'
  | 'manufacturing'
  | 'chemicals'
  | 'infrastructure';

export type ProjectStatus = 'delivered';

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  sector: ProjectSector;
  scope: string;
  year: number;
  /** Built-up area, where stated in the profile. */
  bua?: string;
  companies: CompanyId[];
  status: ProjectStatus;
}

export const PROJECTS: Project[] = [
  { id: 'basamh-jeddah', name: 'Basamh Distribution Warehouses', client: 'Basamh', location: 'Jeddah', sector: 'logistics', scope: 'Detailed Design & Supervision', year: 2024, bua: '30,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'basamh-riyadh', name: 'Basamh Distribution Warehouses', client: 'Basamh', location: 'Riyadh', sector: 'logistics', scope: 'Detailed Design & Supervision', year: 2024, bua: '17,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'mpt-medical', name: 'MPT Medical', client: 'Tamer / Mölnlycke', location: 'Jeddah', sector: 'pharma', scope: 'Detailed Design & Supervision', year: 2023, bua: '10,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'reza-tissue', name: 'REZA Tissue Factory', client: 'REZA Hygiene', location: 'Saudi Arabia', sector: 'manufacturing', scope: 'Detailed Design & Supervision', year: 2024, bua: '6,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'nfic-luna', name: 'NFIC (Luna) — Industrial City 1', client: 'National Food Industries Co. (Luna)', location: 'Saudi Arabia', sector: 'food-beverage', scope: 'Detailed Design & Supervision', year: 2023, bua: '33,500 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'al-hatab', name: 'Al Hatab Bakery', client: 'Al-Hatab Bakery', location: 'Sudair', sector: 'food-beverage', scope: 'Detailed Design & Supervision', year: 2023, bua: '47,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'wared', name: 'Wared Logistics Complex — Admin & Operation', client: 'Wared Express (Zahid)', location: 'Jeddah', sector: 'logistics', scope: 'Detailed Design & Supervision', year: 2022, companies: ['consultants'], status: 'delivered' },
  { id: 'binzagr-coro', name: 'Binzagr Co-Ro Factory Expansion', client: 'Binzagr Co-Ro', location: 'Jeddah', sector: 'food-beverage', scope: 'Detailed Design', year: 2021, bua: '14,000 m²', companies: ['consultants'], status: 'delivered' },
  { id: 'sadafco', name: 'SADAFCO Depot', client: 'SADAFCO', location: 'Makkah', sector: 'logistics', scope: 'Design & Supervision', year: 2021, companies: ['consultants'], status: 'delivered' },
  { id: 'four-winds', name: 'Four Winds Saudi Arabia', client: 'Four Winds Saudi Arabia Ltd.', location: 'Saudi Arabia', sector: 'logistics', scope: 'Design & Supervision', year: 2021, companies: ['consultants'], status: 'delivered' },
  { id: 'tyre-recycling', name: 'Tyre Recycling Plant', client: 'Al Safwa Cement (for JESDC, Jeddah Municipality)', location: 'Jeddah', sector: 'infrastructure', scope: 'Design & Supervision', year: 2020, companies: ['consultants'], status: 'delivered' },
  { id: 'industrial-waste', name: 'Industrial Waste Plant', client: 'Al Safwa Cement (for Royal Commission, Yanbu)', location: 'Yanbu', sector: 'infrastructure', scope: 'Design & Supervision', year: 2021, companies: ['consultants'], status: 'delivered' },
  { id: 'clorox', name: 'Clorox Factory Extension', client: 'M.A. AbuDawood & Partners', location: 'Jeddah', sector: 'chemicals', scope: 'Design & Supervision', year: 2020, companies: ['consultants'], status: 'delivered' },
  { id: 'jotun', name: 'Jotun Factory Upgrades', client: 'Jotun Saudi Ltd. Co.', location: 'Jeddah / Khamis Mushayt', sector: 'chemicals', scope: 'Design & Supervision', year: 2020, companies: ['consultants'], status: 'delivered' },
  { id: 'al-shaeir', name: 'Al-Shaeir Pharma — Warehouse & Factory', client: 'Adel Ahmad Al-Shaeir Pharmaceutical Factory', location: 'Jeddah', sector: 'pharma', scope: 'Design & Supervision', year: 2018, companies: ['consultants'], status: 'delivered' },
];

export const PROJECT_SECTORS: ProjectSector[] = [
  'logistics',
  'food-beverage',
  'pharma',
  'manufacturing',
  'chemicals',
  'infrastructure',
];

/** Distinct locations for the location filter, in display order. */
export const PROJECT_LOCATIONS = Array.from(new Set(PROJECTS.map((p) => p.location)));
