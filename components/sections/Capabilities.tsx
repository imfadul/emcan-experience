import { useTranslations } from 'next-intl';
import { CAPABILITY_PILLARS } from '@/content/group';

export function Capabilities() {
  const t = useTranslations('capabilities');
  const tp = useTranslations('pillars');

  return (
    <section id="capabilities" className="scroll-mt-24 border-t border-line/10 bg-carbon">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITY_PILLARS.map((id, i) => (
            <div key={id} className="border-t border-line/15 pt-5">
              <span className="font-mono text-xs tabular-nums text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <dt className="mt-3 text-lg font-semibold text-fg">{tp(`${id}.title`)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{tp(`${id}.desc`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
