import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

/**
 * Contact lead-in. The full form replaces the placeholder note in Phase 5, landing
 * at this same #contact anchor.
 */
export function ContactCTA() {
  const t = useTranslations('contact');
  const tc = useTranslations('common');

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line/10 bg-carbon">
      <div className="shell py-section text-center">
        <p className="eyebrow text-accent">{t('eyebrow')}</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-headline font-bold">{t('title')}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-mist">{t('lede')}</p>
        <div className="mt-9 flex justify-center">
          <Button href="/#contact" size="lg">
            {tc('discussProject')}
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">{t('placeholder')}</p>
      </div>
    </section>
  );
}
