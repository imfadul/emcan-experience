import { useTranslations } from 'next-intl';
import { STRENGTHS, STATS } from '@/content/group';

export function WhyEmcan() {
  const t = useTranslations('why');
  const ts = useTranslations('stats');

  return (
    <section id="about" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.id} className="bg-bg p-7">
              <p className="text-display-2 font-extrabold leading-none text-fg">{s.value}</p>
              <p className="mt-3 text-sm text-muted">{ts(`items.${s.id}`)}</p>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-accent">{t('eyebrow')}</p>
            <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          </div>
          <ul className="lg:col-span-8 lg:columns-2 lg:gap-x-12">
            {STRENGTHS.map((id) => (
              <li
                key={id}
                className="mb-px flex break-inside-avoid items-start gap-3 border-t border-line/10 py-4 text-mist first:border-t-0 lg:first:border-t"
              >
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-sm leading-relaxed">{t(`items.${id}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
