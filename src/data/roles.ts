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
    dates: '2014 — 2016',
    loc: 'Foothill Ranch, CA',
    desc: 'Delivered brand and graphic design across web and print, managed clients directly, and ran photoshoots.',
    tags: ['Brand', 'Visual Design', 'Art Direction'],
    designW: 1,
    devW: 0.12,
  },
  {
    n: '02',
    company: 'Metagenics',
    role: 'Frontend Dev / Sr. UX',
    disc: 'UX Design & Eng',
    dates: '2016 — 2021',
    loc: 'Aliso Viejo, CA',
    desc: 'Built the PLMC clinic app experience backed by user research, and designed and developed the e-commerce website.',
    tags: ['UX', 'User Research', 'E-Commerce', '0 → 1'],
    designW: 0.78,
    devW: 0.62,
  },
  {
    n: '03',
    company: 'Five & Done',
    role: 'Developer',
    disc: 'Engineering',
    dates: '2021 — 2022',
    loc: 'Websites for Fender',
    desc: 'Built and shipped websites for major brands, including Fender, in a fast-moving agency environment.',
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
    desc: 'Founding member of a two-sided vet-care marketplace. Designed and built the experience, managed platform integrations, and set product vision while running scrum.',
    tags: ['Design + Dev', 'Integrations', 'Marketplace', '0 → 1'],
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
    desc: 'Designed four connected systems for an FDA-cleared screening device — patient, scheduling ops, examiner clinical, and device quality. The systems have since processed 8,000+ exams.',
    tags: ['Software + Hardware', 'Multi-product', 'FDA / Quality'],
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
    desc: 'Founding product hire. Designed and developed the scan-to-timeline experience with AI insights, ran user testing and scrum, and grew the product from 0 to 6,000+ users.',
    tags: ['0 → 1', 'AI Insights', 'User Research', 'Systems Integration'],
    designW: 0.75,
    devW: 0.85,
  },
];
