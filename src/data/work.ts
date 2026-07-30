/**
 * "Selected work" rows on the home page.
 * `href` is external (opens in a new tab); `to` is an internal case-study
 * route. A row with neither is not yet linked (e.g. Parker & Ace, pending
 * its case study). `endLabel` renders on the right — a date, "Case study →",
 * or an external "↗".
 */
export interface WorkItem {
  n: string;
  title: string;
  roleTag: string;
  description: string;
  tags: string[];
  /** External URL (new tab). */
  href?: string;
  /** Internal case-study route, e.g. "/work/plmc". */
  to?: string;
  /** Text shown at the right of the row. */
  endLabel: string;
  /** Trailing glyph after endLabel: "↗" external, "→" internal, none. */
  endGlyph?: '↗' | '→';
}

export const work: WorkItem[] = [
  {
    n: '01',
    title: 'Sage Healthspan',
    roleTag: 'Product Owner · Consumer Health',
    description:
      'Grew a longevity platform from zero to 6,000+ users, unifying Quest lab-ordering, payments, and an AI health timeline into one app.',
    tags: ['0 → 1', 'Systems Integration', 'AI Insights', 'HIPAA'],
    to: '/work/sage',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '02',
    title: 'Bexa Suite',
    roleTag: 'UX / Product Designer · Bexa',
    description:
      'Designed four connected systems around an FDA-cleared breast-cancer screening device: patient app, scheduling ops, examiner clinical, and device quality — turning one exam into a working medical service.',
    tags: ['0 → 1', 'Software + Hardware', 'Multi-product', 'FDA / Quality'],
    to: '/work/bexa',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '03',
    title: 'Parker & Ace',
    roleTag: 'Founding Designer / Product',
    description:
      'Founding designer at a veterinary startup, shaping the core booking and clinic flows for a two-sided marketplace around real vendor constraints.',
    tags: ['Two-sided Marketplace', '0 → 1', 'Strategy'],
    to: '/work/parker-ace',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '04',
    title: 'PLMC',
    roleTag: 'UX Designer / Frontend · Metagenics',
    description:
      "Original designer on a zero-to-one clinic experience. Built the five functions of health behind its scoring system and the summary that shows a patient's whole picture at once.",
    tags: ['0 → 1', 'Health Scoring System', 'Service Design', 'User Research'],
    to: '/work/plmc',
    endLabel: 'Case study',
    endGlyph: '→',
  },
];
