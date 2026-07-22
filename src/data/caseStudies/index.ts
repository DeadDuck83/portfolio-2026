import type { CaseStudy } from './types';
import { plmc } from './plmc';
import { sage } from './sage';
import { bexa } from './bexa';
import { parkerAce } from './parker-ace';

/**
 * Registry of published case studies, keyed by slug.
 *
 * To add a new one (Parker & Ace, Bexa, Sage): copy `plmc.ts`, fill in the
 * content, import it here, and add it to the map below. The layout is already
 * data-driven — no new components required. Then link it from `src/data/work.ts`
 * (set the row's `to` field) and update the previous case study's
 * `nextCase.to`.
 */
export const caseStudies: Record<string, CaseStudy> = {
  [sage.slug]: sage,
  [bexa.slug]: bexa,
  [parkerAce.slug]: parkerAce,
  [plmc.slug]: plmc,
};

export function getCaseStudy(slug: string | undefined): CaseStudy | undefined {
  return slug ? caseStudies[slug] : undefined;
}

export type { CaseStudy };
