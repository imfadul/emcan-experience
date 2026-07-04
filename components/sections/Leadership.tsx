import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { COMPANIES, type CompanyId } from '@/lib/config';
import { CHAIRMAN, DIRECTORS } from '@/content/leadership';
import { accentBg } from '@/lib/accent';

const COMPANY_BY_ID = Object.fromEntries(COMPANIES.map((c) => [c.id, c])) as Record<
  CompanyId,
  (typeof COMPANIES)[number]
>;

/** Splits translated bio copy on blank lines into separate paragraphs. */
function Paragraphs({
  text,
  className,
  wrapperClassName,
}: {
  text: string;
  className: string;
  wrapperClassName: string;
}) {
  return (
    <div className={wrapperClassName}>
      {text.split('\n\n').map((p) => (
        <p key={p.slice(0, 24)} className={className}>
          {p}
        </p>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

export function Leadership() {
  const t = useTranslations('leadership');
  const tc = useTranslations('companies');

  return (
    <section id="leadership" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        {/* Chairman */}
        <div className="mt-12 grid overflow-hidden rounded-lg border border-line/10 md:grid-cols-12">
          {CHAIRMAN.photo && (
            <div className="relative h-72 md:col-span-4 md:h-full">
              <Image
                src={CHAIRMAN.photo}
                alt={t('chairman.name')}
                width={520}
                height={640}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
          <div className="bg-carbon p-8 md:col-span-8 md:p-10">
            <span className="eyebrow inline-block rounded-full border border-line/15 px-3 py-1 text-[0.65rem] text-accent">
              {t('chairmanBadge')}
            </span>
            <h3 className="mt-4 text-title font-bold">{t('chairman.name')}</h3>
            <p className="mt-1 text-sm text-muted">{t('chairman.role')}</p>
            <Paragraphs
              text={t('chairman.statement')}
              wrapperClassName="mt-5 space-y-4"
              className="text-sm leading-relaxed text-mist"
            />
          </div>
        </div>

        {/* Directors */}
        <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 sm:grid-cols-2">
          {DIRECTORS.map((d) => {
            const company = d.company ? COMPANY_BY_ID[d.company] : undefined;
            const name = t(`directors.${d.id}.name`);
            return (
              <li key={d.id} className="flex flex-col gap-5 bg-bg p-8">
                <div className="flex items-center gap-4">
                  {d.photo ? (
                    <Image
                      src={d.photo}
                      alt={name}
                      width={112}
                      height={112}
                      sizes="64px"
                      className="h-16 w-16 shrink-0 rounded-full object-cover object-top"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-ink ${
                        company ? accentBg[company.accent] : 'bg-line/20'
                      }`}
                    >
                      {initials(name)}
                    </span>
                  )}
                  <div>
                    <p className="eyebrow text-[0.65rem] text-muted">{t('directorBadge')}</p>
                    <h3 className="mt-1 font-bold">{name}</h3>
                    {company && (
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <span className={`h-1.5 w-1.5 rounded-full ${accentBg[company.accent]}`} />
                        {tc(`${company.id}.name`)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-mist">
                  {t(`directors.${d.id}.shortStatement`)}
                </p>
                <Paragraphs
                  text={t(`directors.${d.id}.bio`)}
                  wrapperClassName="space-y-3 border-t border-line/10 pt-4"
                  className="text-sm leading-relaxed text-muted"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
