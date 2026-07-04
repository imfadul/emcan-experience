import { useTranslations } from 'next-intl';
import { LIFECYCLE } from '@/content/group';
import { accentBg, accentText } from '@/lib/accent';
import type { Company } from '@/lib/config';

const STAGE_ACCENT: Record<(typeof LIFECYCLE)[number], Company['accent']> = {
  design: 'beige',
  build: 'gold',
  power: 'green',
  control: 'blue',
};

export function DeliveryLifecycle() {
  const t = useTranslations('lifecycle');

  return (
    <section className="border-t border-line/10 bg-carbon">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 sm:grid-cols-2 lg:grid-cols-4">
          {LIFECYCLE.map((id, i) => {
            const accent = STAGE_ACCENT[id];
            return (
              <li key={id} className="relative bg-bg p-7">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${accentBg[accent]}`} />
                  <span className="font-mono text-xs tabular-nums text-muted">
                    0{i + 1}
                  </span>
                </div>
                <h3 className={`mt-5 text-title font-bold ${accentText[accent]}`}>
                  {t(`stages.${id}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t(`stages.${id}.desc`)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
