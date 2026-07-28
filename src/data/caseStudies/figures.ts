import type { CaseStudy, Figure } from './types';

/**
 * Gather every figure attached to a case study, in reading order.
 * Keeps the collage resilient as chapter structures vary — add new
 * figure arrays here when a case study grows a new media section.
 */
export function collectCaseStudyFigures(cs: CaseStudy): Figure[] {
  return [
    cs.heroFigure,
    ...cs.process.figures,
    ...cs.solution.figures,
    ...(cs.gallery ?? []),
  ];
}

/** Figures that already have a real asset (skip gray placeholders). */
export function collectCaseStudyImages(cs: CaseStudy): Figure[] {
  return collectCaseStudyFigures(cs).filter((f): f is Figure & { src: string } => Boolean(f.src));
}

/** True for explicit video figures or common video file extensions. */
export function isVideoFigure(figure: Figure): boolean {
  if (figure.kind === 'video') return true;
  if (figure.kind === 'image') return false;
  return Boolean(figure.src?.match(/\.(mp4|webm|mov)(\?|$)/i));
}
