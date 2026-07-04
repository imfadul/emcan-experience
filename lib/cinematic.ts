import type { CinematicAccent, CinematicChapter } from './config';

/* ---------------------------------------------------------------------------
   PALETTE (canvas needs literal rgb, not CSS vars)
   ------------------------------------------------------------------------- */
export const ACCENT_RGB: Record<CinematicAccent, string> = {
  beige: '221,190,108',
  gold: '216,169,58',
  green: '41,150,23',
  blue: '105,170,221',
  steel: '150,153,158',
};

const INK = '10,11,12';

/* ---------------------------------------------------------------------------
   FRAME SOURCE
   The scrubber draws frame `i` of a chapter onto the canvas. A source either
   preloads decoded images (production) or renders procedural greybox frames.
   ------------------------------------------------------------------------- */
export interface FrameSource {
  readonly count: number;
  /** Preload/decode (images) or warm up (procedural). Reports 0..1 progress. */
  ensureLoaded(onProgress?: (p: number) => void): Promise<void>;
  /** Draw frame `index` to fill (cover) a w×h canvas, in CSS pixels. */
  draw(ctx: CanvasRenderingContext2D, index: number, w: number, h: number): void;
}

/** Production source: preloads a numbered image sequence and draws with cover fit. */
export class ImageFrameSource implements FrameSource {
  readonly count: number;
  private urls: string[];
  private images: HTMLImageElement[] = [];
  private loaded = false;

  constructor(baseUrl: string, count: number, ext: string, pad: number) {
    this.count = count;
    this.urls = Array.from({ length: count }, (_, i) => {
      const n = String(i + 1).padStart(pad, '0');
      return `${baseUrl}${n}.${ext}`;
    });
  }

  async ensureLoaded(onProgress?: (p: number) => void) {
    if (this.loaded) return;
    let done = 0;
    await Promise.all(
      this.urls.map(
        (url, i) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => {
              this.images[i] = img;
              onProgress?.(++done / this.count);
              resolve();
            };
            // On failure the frame stays undefined; draw() falls back gracefully.
            img.onerror = () => {
              onProgress?.(++done / this.count);
              resolve();
            };
            img.src = url;
          }),
      ),
    );
    this.loaded = true;
  }

  draw(ctx: CanvasRenderingContext2D, index: number, w: number, h: number) {
    const img = this.images[clamp(index, 0, this.count - 1)];
    if (!img || !img.naturalWidth) {
      // Poster fallback: never a broken player — paint a neutral still.
      ctx.fillStyle = `rgb(${INK})`;
      ctx.fillRect(0, 0, w, h);
      return;
    }
    coverDraw(ctx, img, img.naturalWidth, img.naturalHeight, w, h);
  }
}

/** Greybox source: renders crisp procedural "storyboard" frames. Zero assets. */
export class ProceduralFrameSource implements FrameSource {
  readonly count: number;
  constructor(
    private chapter: CinematicChapter,
    isMobile: boolean,
  ) {
    this.count = isMobile ? chapter.framesMobile : chapter.frames;
  }

  async ensureLoaded(onProgress?: (p: number) => void) {
    // Simulate a short decode so the loading screen reads as real work.
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, 26));
      onProgress?.(i / steps);
    }
  }

  draw(ctx: CanvasRenderingContext2D, index: number, w: number, h: number) {
    drawProceduralFrame(ctx, w, h, this.chapter, clamp(index, 0, this.count - 1), this.count);
  }
}

export function createFrameSource(chapter: CinematicChapter, isMobile: boolean): FrameSource {
  if (chapter.source) {
    const count = isMobile ? chapter.framesMobile : chapter.frames;
    return new ImageFrameSource(chapter.source.baseUrl, count, chapter.source.ext, chapter.source.pad);
  }
  return new ProceduralFrameSource(chapter, isMobile);
}

/* ---------------------------------------------------------------------------
   PROGRESS → CHAPTER BAND
   Global progress p∈[0,1] across the whole journey. N chapters + 1 reveal band.
   ------------------------------------------------------------------------- */
export interface BandState {
  /** Active chapter index, or N when in the final reveal band. */
  index: number;
  /** Local progress within the active band, 0..1. */
  local: number;
  /** True once past the last chapter (final group reveal). */
  reveal: boolean;
}

