'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react';
import type { FrameSource } from '@/lib/cinematic';
import { bandForProgress } from '@/lib/cinematic';

export interface ScrollCanvasHandle {
  /** Draw the frame for global journey progress (0..1). */
  draw: (progress: number) => void;
  resize: () => void;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * The image-sequence scrubber. Sizes the canvas to the device pixel ratio (capped
 * at 2 for perf), maps global progress to a chapter + discrete frame, draws it via
 * the chapter's FrameSource, and dips to black across chapter boundaries.
 */
export const ScrollCanvas = forwardRef<ScrollCanvasHandle, { sources: FrameSource[] }>(
  function ScrollCanvas({ sources }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const size = useRef({ w: 0, h: 0 });
    const lastP = useRef(0);

    const draw = useCallback(
      (progress: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        lastP.current = progress;
        const { w, h } = size.current;
        if (w === 0 || h === 0) return;

        const n = sources.length;
        const { index, local, reveal } = bandForProgress(progress, n);
        const chapterIndex = reveal ? n - 1 : index;
        const source = sources[chapterIndex];
        if (!source) return;

        const frame = reveal
          ? source.count - 1
          : Math.round(local * (source.count - 1));
        source.draw(ctx, frame, w, h);

        // Scene transition: dip to black near chapter boundaries; darken under the reveal.
        let dark = 0;
        if (reveal) {
          dark = 0.35 + local * 0.4;
        } else {
          const edge = Math.min(local, 1 - local);
          dark = (1 - smoothstep(0, 0.14, edge)) * 0.55;
        }
        if (dark > 0) {
          ctx.fillStyle = `rgba(10,11,12,${dark})`;
          ctx.fillRect(0, 0, w, h);
        }
      },
      [sources],
    );

    const resize = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.current = { w: rect.width, h: rect.height };
      draw(lastP.current);
    }, [draw]);

    useImperativeHandle(ref, () => ({ draw, resize }), [draw, resize]);

    useEffect(() => {
      resize();
      const ro = new ResizeObserver(resize);
      if (canvasRef.current) ro.observe(canvasRef.current);
      return () => ro.disconnect();
    }, [resize]);

    return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
  },
);
