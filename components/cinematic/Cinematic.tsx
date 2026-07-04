'use client';

import { useEffect, useState } from 'react';
import { FLAGS } from '@/lib/config';
import { prefersReducedMotion } from '@/lib/motion';
import { CinematicFallback } from './CinematicFallback';
import { CinematicStage } from './CinematicStage';

/**
 * Decides the journey mode. SSR and the first client render are the static
 * fallback (full copy, crawlable, no-JS safe); after mount, motion-capable
 * clients upgrade to the scrubbing canvas stage. Reduced-motion stays static.
 */
export function Cinematic() {
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    if (FLAGS.CINEMATIC_ENABLED && !prefersReducedMotion()) setCinematic(true);
  }, []);

  return cinematic ? <CinematicStage /> : <CinematicFallback />;
}
