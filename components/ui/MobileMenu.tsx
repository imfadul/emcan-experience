'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { NAV_ITEMS, companyHref } from '@/lib/nav';
import { COMPANIES } from '@/lib/config';
import { accentBg, accentText } from '@/lib/accent';
import { useFocusTrap, useLockBodyScroll } from '@/lib/hooks';
import { LangSwitcher } from './LangSwitcher';
import { Button } from './Button';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('nav');
  const tc = useTranslations('companies');
  const tcm = useTranslations('common');
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('menu')}
      aria-hidden={!open}
      className={`fixed inset-0 z-modal lg:hidden ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Scrim */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-base ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute inset-y-0 end-0 flex w-full max-w-sm flex-col bg-carbon shadow-2xl transition-transform duration-base ease-out-quart ${
          open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line/10 px-6 py-4">
          <span className="eyebrow">{t('menu')}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeMenu')}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-mist transition-colors hover:text-accent"
          >
            <span aria-hidden className="text-xl">
              ✕
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-6" data-lenis-prevent>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-2.5 text-lg font-semibold text-fg transition-colors hover:text-accent"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-line/10 pt-6">
            <p className="eyebrow mb-3">{t('companies')}</p>
            <ul className="space-y-1">
              {COMPANIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={companyHref(c.id)}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentBg[c.accent]}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-fg">{tc(`${c.id}.name`)}</span>
                      <span className={`block text-xs uppercase tracking-eyebrow ${accentText[c.accent]}`}>
                        {tc(`${c.id}.discipline`)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex items-center justify-between gap-4 border-t border-line/10 px-6 py-5">
          <LangSwitcher variant="solid" />
          <Button href="/#contact" size="sm" onClick={onClose}>
            {tcm('discussProject')}
          </Button>
        </div>
      </div>
    </div>
  );
}
