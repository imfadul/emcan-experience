import { useTranslations } from 'next-intl';
import { SECTORS } from '@/content/group';
import { accentText } from '@/lib/accent';
import type { Company } from '@/lib/config';

// Cycle the four brand accents across the sector cards for rhythm.
const CYCLE: Company['accent'][] = ['beige', 'gold', 'green', 'blue'];

export function Sectors() {
  const t = useTranslations('sectors');

  return (
    <section id="sectors" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((id, i) => {
            const accent = CYCLE[i % CYCLE.length]!;
            return (
              <li key={id} className="group bg-bg p-7 transition-colors duration-base hover:bg-surface/40">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden
                    className={`h-px w-8 origin-right scale-x-0 bg-current transition-transform duration-base ease-out-quart group-hover:scale-x-100 ${accentText[accent]}`}
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-fg">{t(`items.${id}.name`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`items.${id}.blurb`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
