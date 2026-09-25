/** How many chapter holds the About Rive graph can land on. */
export const RIVE_CHAPTERS = 4;

/**
 * Map Home's chapter index onto the Rive graph's `chapter` number.
 *
 * 0 = Intro, 1–4 = each chapter's hold, and "Today" (which Home reports as
 * `RIVE_CHAPTERS + 1`) parks on the final hold. That single number is the only
 * thing the runtime writes — `State Machine 1` owns all motion: forward it
 * plays each `Chapter N` timeline through to `Chapter N - End` (cascading when
 * chapters are skipped), and backward it morphs down the `- End` holds to
 * `Intro`. See `AboutJourneyBackground`.
 */
export function riveTargetFromChapter(chapter: number) {
  if (chapter < 1) return 0;
  if (chapter > RIVE_CHAPTERS) return RIVE_CHAPTERS;
  return chapter;
}

/**
 * One step from `current` toward `target` (±1), or `current` when already
 * there. The background walks the graph a chapter at a time so every `Chapter
 * N` timeline plays to its end before the next begins.
 */
export function nextChapterStep(current: number, target: number): number {
  if (current < target) return current + 1;
  if (current > target) return current - 1;
  return current;
}
