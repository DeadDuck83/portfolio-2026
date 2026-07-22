/**
 * Career-journey roles for the "The path here" slider on the home page.
 * `designW` / `devW` (0–1) drive the scale/opacity of the two decorative
 * background SVGs (creative strands vs. analytical grid) for the active role.
 */
export interface Role {
  n: string;
  company: string;
  role: string;
  disc: string;
  dates: string;
  loc: string;
  desc: string;
  tags: string[];
  designW: number;
  devW: number;
}

export const roles: Role[] = [
  {
    n: '01',
    company: 'Mob Media',
    role: 'Graphic Designer',
    disc: 'Design',
    dates: 'Where it began',
    loc: '',
    desc: 'Brand and graphic design work that set the visual foundation for everything that followed.',
    tags: ['Brand', 'Visual Design'],
    designW: 1,
    devW: 0.12,
  },
  {
    n: '02',
    company: 'Metagenics',
    role: 'Frontend Dev / Sr. UX',
    disc: 'UX Design & Eng',
    dates: '2019 — 2021',
    loc: 'Aliso Viejo, CA',
    desc: 'Owned UX and product-facing work for the PLMC clinic app and e-commerce platforms — a zero-to-one build, validated for technical feasibility.',
    tags: ['UX', 'Frontend', '0 → 1'],
    designW: 0.78,
    devW: 0.62,
  },
  {
    n: '03',
    company: 'Five & Done',
    role: 'Developer',
    disc: 'Engineering',
    dates: 'Agency',
    loc: 'Websites for Fender',
    desc: 'Built sites for major brands — sharpening the engineering half of a design-and-code skill set.',
    tags: ['Web Dev', 'Brands'],
    designW: 0.18,
    devW: 1,
  },
  {
    n: '04',
    company: 'Parker & Ace',
    role: 'Product Manager',
    disc: 'Product',
    dates: '2023',
    loc: 'Washington, D.C.',
    desc: 'Founding member of a two-sided vet-care marketplace. Set product vision, ran scrum, and led code reviews and production deploys.',
    tags: ['Strategy', 'Marketplace', '0 → 1'],
    designW: 0.72,
    devW: 0.72,
  },
  {
    n: '05',
    company: 'Bexa',
    role: 'UX / Product Designer',
    disc: 'Product + Design',
    dates: '2023 — Now',
    loc: 'Remote · Contract',
    desc: 'Designed four connected products for an FDA-cleared screening device — patient app, clinical review tool, scheduling ops, and a device-analytics portal.',
    tags: ['Software + Hardware', 'Multi-product'],
    designW: 0.88,
    devW: 0.5,
  },
  {
    n: '06',
    company: 'Sage Healthspan',
    role: 'Product Owner',
    disc: 'Product Leadership',
    dates: '2023 — Present',
    loc: 'Remote',
    desc: 'Founding product hire. Grew the app 0 → 6,000+ users, led a small design and engineering team, and owned the full product lifecycle.',
    tags: ['0 → 1', 'Systems Integration', 'AI Insights'],
    designW: 0.75,
    devW: 0.85,
  },
];
