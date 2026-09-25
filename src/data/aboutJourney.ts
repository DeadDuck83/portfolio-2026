/**
 * "About me" journey on the home page: an intro, four chapters carried into
 * focus one at a time, and a "Today" synthesis. Chapter order matches the
 * four Rive background timelines (chapter 1 → timeline 1, and so on).
 */
export interface AboutChapter {
  n: string;
  discipline: string;
  companies: string;
  /** Rendered as "Taught me <em>{lesson}</em>". */
  lesson: string;
  body: string;
  tags: string[];
}

export interface AboutStat {
  big: string;
  label: string;
}

export const aboutIntro = {
  eyebrow: '/ About me',
  titleLead: 'A nonlinear path to a more',
  titleEm: 'holistic',
  titleTail: 'perspective.',
  body: 'Each chapter taught me something different. This is the path that got me here.',
} as const;

export const aboutChapters: AboutChapter[] = [
  {
    n: '01',
    discipline: 'Graphic design',
    companies: 'Mob Media · Metagenics',
    lesson: 'clarity.',
    body: 'Design taught me to communicate complex ideas visually, turning information into something people can understand and act on.',
    tags: ['Visual design', 'Brand', 'Communication'],
  },
  {
    n: '02',
    discipline: 'Development',
    companies: 'Metagenics · Five & Done',
    lesson: 'systems.',
    body: 'Development taught me how products actually get built, from technical constraints and APIs to the systems behind the interface.',
    tags: ['Frontend', 'APIs', 'Technical thinking'],
  },
  {
    n: '03',
    discipline: 'Product design',
    companies: 'Parker & Ace · Bexa',
    lesson: 'usability.',
    body: 'Product design taught me to turn complex workflows into experiences people can understand, navigate, and use with confidence.',
    tags: ['User research', 'UX/UI', 'Systems thinking'],
  },
  {
    n: '04',
    discipline: 'Product ownership',
    companies: 'Sage Healthspan',
    lesson: 'usefulness.',
    body: 'Ownership taught me to balance user needs, business goals, and technical realities, and to decide what was actually worth building.',
    tags: ['Strategy', 'Roadmaps', 'Stakeholders'],
  },
];

export const aboutToday = {
  eyebrow: '/ The synthesis',
  titleLead: 'Today, I bring it',
  titleEm: 'together.',
  body: 'I bring design, technical understanding, and product judgment together to make complicated products feel simple.',
  stats: [
    { big: '10+ yrs', label: 'In design + product' },
    { big: '10+', label: 'Products shipped' },
    { big: '4', label: 'Startups' },
    { big: 'Both', label: 'Corporate + mom-and-pop' },
  ] satisfies AboutStat[],
} as const;
