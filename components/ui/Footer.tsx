import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { COMPANIES, CONTACT, SITE } from '@/lib/config';
import { companyHref } from '@/lib/nav';
import { accentBg } from '@/lib/accent';
import { Logo } from './Logo';
import { LangSwitcher } from './LangSwitcher';

const COMPANY_LINKS = [
  { key: 'group', href: '/#group' },
  { key: 'capabilities', href: '/#capabilities' },
  { key: 'projects', href: '/#projects' },
  { key: 'about', href: '/#about' },
  { key: 'leadership', href: '/#leadership' },
  { key: 'sustainability', href: '/#sustainability' },
  { key: 'contact', href: '/#contact' },
] as const;

export function Footer() {
  const t = useTranslations('footer');
  const tct = useTranslations('contact');
  const tc = useTranslations('companies');
  const tn = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="corporate-zone border-t border-line/10 bg-carbon text-fg">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <Logo label={tn('home')} className="h-10" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t('tagline')}</p>
          <p className="mt-6 text-xs text-muted">
            <a
              href={`https://${SITE.domain}`}
              className="transition-colors hover:text-accent"
            >
              {SITE.domain}
            </a>
            <span className="px-2 opacity-40">·</span>
            <span>{SITE.social.handle}</span>
          </p>
        </div>

        {/* Companies */}
        <nav aria-label={t('companies')} className="md:col-span-3">
          <h2 className="eyebrow mb-4">{t('companies')}</h2>
          <ul className="space-y-3">
            {COMPANIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={companyHref(c.id)}
                  className="group inline-flex items-center gap-2.5 text-sm text-mist transition-colors hover:text-fg"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${accentBg[c.accent]}`} />
                  {tc(`${c.id}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company links */}
        <nav aria-label={t('company')} className="md:col-span-2">
          <h2 className="eyebrow mb-4">{t('company')}</h2>
          <ul className="space-y-3">
            {COMPANY_LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  className="text-sm text-mist transition-colors hover:text-fg"
                >
                  {t(`links.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <LangSwitcher variant="solid" />
          </div>
        </nav>

        {/* Connect */}
        <div className="md:col-span-3">
          <h2 className="eyebrow mb-4">{t('connect')}</h2>
          <ul className="space-y-3 text-sm text-mist">
            <li dir="ltr" className="text-start">
              <a href={CONTACT.phone.href} className="transition-colors hover:text-fg">
                {CONTACT.phone.display}
              </a>
            </li>
            <li dir="ltr" className="text-start">
              <a href={CONTACT.email.href} className="transition-colors hover:text-fg">
                {CONTACT.email.display}
              </a>
            </li>
            <li className="leading-relaxed text-muted">{CONTACT.address}</li>
            <li className="text-muted">{tct('info.hoursValue', { time: CONTACT.hoursTime })}</li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-line/10">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
