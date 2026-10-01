/**
 * Scrubbed squares animation for the About rail. Drives `squares_v2.riv`'s
 * "Timeline 1" playhead directly — no state machine, no inputs, no data binding.
 * The page sets a target mark (seconds) and we ease the playhead there with the
 * low-level @rive-app/canvas-advanced runtime; the render loop runs only while
 * easing (plus a one-shot frame when a mark is set at rest), so scrolling up
 * runs the choreography backwards for free.
 * https://rive.app/docs/runtimes/web/low-level-api-usage
 */

/** Scroll-driven ease between marks. */
export function easeInOutCubic(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** How long to ease the playhead from one mark to the next. */
export const SCRUB_MS = 1500;

/**
 * Make the artboard fill transparent so the page shows through the strokes.
 * The fill is the color shared by at least two corners, and it has to cover
 * most of the frame — otherwise a stroke sitting on a corner would be treated
 * as the fill and the drawing would disappear.
 */
export function knockOutFill(data: Uint8ClampedArray, width: number, tolerance = 6): boolean {
  const pixels = Math.floor(data.length / 4);
  const height = width > 0 ? Math.floor(pixels / width) : 0;
  if (width < 2 || height < 2) return false;
  const corners = [0, (width - 1) * 4, (height - 1) * width * 4, ((height - 1) * width + width - 1) * 4];
  const opaque = corners.filter((i) => data[i + 3] > 200);
  if (opaque.length < 2) return false;
  const sample = opaque[0];
  const br = data[sample];
  const bg = data[sample + 1];
  const bb = data[sample + 2];
  const close = (i: number) =>
    Math.abs(data[i] - br) <= tolerance &&
    Math.abs(data[i + 1] - bg) <= tolerance &&
    Math.abs(data[i + 2] - bb) <= tolerance;
  if (opaque.filter(close).length < 2) return false;
  const hits: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 0 && close(i)) hits.push(i);
  }
  if (hits.length < pixels * 0.4) return false;
  for (const i of hits) data[i + 3] = 0;
  return true;
}

export interface SquaresOptions {
  src: string;
  artboard: string;
  animation: string;
  /** Playhead marks in seconds; index 0 is the resting "appear" pose. */
  marks: readonly number[];
  /** Jump straight to marks instead of easing. */
  reducedMotion?: boolean;
}

export interface SquaresController {
  /** Ease the playhead to `marks[index]` (clamped). */
  setMark(index: number): void;
  /** Re-fit the drawing surface to the canvas's CSS box. */
  resize(): void;
  destroy(): void;
}

/**
 * Load the clip and return a controller. The heavy WASM runtime is imported
 * dynamically here, so callers can defer this until the section is near.
 */
export async function createSquares(
  canvas: HTMLCanvasElement,
  opts: SquaresOptions,
): Promise<SquaresController> {
  const RiveCanvas = (await import('@rive-app/canvas-advanced-single')).default;
  const rive = await RiveCanvas();
  const bytes = await fetch(opts.src).then((r) => r.arrayBuffer());
  const file = await rive.load(new Uint8Array(bytes));

  const artboard = file.artboardByName(opts.artboard);
  const animation = artboard.animationByName(opts.animation);
  const anim = new rive.LinearAnimationInstance(animation, artboard);
  const renderer = rive.makeRenderer(canvas);
  const bounds = artboard.bounds;
  // Read duration from the LinearAnimation, not the instance — the instance's
  // duration/fps come back NaN, which would collapse clamp() to ~0 (stuck frame).
  // (duration/fps exist at runtime but aren't in the published type defs.)
  const meta = animation as unknown as { duration?: number; fps?: number };
  const durationSec = meta.fps && meta.fps > 0 ? (meta.duration ?? 0) / meta.fps : 5;
  const clamp = (t: number) => (t < 0 ? 0 : t > durationSec - 1e-3 ? durationSec - 1e-3 : t);
  const markTime = (i: number) => clamp(opts.marks[i] ?? opts.marks[0] ?? 0);

  let alive = true;
  let raf = 0;
  let current = markTime(0);
  let from = current;
  let target = current;
  let startTs = 0;
  let easing = false;
  // Frames still to draw while at rest. A one-shot frame doesn't always present
  // with this runtime, so a rest-set paints a short burst to be sure.
  let pendingFrames = 0;

  // All drawing happens inside rive.requestAnimationFrame so the runtime flushes
  // and presents the frame itself (a manual flush must not be mixed with it).
  const paint = (t: number) => {
    anim.time = clamp(t);
    anim.apply(1);
    artboard.advance(0);
    renderer.beginFrame();
    renderer.save();
    renderer.align(
      rive.Fit.contain,
      rive.Alignment.center,
      { minX: 0, minY: 0, maxX: canvas.width, maxY: canvas.height },
      bounds,
    );
    artboard.draw(renderer);
    renderer.restore();
    // Rive flushes after this frame callback returns, so strip the fill then.
    // Read the context after Rive flushes this frame. Grabbing it earlier can
    // bind an empty 2d context before the renderer has drawn.
    queueMicrotask(() => {
      if (!alive) return;
      const ctx2d = canvas.getContext('2d');
      if (!ctx2d) return;
      const { width, height } = canvas;
      if (width < 1 || height < 1) return;
      const img = ctx2d.getImageData(0, 0, width, height);
      if (knockOutFill(img.data, width)) ctx2d.putImageData(img, 0, 0);
    });
  };

  const frame = (ts: number) => {
    if (!alive) {
      raf = 0;
      return;
    }
    if (easing) {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / SCRUB_MS);
      current = from + (target - from) * easeInOutCubic(p);
      if (p >= 1) {
        current = target;
        easing = false;
      }
      paint(current);
    } else if (pendingFrames > 0) {
      paint(current);
      pendingFrames -= 1;
    }
    raf = easing || pendingFrames > 0 ? rive.requestAnimationFrame(frame) : 0;
  };

  const schedule = () => {
    if (!raf) raf = rive.requestAnimationFrame(frame);
  };

  const fit = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    pendingFrames = 4;
    schedule();
  };

  fit();

  return {
    setMark(index) {
      if (!alive) return;
      const t = markTime(index);
      if (opts.reducedMotion || Math.abs(t - current) < 1e-3) {
        current = from = target = t;
        easing = false;
        pendingFrames = 4;
        schedule();
        return;
      }
      from = current;
      target = t;
      startTs = 0;
      easing = true;
      schedule();
    },
    resize() {
      if (alive) fit();
    },
    destroy() {
      alive = false;
      if (raf) rive.cancelAnimationFrame(raf);
      anim.delete();
      artboard.delete();
      file.unref();
    },
  };
}
