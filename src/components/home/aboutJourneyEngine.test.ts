import { describe, expect, it } from 'vitest';
import { buildTimeline, locate, lockedChapter, riveOpacityAt, themeAt } from './aboutJourneyEngine';

const cfg = { vh: 1000, spacing: 600, count: 4, pace: 0.4, dwell: 180, themeShift: true };

describe('buildTimeline', () => {
  it('lays out in → one step per chapter → out, back to back', () => {
    const { segs, total } = buildTimeline(cfg);
    expect(segs.map((s) => s.kind)).toEqual(['in', 'step', 'step', 'step', 'step', 'out']);
    segs.slice(1).forEach((s, i) => expect(s.start).toBe(segs[i].start + segs[i].len));
    expect(total).toBe(segs[segs.length - 1].start + segs[segs.length - 1].len);
  });

  it('gives each step a travel phase followed by a real hold', () => {
    const step = buildTimeline(cfg).segs[1];
    expect(step.travel).toBe(240);
    expect(step.len).toBe(240 + 180);
  });

  it('drops the entry segment when the theme shift is off', () => {
    expect(buildTimeline({ ...cfg, themeShift: false }).segs[0].kind).toBe('step');
  });
});

describe('locate', () => {
  const { segs } = buildTimeline(cfg);
  const step1 = segs[1];

  it('holds chapter 1 centred for the whole dwell', () => {
    const endTravel = locate(segs, step1.start + step1.travel);
    const endHold = locate(segs, step1.start + step1.len);
    expect(endTravel.x).toBe(cfg.spacing);
    expect(endHold.x).toBe(cfg.spacing);
  });

  it('starts at the intro and ends past the last chapter', () => {
    expect(locate(segs, 0).x).toBe(0);
    const last = segs[segs.length - 1];
    expect(locate(segs, last.start + last.len).x).toBe((cfg.count + 1) * cfg.spacing);
  });
});

describe('lockedChapter', () => {
  const { segs } = buildTimeline(cfg);
  const step1 = segs[1]; // chapter 1 (i = 0)
  const step2 = segs[2]; // chapter 2 (i = 1)

  it('holds the Intro through the entry and the approach to chapter 1', () => {
    expect(lockedChapter(segs[0], 1, false, 4)).toBe(0); // 'in' segment
    expect(lockedChapter(step1, 0.2, false, 4)).toBe(0); // approaching chapter 1
  });

  it('locks a chapter once it is half-way into focus', () => {
    expect(lockedChapter(step1, 0.5, false, 4)).toBe(1);
    expect(lockedChapter(step1, 1, false, 4)).toBe(1);
    expect(lockedChapter(step2, 0.3, false, 4)).toBeNull(); // deeper chapter keeps the last lock
    expect(lockedChapter(step2, 0.5, false, 4)).toBe(2);
  });

  it('honours a custom lock threshold', () => {
    expect(lockedChapter(step2, 0.5, false, 4, 0.9)).toBeNull();
    expect(lockedChapter(step2, 0.95, false, 4, 0.9)).toBe(2);
  });

  it('reports Today once the finale is showing', () => {
    expect(lockedChapter(segs[segs.length - 1], 1, true, 4)).toBe(5);
  });
});

describe('riveOpacityAt', () => {
  const { segs } = buildTimeline(cfg);
  const first = segs[1];

  it('fades in over the tail of the paper shift, fully on as chapter 1 begins', () => {
    expect(riveOpacityAt(first.start * 0.7, first, true)).toBe(0); // fade just starting
    expect(riveOpacityAt(first.start, first, true)).toBe(1); // light paper, chapter 1 travel begins
  });

  it('stays fully on across the chapters, so the Intro shows on reverse too', () => {
    expect(riveOpacityAt(first.start + first.travel * 0.5, first, true)).toBe(1);
    expect(riveOpacityAt(first.start + first.travel, first, true)).toBe(1);
  });
});

describe('themeAt', () => {
  it('is dark at 0, light at 1, and fully visible at both ends', () => {
    const d = themeAt(0);
    const l = themeAt(1);
    expect(d.vars['--ab-paper']).toBe('rgba(26,23,18,1.000)');
    expect(l.vars['--ab-paper']).toBe('rgba(235,229,216,1.000)');
    expect(d.dip).toBe(1);
    expect(l.dip).toBe(1);
  });

  it('dips content to zero at the midpoint while ink flips', () => {
    expect(themeAt(0.5).dip).toBe(0);
  });
});
