import { describe, expect, it } from 'vitest';
import { nextChapterStep, RIVE_CHAPTERS, riveTargetFromChapter } from './aboutJourneyRive';

describe('riveTargetFromChapter', () => {
  it('ignores the intro and parks Today on the last hold', () => {
    expect(riveTargetFromChapter(0)).toBe(0);
    expect(riveTargetFromChapter(-1)).toBe(0);
    expect(riveTargetFromChapter(1)).toBe(1);
    expect(riveTargetFromChapter(2)).toBe(2);
    expect(riveTargetFromChapter(RIVE_CHAPTERS)).toBe(RIVE_CHAPTERS);
    // "Today" is chapter RIVE_CHAPTERS + 1 and parks on the final hold.
    expect(riveTargetFromChapter(RIVE_CHAPTERS + 1)).toBe(RIVE_CHAPTERS);
  });
});

describe('nextChapterStep', () => {
  it('walks one chapter at a time toward the target', () => {
    expect(nextChapterStep(0, 4)).toBe(1); // forward, single step even on a big jump
    expect(nextChapterStep(2, 4)).toBe(3);
    expect(nextChapterStep(4, 0)).toBe(3); // reverse, single step
    expect(nextChapterStep(1, 0)).toBe(0);
  });

  it('holds once it has arrived', () => {
    expect(nextChapterStep(3, 3)).toBe(3);
    expect(nextChapterStep(0, 0)).toBe(0);
  });
});
