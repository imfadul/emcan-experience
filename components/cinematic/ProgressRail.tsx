'use client';

import type { RefObject } from 'react';

export interface RailItem {
  id: string;
  kicker: string;
  accentRgb: string;
}

/**
 * Vertical chapter rail. Sits on the inline-end edge; each marker seeks to its
 * chapter. Keyboard operable (real buttons, aria-current on the active chapter).
 * The progress spine is updated imperatively via `spineRef` to avoid per-frame
 * React renders during scrub.
 */
export function ProgressRail({
  items,
  active,
  label,
  onSeek,
  spineRef,
}: {
  items: RailItem[];
  active: number;
  label: string;
  onSeek: (index: number) => void;
  spineRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <nav
      aria-label={label}
      className="pointer-events-auto absolute end-[max(1rem,calc((100vw-var(--shell-max))/2))] top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {/* progress spine (updated imperatively during scrub) */}
      <div className="absolute inset-y-1 start-[3px] w-px bg-line/15" aria-hidden>
        <div
          ref={spineRef}
          className="h-full w-full origin-top bg-fg/50"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSeek(i)}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center gap-3 ps-0"
          >
            <span
              className="relative z-10 h-1.5 w-1.5 rounded-full transition-all duration-base ease-out-quart"
              style={{
                backgroundColor: isActive ? `rgb(${item.accentRgb})` : 'rgb(var(--c-concrete))',
                transform: isActive ? 'scale(1.9)' : 'scale(1)',
              }}
            />
            <span
              className={`text-[0.65rem] font-semibold uppercase tracking-eyebrow transition-colors duration-base ${
                isActive ? 'text-fg' : 'text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {item.kicker}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
