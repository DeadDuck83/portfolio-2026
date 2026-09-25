/**
 * The pixel runner in the About finale. As "Today" rises, a keyed video of the
 * character jogs in from the left edge of the stage, decelerates as the clip's
 * walk cycle ends and stands beside the Today copy on the held last frame.
 *
 * Imperative on purpose (mirrors AboutJourney's engine): everything is written
 * straight to a <canvas> from refs, nothing goes through React state. The clip
 * has a flat black ground, so each frame is keyed to transparency on the canvas —
 * black pixels drop out, the 10–34 band feathers the edge so the pixel art keeps
 * a clean silhouette without a halo. Plays once per mount.
 *
 * Desktop (pin mode) only — the caller skips it in stack mode.
 */

/** Source clip geometry. Crop the 1532×1348 frame to the character column. */
export const RUNNER_CLIP = {
  src: '/about/runner.mp4',
  /** Crop rectangle (source px). */
  sx: 370,
  sy: 36,
  sw: 776,
  sh: 1296,
  /** Character height inside the crop (px) — the crop carries a little headroom. */
  charH: 1266,
  /** Clip time (s) when the walk cycle stops; the carry decelerates to land here. */
  stop: 3.9,
} as const;

/** Runner height as a fraction of the Today copy block's height. */
export const RUNNER_SCALE = 2 / 3;
/** Gap kept between the runner and the Today copy / stage edge (px). */
export const RUNNER_GUTTER = 32;
/** Fraction of the run at constant stride before the straight-line deceleration. */
const CRUISE = 0.7;

/** Black key: fully transparent at or below `cut`, opaque from `cut + band` (max channel, 0–255). */
const KEY_CUT = 10;
const KEY_BAND = 24;

/** Position of the run: constant stride for `CRUISE` of the clip, then decelerates to 1 at `p = 1`. */
export function runProgress(p: number, cruise: number = CRUISE) {
  const c = p < 0 ? 0 : p > 1 ? 1 : p;
  const k = 2 / (1 + cruise);
  if (c < cruise) return k * c;
  const d = c - cruise;
  return k * cruise + k * d * (1 - d / (2 * (1 - cruise)));
}

export interface RunnerBox {
  /** Canvas CSS box, relative to the Today layer. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** translateX that parks the runner just past the stage's left edge. */
  offscreen: number;
}

export interface RunnerLayout {
  /** Left edge of the Today copy (px from the stage's left edge) — `F + panel padding` in the engine. */
  copyLeft: number;
  /** Today copy block's top and height (px, relative to the Today layer). */
  copyTop: number;
  copyHeight: number;
  /** Left inset the stage content already keeps (px). */
  sideInset: number;
}

/** Fit the runner at 2/3 the copy height, centred in the open column left of the copy; shrink if the column is narrow. */
export function runnerBox(l: RunnerLayout, clip = RUNNER_CLIP): RunnerBox {
  const avail = Math.max(0, l.copyLeft - RUNNER_GUTTER - l.sideInset);
  let h = l.copyHeight * RUNNER_SCALE * (clip.sh / clip.charH);
  let w = (h * clip.sw) / clip.sh;
  if (w > avail) {
    w = avail;
    h = (w * clip.sh) / clip.sw;
  }
  const x = Math.round(l.sideInset + (avail - w) / 2);
  const y = Math.round(l.copyTop + (l.copyHeight - h) / 2);
  return { x, y, w, h, offscreen: -(x + w + 8) };
}

/** Key the clip's black ground to transparency, feathering the edge band. Mutates `data`. */
export function keyBlack(data: Uint8ClampedArray, cut = KEY_CUT, band = KEY_BAND) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const m = r > g ? (r > b ? r : b) : g > b ? g : b;
    if (m <= cut) {
      data[i + 3] = 0;
      continue;
    }
    if (m < cut + band) {
      const a = (m - cut) / band;
      const k = 1 / a; // un-premultiply so the feathered edge keeps the sprite's colour, not black
      data[i + 3] = Math.round(a * 255);
      data[i] = Math.min(255, r * k);
      data[i + 1] = Math.min(255, g * k);
      data[i + 2] = Math.min(255, b * k);
    }
  }
}

type RunState = 'idle' | 'running' | 'done';

export interface Runner {
  /** Re-fit the canvas after a measure. Cheap; call from the engine's `measure`. */
  place(layout: RunnerLayout): void;
  /** Start the run (once). Safe to call every frame — a no-op after the first. */
  start(): void;
  destroy(): void;
}

export function createRunner(canvas: HTMLCanvasElement, clip = RUNNER_CLIP): Runner {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.src = clip.src;

  let state: RunState = 'idle';
  let raf = 0;
  let lastT = -1;
  let offscreen = 0;
  let alive = true;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.willChange = 'transform';

  const draw = () => {
    if (!alive || video.readyState < 2 || !canvas.width) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, clip.sx, clip.sy, clip.sw, clip.sh, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    keyBlack(img.data);
    ctx.putImageData(img, 0, 0);
  };

  const finish = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    state = 'done';
    lastT = -1;
    canvas.style.transform = 'translate3d(0,0,0)';
    draw();
  };

  const loop = () => {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    const t = video.currentTime;
    if (t !== lastT) {
      lastT = t;
      draw();
    }
    const f = runProgress(t / clip.stop);
    canvas.style.transform = `translate3d(${(offscreen * (1 - f)).toFixed(1)}px,0,0)`;
    if (video.ended || video.paused) finish();
  };

  const go = () => {
    if (!alive) return;
    if (reduceMotion) {
      // No run: appear standing on the last frame.
      video.addEventListener('seeked', finish, { once: true });
      video.currentTime = Math.max(0, video.duration - 0.05);
      return;
    }
    video.play().then(loop).catch(finish);
  };

  return {
    place(layout) {
      const box = runnerBox(layout, clip);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const pw = Math.max(1, Math.round(box.w * dpr));
      const ph = Math.max(1, Math.round(box.h * dpr));
      canvas.style.left = `${box.x}px`;
      canvas.style.top = `${box.y}px`;
      canvas.style.width = `${Math.round(box.w)}px`;
      canvas.style.height = `${Math.round(box.h)}px`;
      offscreen = box.offscreen;
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        lastT = -1;
        if (state === 'done') draw();
      }
      if (state === 'idle') canvas.style.transform = `translate3d(${offscreen.toFixed(1)}px,0,0)`;
      else if (state === 'done') canvas.style.transform = 'translate3d(0,0,0)';
    },
    start() {
      if (state !== 'idle') return;
      state = 'running';
      if (video.readyState >= 2) go();
      else {
        video.addEventListener('loadeddata', go, { once: true });
        video.addEventListener('error', finish, { once: true });
      }
    },
    destroy() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute('src');
      video.load();
    },
  };
}
