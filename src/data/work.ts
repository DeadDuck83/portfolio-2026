/**
 * "Selected work" rows on the home page.
 * `title` is the product thesis (what it is); `brand` is the company / case name.
 * `imageSrc` is the row's card image, shown whole beside the copy.
 */
export interface WorkItem {
  n: string;
  /** Product thesis — the lead headline on the work band. */
  title: string;
  /** Company / case name — quiet label under the thesis. */
  brand: string;
  roleTag: string;
  description: string;
  tags: string[];
  /** Card image (1199×731) — shown whole beside the copy in the work row. */
  imageSrc: string;
  imageAlt: string;
  /** External URL (new tab). */
  href?: string;
  /** Internal case-study route, e.g. "/work/plmc". */
  to?: string;
  /** Text shown as the CTA. */
  endLabel: string;
  /** Trailing glyph after endLabel: "↗" external, "→" internal, none. */
  endGlyph?: '↗' | '→';
}

export const work: WorkItem[] = [
  {
    n: '01',
    title: 'AI-powered healthspan insights',
    brand: 'Sage Healthspan',
    roleTag: 'Product Owner · Consumer Health',
    description:
      'Founding product hire on a consumer health app: scan old lab results, build a personal timeline, and surface AI gap analysis people can act on — zero to 6,000+ users.',
    tags: ['0 → 1', 'AI Insights', 'Consumer Health', 'OCR / Data'],
    imageSrc: '/work/sage.jpg',
    imageAlt: 'Sage app home screen surrounded by biological age, insights and lab result cards',
    to: '/work/sage',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '02',
    title: 'Four systems around one exam',
    brand: 'Bexa Suite',
    roleTag: 'UX / Product Designer · Bexa',
    description:
      'Designed four connected systems around an FDA-cleared breast-cancer screening device: patient app, scheduling ops, examiner clinical, and device quality — turning one exam into a working medical service.',
    tags: ['0 → 1', 'Software + Hardware', 'Multi-product', 'FDA / Quality'],
    imageSrc: '/work/bexa.jpg',
    imageAlt: 'Bexa patient app, scheduling calendar, clinical exam and quality dashboard',
    to: '/work/bexa',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '03',
    title: 'Clinic and booking for neighborhood vets',
    brand: 'Parker & Ace',
    roleTag: 'Founding Designer / Product',
    description:
      'Founding designer at a veterinary startup, shaping the core booking and clinic flows for a two-sided marketplace around real vendor constraints.',
    tags: ['Two-sided Marketplace', '0 → 1', 'Strategy'],
    imageSrc: '/work/parkerandace.jpg',
    imageAlt: 'Parker & Ace website on a laptop beside the appointment app',
    to: '/work/parker-ace',
    endLabel: 'Case study',
    endGlyph: '→',
  },
  {
    n: '04',
    title: 'One patient picture for every visit',
    brand: 'PLMC',
    roleTag: 'UX Designer / Frontend · Metagenics',
    description:
      "Original designer on a zero-to-one clinic experience. Built the five functions of health behind its scoring system and the summary that shows a patient's whole picture at once.",
    tags: ['0 → 1', 'Health Scoring System', 'Service Design', 'User Research'],
    imageSrc: '/work/plmc.jpg',
    imageAlt: 'Clinician reviewing the PLMC health summary on a wall screen with a patient',
    to: '/work/plmc',
    endLabel: 'Case study',
    endGlyph: '→',
  },
];
