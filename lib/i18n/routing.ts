import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Text direction per locale — drives <html dir> and RTL mirroring. */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix so /en and /ar are explicit and cacheable.
  localePrefix: 'always',
});
