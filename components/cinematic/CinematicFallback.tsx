'use client';

import { useTranslations } from 'next-intl';
import { CINEMATIC_CHAPTERS } from '@/lib/config';
import { ACCENT_RGB } from '@/lib/cinematic';
import { Button } from '@/components/ui/Button';

/**
 * Static, fully-accessible rendition of the cinematic journey — used for SSR, no-JS,
 * and prefers-reduced-motion. All chapter copy and the final-reveal CTAs are present
 * (brief §6: reduced-motion preserves all copy and CTAs).
 */
export function CinematicFallback() {
  const t = useTranslations('cinematic');
  const tcm = useTranslations('common');

  return (
    <section aria-label={t('reveal.tagline')} className="relative">
      {CINEMATIC_CHAPTERS.map((c) => {
        const accent = `rgb(${ACCENT_RGB[c.accent]})`;
        return (
          <div
            key={c.id}
            className="relative flex min-h-[80svh] items-center border-b border-line/10 pt-[var(--header-h)]"
          >
            {/* Blueprint still */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(var(--c-offwhite)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-offwhite)) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute end-0 top-0 h-full w-1/2 opacity-25"
              style={{
                background: `radial-gradient(60% 60% at 80% 60%, ${accent}, transparent 70%)`,
              }}
            />

            <div className="shell relative py-section">
              <div className="max-w-2xl border-s-2 ps-6" style={{ borderColor: accent }}>
                <p
                  className="text-xs font-semibold uppercase tracking-eyebrow"
                  style={{ color: accent }}
                >
                  {t(`chapters.${c.id}.kicker`)}
                </p>
                <p className="mt-2 text-sm text-muted">{t(`chapters.${c.id}.company`)}</p>
                <h2 className="mt-5 text-headline font-bold">{t(`chapters.${c.id}.title`)}</h2>
                <p className="mt-5 text-lg leading-relaxed text-mist">
                  {t(`chapters.${c.id}.body`)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Final group reveal */}
      <div className="relative flex min-h-[90svh] items-center justify-center text-center">
        <div className="shell py-section">
          <h2 className="mx-auto max-w-3xl text-display-2 font-extrabold">{t('reveal.title')}</h2>
          <p className="eyebrow mt-6 text-accent">{t('reveal.tagline')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/#companies" size="lg">
              {tcm('exploreCompanies')}
            </Button>
            <Button href="/#contact" size="lg" variant="outline">
              {tcm('discussProject')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
