import { useTranslations } from 'next-intl';

export function GroupIntro() {
  const t = useTranslations('group');
  return (
    <section id="group" className="scroll-mt-24 border-t border-line/10">
      <div className="shell grid gap-10 py-section md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
        </div>
        <div className="md:col-span-7 md:pt-12">
          <p className="max-w-2xl text-lg leading-relaxed text-mist">{t('intro')}</p>
        </div>
      </div>
    </section>
  );
}
