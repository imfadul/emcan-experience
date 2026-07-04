'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { NAV_ITEMS } from '@/lib/nav';
import { useScrollProgress } from '@/lib/hooks';
import { Logo } from './Logo';
import { LangSwitcher } from './LangSwitcher';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { Button } from './Button';

export function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const { scrolled, progress } = useScrollProgress(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Always return focus to the trigger on close (robust where clicks don't focus
  // buttons, e.g. Safari/Firefox on macOS).
  const closeMenu = () => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-nav transition-colors duration-base ease-out-quart ${
        scrolled ? 'border-b border-line/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo label={t('home')} priority className="h-9 sm:h-10" />

        {/* Desktop navigation */}
        <nav aria-label={t('primary')} className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) =>
            item.mega ? (
              <MegaMenu key={item.key} label={t(item.key)} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="py-2 text-sm font-medium text-mist transition-colors duration-fast ease-out-quart hover:text-fg"
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LangSwitcher variant="solid" className="hidden sm:inline-flex" />
          <Button href="/#contact" size="sm" className="hidden lg:inline-flex">
            {tc('discussProject')}
          </Button>

          {/* Mobile menu trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('openMenu')}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-fg transition-colors hover:text-accent lg:hidden"
          >
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-3.5 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* Scroll-progress indicator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-line/5" aria-hidden>
        <div
          className="h-full origin-left bg-accent rtl:origin-right"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
