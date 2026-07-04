import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { REGISTRATIONS, PREQUALIFICATIONS, CLIENTS } from '@/content/registrations';

export function Credentials() {
  const t = useTranslations('certs');
  const tcl = useTranslations('clients');

  return (
    <section className="border-t border-line/10 bg-carbon">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="eyebrow mb-4">{t('registeredBy')}</h3>
            <ul className="space-y-2">
              {REGISTRATIONS.map((r) => (
                <li key={r} className="text-sm text-mist">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-8">
            <h3 className="eyebrow mb-4">{t('prequalifiedBy')}</h3>
            <ul className="flex flex-wrap gap-2">
              {PREQUALIFICATIONS.map((p) => (
                <li
                  key={p}
                  className="rounded border border-line/15 px-3 py-1.5 text-sm text-mist"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clients */}
        <div className="mt-16 border-t border-line/10 pt-12">
          <p className="eyebrow text-accent">{tcl('eyebrow')}</p>
          <h3 className="mt-4 max-w-2xl text-title font-bold">{tcl('title')}</h3>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 sm:grid-cols-3 lg:grid-cols-4">
            {CLIENTS.map((c) => (
              <li
                key={c.name}
                className="flex min-h-[5rem] items-center justify-center bg-white px-6 py-5 text-center text-sm font-medium text-ink"
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={140}
                    height={48}
                    unoptimized={c.logo.endsWith('.svg')}
                    className="h-9 w-auto object-contain"
                  />
                ) : (
                  c.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
