/**
 * The About rail's squares: `journey.riv` (generated in the journey-squares
 * repo). A script inside the file draws every square and owns all the motion -
 * each chapter's transition and its hold loop - so the page only says which
 * chapter is showing (0 intro, 1-4 chapters, 5 today) and whether to move.
 * Rendering pauses while the canvas is off-screen.
 */
import type { Rive as RiveInstance } from '@rive-app/react-webgl2';

export interface SquaresOptions {
  src: string;
  /** No transitions or loops - jump straight to each pose. */
  reducedMotion?: boolean;
}

export interface SquaresController {
  /** Show chapter `index` (0 intro .. 5 today). */
  setMark(index: number): void;
  /** Re-fit the drawing surface to the canvas's CSS box. */
  resize(): void;
  destroy(): void;
}

/**
 * Load the file and return a controller. The WebGL runtime is imported
 * dynamically, so callers can defer this until the section is near.
 */
export async function createSquares(canvas: HTMLCanvasElement, opts: SquaresOptions): Promise<SquaresController> {
  const { Rive, Layout, Fit, Alignment } = await import('@rive-app/react-webgl2');
  const rive: RiveInstance = await new Promise((resolve, reject) => {
    const r = new Rive({
      src: opts.src,
      canvas,
      stateMachines: 'State Machine 1',
      autoplay: true,
      autoBind: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => resolve(r),
      onLoadError: () => reject(new Error('journey.riv failed to load')),
    });
  });
  rive.resizeDrawingSurfaceToCanvas();
  const vm = rive.viewModelInstance;
  const chapter = vm?.number('chapter');
  const reduced = vm?.number('reduced');
  if (reduced) reduced.value = opts.reducedMotion ? 1 : 0;

  // Only animate while someone can see it.
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) rive.play();
    else rive.pause();
  });
  io.observe(canvas);

  return {
    setMark(index) {
      if (chapter) chapter.value = index;
      if (visible) rive.play();
    },
    resize() {
      rive.resizeDrawingSurfaceToCanvas();
    },
    destroy() {
      io.disconnect();
      rive.cleanup();
    },
  };
}
