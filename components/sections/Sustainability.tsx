import { useTranslations } from 'next-intl';

const ITEMS = ['hse', 'energy', 'coldchain', 'vision'] as const;

export function Sustainability() {
  const t = useTranslations('sustainability');

  return (
    <section id="sustainability" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {ITEMS.map((id) => (
            <div key={id} className="border-t border-line/15 pt-5">
              <dt className="text-lg font-semibold text-fg">{t(`items.${id}.title`)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{t(`items.${id}.desc`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
