/**
 * "About me" journey on the home page: an intro, four chapters carried into
 * focus one at a time, and a "Today" synthesis. Chapter order matches the
 * four Rive background timelines (chapter 1 → timeline 1, and so on).
 */
export interface AboutChapter {
  n: string;
  discipline: string;
  /** Legacy small-caps kicker (pinned version). The rail uses `companyKeys`. */
  companies: string;
  /** Companies for the sentence form "Got me focusing on clarity — at X and Y" (rail). */
  companyKeys: string[];
  /** Words before the emphasized lesson in the rail title. */
  lead: string;
  /** Emphasized lesson word in the card title. */
  lesson: string;
  body: string;
  tags: string[];
}

export interface AboutStat {
  big: string;
  label: string;
}

/** A company behind a chapter — opens a popover from its name in the rail. */
export interface AboutCompany {
  name: string;
  /** One-line description of what they do. */
  blurb: string;
  /** Scale note (team size, stage, reach). */
  scale: string;
  /** Outbound link; omitted when the company's site is gone. */
  href?: string;
}

/**
 * Company registry for the rail's name popovers. Blurb / scale copy is still
 * placeholder; links are real (Mob Media and Parker & Ace no longer exist).
 */
export const aboutCompanies: Record<string, AboutCompany> = {
  'mob-media': {
    name: 'Mob Media',
    blurb: 'Creative agency building brands and marketing sites for growing businesses.',
    scale: 'Small agency · multi-client',
  },
  metagenics: {
    name: 'Metagenics',
    blurb: 'Science-based nutritional supplement company serving practitioners and patients.',
    scale: 'Global · 1,000+ employees',
    href: 'https://www.metagenics.com',
  },
  'five-and-done': {
    name: 'Five & Done',
    blurb: 'Brand and digital studio shipping sites and products for consumer brands.',
    scale: 'Boutique studio',
    href: 'https://www.fiveanddone.com/',
  },
  'parker-ace': {
    name: 'Parker & Ace',
    blurb: 'Veterinary care startup rethinking the neighborhood clinic experience.',
    scale: 'Early-stage startup',
  },
  bexa: {
    name: 'Bexa',
    blurb: 'Breast-health company pairing a screening device with its software.',
    scale: 'Startup · hardware + software',
    href: 'https://mybexa.com',
  },
  sage: {
    name: 'Sage Healthspan',
    blurb: 'Longevity platform turning lab work into a guided healthspan program.',
    scale: 'Startup · 0→1',
    href: 'https://sagehealthspan.com',
  },
};

export const aboutIntro = {
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
    companyKeys: ['mob-media', 'metagenics'],
    lead: 'Got me focusing on',
    lesson: 'clarity.',
    body: 'Design taught me to communicate complex ideas visually, turning information into something people can understand and act on.',
    tags: ['Visual design', 'Brand', 'Communication', 'Ecom web design'],
  },
  {
    n: '02',
    discipline: 'Development',
    companies: 'Metagenics · Five & Done',
    companyKeys: ['metagenics', 'five-and-done'],
    lead: 'Made me understand',
    lesson: 'systems.',
    body: 'Development taught me how products actually get built, from technical constraints and APIs to the systems behind the interface.',
    tags: ['Frontend', 'APIs', 'Technical thinking'],
  },
  {
    n: '03',
    discipline: 'Product design',
    companies: 'Parker & Ace · Bexa',
    companyKeys: ['parker-ace', 'bexa'],
    lead: 'Made me see the',
    lesson: 'usability.',
    body: 'Product design taught me to turn complex workflows into experiences people can understand, navigate, and use with confidence.',
    tags: ['User research', 'UX/UI', 'Systems thinking'],
  },
  {
    n: '04',
    discipline: 'Product ownership',
    companies: 'Sage Healthspan',
    companyKeys: ['sage'],
    lead: 'Showed me the',
    lesson: 'usefulness.',
    body: 'Ownership taught me to balance user needs, business goals, and technical realities, and to decide what was actually worth building.',
    tags: ['Strategy', 'Roadmaps', 'Stakeholders'],
  },
];

export const aboutToday = {
  titleLead: 'Today, I bring it',
  titleEm: 'together.',
  body: 'I bring design, technical understanding, and product judgment together to make complicated products feel simple.',
  stats: [
    { big: '10+ yrs', label: 'In design + product' },
    { big: '10+', label: 'Products shipped' },
    { big: '4', label: 'Startups' },
    { big: 'All sizes', label: 'mom-&-pop to corporate' },
  ] satisfies AboutStat[],
} as const;
