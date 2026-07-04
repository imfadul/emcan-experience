'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Cinematic intro gate. Shows preload progress, then an "Enter Experience" button
 * (also satisfies the user-gesture requirement for any play-through video beats).
 * Covers the header (z-modal); scroll is locked by the stage until entered.
 */
export function LoadingScreen({
  progress,
  ready,
  onEnter,
  labels,
}: {
  progress: number;
  ready: boolean;
  onEnter: () => void;
  labels: { loading: string; enter: string; hook: string };
}) {
  const enterRef = useRef<HTMLButtonElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  const pct = Math.round(progress * 100);
  const showStaticPoster = reducedMotion || videoFailed;

  return (
    <div className="fixed inset-0 z-modal flex flex-col items-center justify-center bg-ink px-6">
      {/* Four companies converging into the Emcan Group mark — explains the group
          structure visually before any text does. Static poster under
          reduced-motion or if the clip fails to load; the "Emcan Group" wordmark
          is always present as real text (in the poster/video and the hook below). */}
      <div className="mb-8 w-full max-w-sm">
        {showStaticPoster ? (
          <Image
            src="/intro/emcan-reveal-poster.webp"
            alt="Emcan Group — four specialized companies, one integrated group"
            width={1280}
            height={714}
            priority
            className="h-auto w-full"
          />
        ) : (
          <video
            autoPlay
            muted
            playsInline
            width={1280}
            height={714}
            poster="/intro/emcan-reveal-poster.webp"
            className="h-auto w-full"
            onError={() => setVideoFailed(true)}
          >
            <source src="/intro/emcan-reveal.webm" type="video/webm" />
            <source src="/intro/emcan-reveal.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <h1 className="mb-10 max-w-sm text-balance text-center text-title font-bold leading-snug text-fg">
        {labels.hook}
      </h1>

      <div className="w-full max-w-xs">
        <div className="h-px w-full bg-line/15" aria-hidden>
          <div
            className="h-full origin-left bg-accent transition-transform duration-300 ease-out-quart"
            style={{ transform: `scaleX(${ready ? 1 : progress})` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{labels.loading}</span>
          <span className="font-mono tabular-nums" aria-live="polite">
            {pct}%
          </span>
        </div>
      </div>

      <button
        ref={enterRef}
        type="button"
        onClick={onEnter}
        disabled={!ready}
        className={`mt-10 inline-flex h-12 items-center justify-center rounded bg-accent px-8 text-sm font-semibold text-ink transition-all duration-base ease-out-quart hover:bg-beige disabled:cursor-default disabled:opacity-0 ${
          ready ? 'opacity-100' : 'pointer-events-none'
        }`}
      >
        {labels.enter}
      </button>
    </div>
  );
}
