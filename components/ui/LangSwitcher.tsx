'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

/**
 * Toggles EN ↔ AR on the current route and persists the choice to localStorage.
 * `variant`: "solid" (header chip) or "ghost" (inline, e.g. footer/mobile menu).
 */
export function LangSwitcher({
  variant = 'solid',
  className,
}: {
  variant?: 'solid' | 'ghost';
  className?: string;
}) {
  const locale = useLocale();
  const t = useTranslations('lang');
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const target = locale === 'en' ? 'ar' : 'en';
  const label = target === 'ar' ? t('toArabic') : t('toEnglish');
  const aria = target === 'ar' ? t('switchToArabic') : t('switchToEnglish');

  const styles =
    variant === 'solid'
      ? 'rounded border border-line/15 px-3.5 py-2 hover:border-accent/60 hover:text-accent'
      : 'rounded px-1 py-1 text-muted hover:text-accent';

  return (
    <button
      type="button"
      lang={target}
      aria-label={aria}
      disabled={pending}
      onClick={() => {
        try {
          localStorage.setItem('emcan-locale', target);
        } catch {
          /* storage unavailable — ignore */
        }
        startTransition(() => router.replace(pathname, { locale: target }));
      }}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors duration-base ease-out-quart disabled:opacity-50 ${styles} ${className ?? ''}`}
    >
      <span aria-hidden className="text-[0.9em] opacity-70">
        ⇄
      </span>
      {label}
    </button>
  );
}
