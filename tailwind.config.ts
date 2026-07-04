import type { Config } from 'tailwindcss';

/**
 * Tokens are the single source of truth as CSS custom properties (see app/globals.css).
 * Colors are stored as raw `R G B` channel triplets so Tailwind's `/<alpha>` opacity
 * modifiers keep working (e.g. `bg-ink/60`, `text-gold/80`).
 */
function channel(variable: string): string {
  // Tailwind substitutes <alpha-value> with the opacity modifier (or 1).
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral ramp — brand Gray (#5a5c5f) extended into a cinematic dark scale
        ink: channel('--c-ink'),
        carbon: channel('--c-carbon'),
        graphite: channel('--c-graphite'),
        steel: {
          DEFAULT: channel('--c-steel'),
          900: channel('--c-steel-900'),
        },
        concrete: channel('--c-concrete'),
        mist: channel('--c-mist'),
        offwhite: channel('--c-offwhite'),
        // Brand accents (official Emcan palette)
        green: channel('--c-green'), // Royal Green — Energy / Power
        blue: channel('--c-blue'), // Bright Blue — Technology / Control
        gold: channel('--c-gold'), // Harvest Gold — Construction / Build
        beige: channel('--c-beige'), // Golden Beige — Engineering / Design
        // Semantic
        bg: channel('--c-bg'),
        surface: channel('--c-surface'),
        fg: channel('--c-fg'),
        muted: channel('--c-muted'),
        line: channel('--c-line'),
        accent: channel('--c-accent'),
      },
      fontFamily: {
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid display scale (clamp) — set as tokens in globals.css
        'display-1': ['var(--fs-display-1)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-2': ['var(--fs-display-2)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        headline: ['var(--fs-headline)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        title: ['var(--fs-title)', { lineHeight: '1.15' }],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      maxWidth: {
        shell: 'var(--shell-max)',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section-y)',
      },
      borderRadius: {
        // Restrained radii — industrial, not soft
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
      },
      transitionTimingFunction: {
        // Controlled, no bounce/elastic
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      zIndex: {
        nav: '100',
        overlay: '200',
        modal: '300',
        toast: '400',
        debug: '500',
      },
    },
  },
  plugins: [],
};

export default config;
