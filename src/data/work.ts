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
      'Grew a longevity platform from zero to 6,000+ users. Unified Quest lab-ordering, payments, and the app into a single checkout, and shipped an AI health timeline that turned scattered data into insight users could act on.',
    tags: ['0 → 1', 'Systems Integration', 'AI Insights', 'HIPAA'],
    href: 'https://sagehealthspan.com',
    endLabel: '2023 — Now',
    endGlyph: '↗',
  },
  {
    n: '02',
    title: 'Bexa',
    roleTag: 'UX / Product Designer · Med Device',
    description:
      'Designed a suite of four connected products for an FDA-cleared breast-cancer screening device — a patient app, a clinical review tool, examiner scheduling ops, and a device-analytics portal that monitored hardware performance and flagged drift.',
    tags: ['0 → 1', 'Software + Hardware', 'Multi-product', 'Analytics Portal'],
    href: 'https://mybexa.com',
    endLabel: '2023 — Now',
    endGlyph: '↗',
  },
  {
    n: '03',
    title: 'Parker & Ace',
    roleTag: 'Product Manager · Marketplace',
    description:
      'Founding member of an early-stage veterinary care startup — a two-sided clinic marketplace. Set product vision and strategy, ran scrum, and led code reviews and production deploys, designing flows around real vendor and integration constraints.',
    tags: ['Two-sided Marketplace', '0 → 1', 'Strategy'],
    // Not yet linked — will point to /work/parker-ace when the case study ships.
    endLabel: '2023',
  },
  {
    n: '04',
    title: 'PLMC',
    roleTag: 'Frontend Dev / Sr. UX · Metagenics',
    description:
      'Owned UX and product-facing work for the PLMC clinic app and e-commerce platforms — a zero-to-one build — researching CMS and commerce integrations and validating designs for technical feasibility.',
    tags: ['E-commerce', 'Clinic App', 'Frontend', 'User Research'],
    to: '/work/plmc',
    endLabel: 'Case study',
    endGlyph: '→',
  },
];
