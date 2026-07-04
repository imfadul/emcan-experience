'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { COMPANIES } from '@/lib/config';
import { companyHref } from '@/lib/nav';
import { accentBg, accentText, accentBorder } from '@/lib/accent';
import { Button } from '@/components/ui/Button';

/**
 * Interactive four-company lifecycle (01 Design → 04 Control). A tablist of stages
 * drives a detail panel. Keyboard operable (Arrow/Home/End move between stages),
 * with hover preview on pointer devices and a stacked layout on mobile.
 */
export function EcosystemLifecycle() {
  const t = useTranslations('companies');
  const tc = useTranslations('common');
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = COMPANIES.length - 1;
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const company = COMPANIES[active]!;
  const caps = t.raw(`${company.id}.capabilities`) as string[];

  return (
    <section id="companies" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        <p className="eyebrow text-accent">{t('sectionEyebrow')}</p>
        <h2 className="mt-4 max-w-3xl text-headline font-bold">{t('sectionTitle')}</h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 lg:grid-cols-[1.1fr_1fr]">
          {/* Stage selector */}
          <div role="tablist" aria-label={t('sectionEyebrow')} className="bg-bg" onKeyDown={onKeyDown}>
            {COMPANIES.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`eco-tab-${c.id}`}
                  aria-selected={isActive}
                  aria-controls="eco-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group flex w-full items-center gap-5 border-s-2 px-6 py-6 text-start transition-colors duration-base ease-out-quart sm:px-8 ${
                    isActive ? `${accentBorder[c.accent]} bg-surface/50` : 'border-transparent hover:bg-surface/30'
                  }`}
                >
                  <span className="font-mono text-sm tabular-nums text-muted">{c.index}</span>
                  <span className="flex-1">
                    <span
                      className={`block text-[0.7rem] font-semibold uppercase tracking-eyebrow ${accentText[c.accent]}`}
                    >
                      {t(`${c.id}.discipline`)}
                    </span>
                    <span
                      className={`mt-1 block font-semibold transition-colors ${isActive ? 'text-fg' : 'text-mist'}`}
                    >
                      {t(`${c.id}.name`)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full transition-opacity ${accentBg[c.accent]} ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            role="tabpanel"
            id="eco-panel"
            aria-labelledby={`eco-tab-${company.id}`}
            className="flex flex-col justify-between gap-8 bg-bg p-8 sm:p-10"
          >
            <div>
              <span
                className={`text-[0.7rem] font-semibold uppercase tracking-eyebrow ${accentText[company.accent]}`}
              >
                {company.index} · {t(`${company.id}.discipline`)}
              </span>
              <h3 className="mt-3 text-title font-bold">{t(`${company.id}.name`)}</h3>
              <p className="mt-3 text-base leading-relaxed text-mist">{t(`${company.id}.tagline`)}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`${company.id}.summary`)}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {caps.map((cap) => (
                  <li
                    key={cap}
                    className="rounded border border-line/10 px-2.5 py-1 text-xs text-mist"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            <Button href={companyHref(company.id)} variant="outline" size="sm" className="self-start">
              {tc('explore')}
              <span aria-hidden className="rtl:rotate-180">
                →
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
