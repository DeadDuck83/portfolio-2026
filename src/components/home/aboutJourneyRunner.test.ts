import { describe, expect, it } from 'vitest';
import { keyBlack, runProgress, runnerBox, RUNNER_CLIP, RUNNER_SCALE } from './aboutJourneyRunner';

describe('runProgress', () => {
  it('starts at the edge and lands exactly in place', () => {
    expect(runProgress(0)).toBe(0);
    expect(runProgress(1)).toBeCloseTo(1, 6);
    expect(runProgress(-1)).toBe(0);
    expect(runProgress(2)).toBeCloseTo(1, 6);
  });

  it('cruises at a constant stride, then only decelerates', () => {
    const v = (p: number) => runProgress(p + 0.01) - runProgress(p);
    expect(v(0.1)).toBeCloseTo(v(0.5), 6);
    expect(v(0.75)).toBeGreaterThan(v(0.85));
    expect(v(0.85)).toBeGreaterThan(v(0.95));
    for (let p = 0; p < 1; p += 0.05) expect(runProgress(p + 0.05)).toBeGreaterThan(runProgress(p));
  });
});

describe('runnerBox', () => {
  const layout = { copyLeft: 640, copyTop: 200, copyHeight: 480, sideInset: 64 };

  it('sizes the runner to 2/3 of the copy height and centres it in the open column', () => {
    const b = runnerBox(layout);
    const charH = b.h * (RUNNER_CLIP.charH / RUNNER_CLIP.sh);
    expect(charH).toBeCloseTo(layout.copyHeight * RUNNER_SCALE, 6);
    const avail = layout.copyLeft - 32 - layout.sideInset;
    expect(b.x).toBe(Math.round(layout.sideInset + (avail - b.w) / 2));
    expect(b.y + b.h / 2).toBeCloseTo(layout.copyTop + layout.copyHeight / 2, 0);
    expect(b.offscreen).toBeLessThan(-(b.x + b.w));
  });

  it('shrinks to fit a narrow column, keeping the clip aspect', () => {
    const b = runnerBox({ ...layout, copyLeft: 220 });
    expect(b.w).toBe(220 - 32 - 64);
    expect(b.h / b.w).toBeCloseTo(RUNNER_CLIP.sh / RUNNER_CLIP.sw, 6);
  });
});

describe('keyBlack', () => {
  it('drops the black ground, keeps the sprite, feathers the band without darkening it', () => {
    // black, near-black, mid-band edge, solid sprite colour
    const px = new Uint8ClampedArray([0, 0, 0, 255, 8, 8, 8, 255, 22, 11, 0, 255, 200, 120, 40, 255]);
    keyBlack(px);
    expect(px[3]).toBe(0);
    expect(px[7]).toBe(0);
    expect(px[11]).toBe(Math.round(((22 - 10) / 24) * 255));
    expect(px[8]).toBe(44); // 22 / 0.5 — un-premultiplied
    expect(px[15]).toBe(255);
    expect(px[12]).toBe(200);
  });
});
