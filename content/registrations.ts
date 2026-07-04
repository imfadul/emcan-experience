/**
 * Registrations, prequalifications, and clients — REAL, from the company profile.
 * Registration/prequalification bodies still render typographically. Clients have
 * real logos sourced from each company's own official site (see `public/logos/`);
 * `logo` is omitted where no confidently-official asset could be found, and the UI
 * falls back to the name typographically in that case.
 */

/** Statutory registrations (profile: "Registrations"). */
export const REGISTRATIONS = ['Ministry of Commerce & Industry', 'Saudi Council of Engineers'];

/** Authorities Emcan is prequalified by (profile: "Registrations"). */
export const PREQUALIFICATIONS = [
  'Balady',
  'MAWANI — Saudi Ports Authority',
  'MODON',
  'Amanat Jeddah',
  'KAEC',
  'Economic Cities & Special Zones Authority',
  'JEDCO — Jeddah Airports',
  'Royal Commission for Jubail & Yanbu',
];

/** Clients featured across the profile's project case studies. */
export const CLIENTS: { name: string; logo?: string }[] = [
  { name: 'Basamh', logo: '/logos/basamh.svg' },
  { name: 'Tamer Group' },
  { name: 'Mölnlycke Health Care', logo: '/logos/molnlycke.svg' },
  { name: 'REZA Hygiene', logo: '/logos/reza-hygiene.png' },
  { name: 'National Food Industries (Luna)', logo: '/logos/luna.png' },
  { name: 'Al-Hatab Bakery', logo: '/logos/al-hatab.png' },
  { name: 'Wared Logistics', logo: '/logos/wared-logistics.svg' },
  { name: 'Binzagr Co-Ro', logo: '/logos/binzagr-coro.webp' },
  { name: 'SADAFCO', logo: '/logos/sadafco.png' },
  { name: 'Four Winds Saudi Arabia', logo: '/logos/four-winds.png' },
  { name: 'Al Safwa Cement', logo: '/logos/al-safwa-cement.png' },
  { name: 'M.A. AbuDawood', logo: '/logos/abudawood.png' },
  { name: 'Jotun', logo: '/logos/jotun.svg' },
  { name: 'Al-Shaeir Pharma', logo: '/logos/al-shaeir-pharma.png' },
  { name: 'DP World', logo: '/logos/dp-world.svg' },
  { name: 'RSGT', logo: '/logos/rsgt.png' },
  { name: 'Jeddah Airports Company (JEDCO)', logo: '/logos/jedco.png' },
  { name: 'Daikin', logo: '/logos/daikin.svg' },
  { name: 'Johnson Controls', logo: '/logos/johnson-controls.svg' },
  { name: 'Mohammad Yusuf Naghi Motors', logo: '/logos/naghi-motors.svg' },
  { name: 'Clorox', logo: '/logos/clorox.svg' },
];