export function bandForProgress(p: number, chapterCount: number): BandState {
  const bands = chapterCount + 1;
  const size = 1 / bands;
  const clamped = clamp(p, 0, 1 - 1e-6);
  const raw = Math.floor(clamped / size);
  const index = Math.min(raw, chapterCount); // last band == reveal
  const local = (clamped - index * size) / size;
  return { index, local, reveal: index >= chapterCount };
}

/** Scroll-track height (in viewport units) for the whole journey. */
export function trackVh(chapterCount: number): number {
  return (chapterCount + 1) * 100;
}

/* ---------------------------------------------------------------------------
   DRAWING HELPERS
   ------------------------------------------------------------------------- */
function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

const KICKER: Record<string, string> = {
  design: 'Design',
  build: 'Build',
  power: 'Power',
  completion: 'Completion',
  control: 'Control',
};

/**
 * Renders one greybox storyboard frame: blueprint grid + accent wash + an
 * assembling "facility" motif that builds with the frame index, a moving scan
 * line, and a frame counter — so scrubbing is unmistakable. Crisp at any DPR.
 */
function drawProceduralFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  chapter: CinematicChapter,
  index: number,
  count: number,
) {
  const accent = ACCENT_RGB[chapter.accent];
  const t = count > 1 ? index / (count - 1) : 0; // 0..1 within chapter

  // Base
  ctx.fillStyle = `rgb(${INK})`;
  ctx.fillRect(0, 0, w, h);

  // Accent wash (subtle radial, lower-right)
  const g = ctx.createRadialGradient(w * 0.78, h * 0.7, 0, w * 0.78, h * 0.7, Math.max(w, h) * 0.9);
  g.addColorStop(0, `rgba(${accent},0.16)`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Blueprint grid
  const cell = Math.max(48, Math.round(w / 22));
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(244,243,239,0.05)';
  ctx.beginPath();
  for (let x = 0; x <= w; x += cell) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = 0; y <= h; y += cell) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();

  // Assembling facility silhouette along a ground line
  const ground = h * 0.78;
  const bays = 9;
  const bayW = (w * 0.62) / bays;
  const left = w * 0.19;
  ctx.strokeStyle = `rgba(${accent},0.5)`;
  ctx.fillStyle = `rgba(${accent},0.12)`;
  ctx.lineWidth = 2;
  for (let i = 0; i < bays; i++) {
    // Each bay "rises" as the chapter progresses (staggered).
    const appear = clamp(t * bays - i * 0.7, 0, 1);
    if (appear <= 0) continue;
    const bayH = h * 0.34 * appear;
    const x = left + i * bayW;
    ctx.fillRect(x, ground - bayH, bayW - 4, bayH);
    ctx.strokeRect(x + 0.5, ground - bayH + 0.5, bayW - 4, bayH);
  }
  // Ground line
  ctx.strokeStyle = `rgba(${accent},0.7)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.12, ground + 0.5);
  ctx.lineTo(w * 0.88, ground + 0.5);
  ctx.stroke();

  // Moving scan line (makes scrub obvious)
  const scanY = h * (0.12 + t * 0.6);
  ctx.strokeStyle = `rgba(${accent},0.85)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(w, scanY);
  ctx.stroke();

  // Labels
  ctx.textBaseline = 'top';
  ctx.fillStyle = `rgb(${accent})`;
  ctx.font = `600 ${Math.round(w / 90)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(
    `0${chapter.order} · ${(KICKER[chapter.id] ?? chapter.id).toUpperCase()}`,
    w * 0.12,
    h * 0.12,
  );

  ctx.fillStyle = 'rgba(244,243,239,0.85)';
  ctx.font = `700 ${Math.round(w / 26)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText('GREYBOX', w * 0.12, h * 0.12 + Math.round(w / 60));

  // Frame counter (bottom-right)
  ctx.fillStyle = 'rgba(199,201,204,0.7)';
  ctx.font = `500 ${Math.round(w / 100)}px ui-monospace, monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(`FRAME ${String(index + 1).padStart(2, '0')} / ${count}`, w * 0.88, h * 0.85);
  ctx.textAlign = 'left';
}
