import { describe, it, expect } from 'vitest';
import { plmc } from './plmc';
import { sage } from './sage';
import { collectCaseStudyFigures, collectCaseStudyImages } from './figures';

describe('collectCaseStudyFigures', () => {
  it('returns hero, process, solution, and gallery figures in order', () => {
    const all = collectCaseStudyFigures(plmc);
    expect(all[0]).toBe(plmc.heroFigure);
    expect(all).toEqual([
      plmc.heroFigure,
      ...plmc.process.figures,
      ...plmc.solution.figures,
      ...(plmc.gallery ?? []),
    ]);
  });

  it('filters to assets that have a src', () => {
    const images = collectCaseStudyImages(plmc);
    expect(images.length).toBeGreaterThan(0);
    expect(images.every((f) => Boolean(f.src))).toBe(true);
    // Sage has hero + process + solution wired.
    expect(collectCaseStudyImages(sage).length).toBe(11);
  });

  it('includes collage-only gallery figures when present', () => {
    const extra = {
      placeholder: 'Gallery',
      dims: '100 × 100',
      aspect: '1/1',
      innerLabel: 'Extra shot',
      src: '/case-studies/plmc/extra.jpg',
    };
    const images = collectCaseStudyImages({ ...plmc, gallery: [extra] });
    expect(images.some((f) => f.src === extra.src)).toBe(true);
  });
});
