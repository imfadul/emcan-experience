'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { COMPANIES } from '@/lib/config';
import { companyHref } from '@/lib/nav';
import { accentBg, accentText } from '@/lib/accent';

/**
 * Companies disclosure (click/focus pattern — reliable for mouse, touch, and
 * keyboard alike). Toggles on click/Enter/Space; closes on Escape (returning
 * focus to the trigger), outside pointerdown, or selecting a company. The panel
 * is viewport-centred under the fixed header so it never overflows the edges.
 */
export function MegaMenu({ label }: { label: string }) {
  const t = useTranslations('companies');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-mist transition-colors duration-fast ease-out-quart hover:text-fg aria-expanded:text-fg"
      >
        {label}
        <span
          aria-hidden
          className={`text-[0.7em] transition-transform duration-fast ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {/* Panel — fixed + viewport-centred under the header */}
      <div
        id={panelId}
        role="group"
        aria-label={label}
        className={`fixed left-1/2 top-[calc(var(--header-h)-0.25rem)] z-overlay w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 transition duration-base ease-out-quart ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-line/10 bg-carbon/95 shadow-2xl backdrop-blur-xl">
          <p className="border-b border-line/10 px-6 py-3 text-xs text-muted">
            {tn('companiesDesc')}
          </p>
          <ul className="grid grid-cols-1 gap-px bg-line/5 sm:grid-cols-2">
            {COMPANIES.map((c) => (
              <li key={c.id} className="bg-carbon">
                <Link
                  href={companyHref(c.id)}
                  onClick={() => setOpen(false)}
                  className="group flex h-full gap-4 p-5 transition-colors duration-fast hover:bg-graphite focus-visible:bg-graphite"
                >
                  <span aria-hidden className="mt-1 font-mono text-xs tabular-nums text-muted">
                    {c.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${accentBg[c.accent]}`} />
                      <span
                        className={`text-[0.65rem] font-semibold uppercase tracking-eyebrow ${accentText[c.accent]}`}
                      >
                        {t(`${c.id}.discipline`)}
                      </span>
                    </span>
                    <span className="mt-1.5 block font-semibold text-fg">{t(`${c.id}.name`)}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      {t(`${c.id}.tagline`)}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-mist transition-colors group-hover:text-accent">
                      {tc('explore')}
                      <span aria-hidden className="rtl:rotate-180">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
