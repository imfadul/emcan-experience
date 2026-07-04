'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import {
  PROJECTS,
  PROJECT_SECTORS,
  PROJECT_LOCATIONS,
  type ProjectSector,
} from '@/content/projects';
import type { Company } from '@/lib/config';
import { accentText } from '@/lib/accent';

const SECTOR_ACCENT: Record<ProjectSector, Company['accent']> = {
  logistics: 'blue',
  'food-beverage': 'gold',
  pharma: 'green',
  manufacturing: 'beige',
  chemicals: 'blue',
  infrastructure: 'gold',
};

export function ProjectsExplorer() {
  const t = useTranslations('projects');
  const tc = useTranslations('companies');
  const [sector, setSector] = useState<ProjectSector | 'all'>('all');
  const [location, setLocation] = useState<string | 'all'>('all');

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) => (sector === 'all' || p.sector === sector) && (location === 'all' || p.location === location),
      ),
    [sector, location],
  );

  const reset = () => {
    setSector('all');
    setLocation('all');
  };
  const isFiltered = sector !== 'all' || location !== 'all';

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line/10">
      <div className="shell py-section">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-mist">{t('lede')}</p>
        </div>

        {/* Filters */}
        <div className="mt-10 space-y-4">
          <FilterRow label={t('filterBySector')}>
            <Chip active={sector === 'all'} onClick={() => setSector('all')}>
              {t('filterAllSectors')}
            </Chip>
            {PROJECT_SECTORS.map((s) => (
              <Chip key={s} active={sector === s} onClick={() => setSector(s)}>
                {t(`sectorNames.${s}`)}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label={t('filterByLocation')}>
            <Chip active={location === 'all'} onClick={() => setLocation('all')}>
              {t('filterAllLocations')}
            </Chip>
            {PROJECT_LOCATIONS.map((l) => (
              <Chip key={l} active={location === l} onClick={() => setLocation(l)}>
                {l}
              </Chip>
            ))}
          </FilterRow>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs text-muted" aria-live="polite">
          <span>{t('showing', { count: filtered.length, total: PROJECTS.length })}</span>
          {isFiltered && (
            <button type="button" onClick={reset} className="font-semibold text-mist hover:text-accent">
              {t('reset')}
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="mt-12 text-muted">{t('empty')}</p>
        ) : (
          <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line/10 bg-line/5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const accent = SECTOR_ACCENT[p.sector];
              return (
                <li key={p.id} className="flex flex-col bg-bg p-7">
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.7rem] font-semibold uppercase tracking-eyebrow ${accentText[accent]}`}>
                      {t(`sectorNames.${p.sector}`)}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-muted">{p.year}</span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-snug text-fg">{p.name}</h3>
                  <p className="mt-1 text-sm text-mist">{p.client}</p>

                  <dl className="mt-5 space-y-1.5 text-xs text-muted">
                    <Row label={t('labels.location')}>{p.location}</Row>
                    <Row label={t('labels.scope')}>{p.scope}</Row>
                    {p.bua && <Row label={t('labels.bua')}>{p.bua}</Row>}
                    <Row label={t('labels.by')}>
                      {p.companies.map((c) => tc(`${c}.name`)).join(', ')}
                    </Row>
                  </dl>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="inline-flex items-center gap-1.5 text-xs text-mist">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      {t(`status.${p.status}`)}
                    </span>
                    <Link
                      href="/#contact"
                      className="text-xs font-semibold text-mist transition-colors hover:text-accent"
                    >
                      {t('requestDetails')}
                      <span aria-hidden className="ms-1 rtl:rotate-180">
                        →
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="me-1 text-xs font-semibold uppercase tracking-eyebrow text-muted">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors duration-fast ease-out-quart ${
        active
          ? 'border-accent/70 bg-accent/10 text-accent'
          : 'border-line/15 text-mist hover:border-line/40 hover:text-fg'
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted/70">{label}</dt>
      <dd className="text-mist">{children}</dd>
    </div>
  );
}
