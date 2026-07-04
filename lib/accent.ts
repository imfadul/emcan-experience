import type { Company } from './config';

type Accent = Company['accent'];

/** Full literal class names per brand accent so Tailwind's content scan keeps them. */
export const accentText: Record<Accent, string> = {
  beige: 'text-beige',
  gold: 'text-gold',
  green: 'text-green',
  blue: 'text-blue',
};

export const accentBg: Record<Accent, string> = {
  beige: 'bg-beige',
  gold: 'bg-gold',
  green: 'bg-green',
  blue: 'bg-blue',
};

export const accentBorder: Record<Accent, string> = {
  beige: 'border-beige',
  gold: 'border-gold',
  green: 'border-green',
  blue: 'border-blue',
};
