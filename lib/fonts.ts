import { Montserrat, Tajawal } from 'next/font/google';

/**
 * Official Emcan typefaces, self-hosted via next/font (no external requests, no CLS).
 * English/Latin: Montserrat (variable). Arabic: Tajawal (discrete weights).
 * Both expose CSS variables consumed by Tailwind's fontFamily tokens.
 */
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

/** Combined font-variable className for the <html> element. */
export const fontVariables = `${montserrat.variable} ${tajawal.variable}`;
