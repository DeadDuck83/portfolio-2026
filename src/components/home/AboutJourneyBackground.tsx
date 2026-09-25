import { useEffect, useRef } from 'react';
import { Alignment, Fit, Layout, useRive, useViewModelInstanceNumber } from '@rive-app/react-canvas';
import { nextChapterStep, riveTargetFromChapter } from './aboutJourneyRive';

export interface AboutJourneyBackgroundProps {
  /** 0 = intro, 1–4 = chapter in focus, 5 = Today. */
  chapter: number;
}

const SRC = '/background/about_me_v8.riv';
const ARTBOARD = 'Artboard 1';
const STATE_MACHINE = 'State Machine 1';

/**
 * How long to wait between queue steps so each Rive timeline can finish before
 * the next begins. Forward waits for a `Chapter N` motion to play through;
 * reverse only needs the shorter pose morph. Matched to the .riv (~1.5s / ~0.4s)
 * — bump these if the motions are re-timed in the editor.
 */
const FORWARD_STEP_MS = 1600;
const REVERSE_STEP_MS = 500;

const layout = new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter });

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Background figure for the About journey, driven purely by data binding.
 *
 * Scroll reports a target chapter; we walk `ViewModel1.chapter` toward it **one
 * step at a time**, waiting between steps so every `Chapter N` motion plays to
 * its end before the next starts — a queue. Skipping several chapters therefore
 * plays each motion in turn (the figure "catches up") instead of whipsawing the
 * graph, and it always walks back down to `Intro`. `State Machine 1` owns the
 * actual motion; the only thing we write is the number.
 * https://rive.app/docs/runtimes/react/data-binding
 */
export default function AboutJourneyBackground({ chapter }: AboutJourneyBackgroundProps) {
  const { rive, RiveComponent } = useRive({
    src: SRC,
    artboard: ARTBOARD,
    stateMachine: STATE_MACHINE,
    autoplay: true,
    autoBind: true,
    layout,
    shouldDisableRiveListeners: true,
  });

  const { setValue: setChapter } = useViewModelInstanceNumber('chapter', rive?.viewModelInstance);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const walkingRef = useRef(false);
  const timerRef = useRef(0);
  const setChapterRef = useRef(setChapter);
  setChapterRef.current = setChapter;
  const riveRef = useRef(rive);
  riveRef.current = rive;

  useEffect(() => {
    if (!rive) return;
    rive.resizeDrawingSurfaceToCanvas();

    const onResize = () => rive.resizeDrawingSurfaceToCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [rive]);

  // Walk the graph toward the scrolled-to chapter, one held step at a time.
  useEffect(() => {
    if (!setChapter || prefersReducedMotion()) return;
    targetRef.current = riveTargetFromChapter(chapter);

    const pump = () => {
      const next = nextChapterStep(currentRef.current, targetRef.current);
      if (next === currentRef.current) {
        walkingRef.current = false;
        return;
      }
      walkingRef.current = true;
      const forward = next > currentRef.current;
      currentRef.current = next;
      setChapterRef.current(next);
      // Nudge the render loop in case the machine had gone idle at a hold.
      const r = riveRef.current;
      if (r && !r.isPlaying) r.play();
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(pump, forward ? FORWARD_STEP_MS : REVERSE_STEP_MS);
    };

    // If a walk is already running it will pick up the new target on its next
    // step; otherwise kick it off now.
    if (!walkingRef.current) pump();
  }, [setChapter, chapter]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return <RiveComponent className="about-journey__rive" />;
}
