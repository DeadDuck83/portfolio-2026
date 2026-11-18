import type { CaseStudy } from './types';

/**
 * Case study 01 — Sage Healthspan (founding product hire / product owner).
 * Structure: Brief → Context → Process → Solution → Outcome (no Users chapter).
 */
export const sage: CaseStudy = {
  slug: 'sage',
  caseNumber: '01',
  eyebrowRight: 'Sage Healthspan · Consumer Longevity Platform',

  headlineLead: 'Your health has been telling a story. ',
  headlineAccent: 'Now you can read it.',
  intro:
    "Most people have years of lab results they can't read. As Sage's founding product hire, I helped turn them into a health timeline and next steps you can act on.",
  tldr: 'Scan old lab results, get a timeline and AI insight you can act on. Zero to 6,000+ users.',
  meta: {
    role: 'Founding Product Hire · Product Owner',
    org: 'Sage Healthspan',
    timeline: '2023 to present · 0 → 1',
    scope: 'Product Design · AI · Consumer Health',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '1440 × 630',
    aspect: '1440/630',
    innerLabel: 'Healthspan hero — lifespan to healthspan',
    src: '/case-studies/sage/Sage-01.jpg',
    alt: 'Sage Healthspan hero — lifespan to healthspan with app screens',
  },
  // Sage green: the app's primary (buttons, rings, charts)
  brand: { color: '#589077', ink: '#0e0c09' },

  flows: [
    {
      title: 'Scan your tests',
      line: 'Any lab report becomes your record, and a person checks what the scanner misses.',
      screens: [
        { src: '/case-studies/sage/flows/scan-1-add.webp', alt: 'Add data: upload a PDF, scan a paper report, or scan a urine strip', label: 'Upload, scan, or strip' },
        { src: '/case-studies/sage/flows/scan-2-camera.webp', alt: 'The camera framing a paper lab report, with Fail, shutter, and Done', label: 'Photograph the report' },
        { src: '/case-studies/sage/flows/scan-3-loading.webp', alt: 'Loading: a page being scanned, line by line', label: 'Reading it' },
        { src: '/case-studies/sage/flows/scan-4-request.webp', alt: 'Request review: a HIPAA-trained admin checks de-identified data', label: 'If the scan does not look right, user can submit for review' },
        { src: '/case-studies/sage/flows/scan-5-dashboard.webp', alt: 'The dashboard, full: the new result in review, biological age, insights, out-of-range values, and categories', label: 'Your dashboard, filled in' },
      ],
    },
    {
      title: 'See the trend',
      line: "Every biomarker against its range over time, not just today's number.",
      cover: 2,
      screens: [
        { src: '/case-studies/sage/flows/trend-1-dashboard.webp', alt: 'The dashboard scrolled to Categories: Blood Sugar Balance, Cardiometabolic, and Detox', label: 'Categories on the dashboard' },
        { src: '/case-studies/sage/flows/trend-2-category.webp', alt: 'Blood Sugar Balance: cortisol, estradiol, glucose, and insulin, each with its latest value and trend', label: 'Inside a category' },
        { src: '/case-studies/sage/flows/trend-3-result.webp', alt: 'Cortisol over time against its range, with what it is and where each value came from', label: 'One result, over time' },
      ],
    },
    {
      title: 'Sage Insights',
      line: 'AI reads the whole report back in plain words, with questions for your doctor.',
      cover: 1,
      screens: [
        { src: '/case-studies/sage/flows/insights-1-ready.webp', alt: 'Dashboard: your insights are ready, above out-of-range results and categories', label: 'Insights are ready' },
        { src: '/case-studies/sage/flows/insights-2-analyze.webp', alt: 'Analyze results: personalized insights, AI-powered trends, and context-driven analysis', label: 'Analyze my data' },
        { src: '/case-studies/sage/flows/insights-3-summary.webp', alt: 'A health summary, cardiovascular health, and questions to ask your doctor', label: 'Plain words, real questions' },
      ],
    },
    {
      title: 'Gap analysis',
      line: 'Finds the tests your results are missing and tells you which to get next.',
      screens: [
        { src: '/case-studies/sage/flows/gaps-1-dashboard.webp', alt: 'Dashboard: a comprehensive panel recommended, and biological age missing 3 of 9 required biomarkers', label: 'The gap, on your dashboard' },
        { src: '/case-studies/sage/flows/gaps-2-push.webp', alt: 'Health tip notifications, one per gap: a PSA or testosterone panel, heart health, a hormone check, thyroid, vitamin D, and a full panel, each with Get Panel', label: 'A nudge for each gap, not a diagnosis' },
        { src: '/case-studies/sage/flows/gaps-3-list.webp', alt: 'Notifications: gap analysis for a PSA panel, heart health, and thyroid health', label: 'Every gap, in one place' },
      ],
    },
    {
      title: 'Share with your practitioner',
      line: 'Everything in one PDF, sent with your consent.',
      cover: 1,
      screens: [
        { src: '/case-studies/sage/flows/share-1-settings.webp', alt: 'Settings, with Share results', label: 'From settings' },
        { src: '/case-studies/sage/flows/share-2-report.webp', alt: 'Step 1: generate a detailed PDF report of your blood test data, with a Generate PDF button', label: 'One PDF' },
        { src: '/case-studies/sage/flows/share-3-send.webp', alt: 'Step 2: send it to a practitioner, with consent to share medical records', label: 'Sent with consent' },
      ],
    },
  ],

  context: {
    chapter: {
      label: 'Context',
      subtitle: 'the data was already there',
    },
    h2: "Everyone's health data is already in a drawer, unread.",
    paragraphs: [
      "Old lab PDFs, no context, no trends. Sage's job was to make what people already have readable and actionable, without a new test or a new bill.",
    ],
    panelLabel: 'From unread files to a next step',
    chips: [
      'Old lab PDFs',
      'No context',
      'No trends',
      'Guesswork',
      'Scan',
      'Health timeline',
      'Gap analysis',
      'Next step',
    ],
    captionBefore: 'The "before" state.',
    captionAfter: 'Readable, and actionable.',
  },

  process: {
    chapter: {
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'We made our bets. The data moved them.',
    paragraph: 'I owned research, roadmap, and much of the build, alongside a small design and engineering team.',
    decisions: [
      {
        title: 'Show the gaps, not just the numbers.',
        choice:
          'Gap analysis flags what deserves a closer look and turns it into a next step: a question for your doctor, a test, or a supplement.',
        cost: "Guidance, never diagnosis. It points people where to look and never tells them what's wrong.",
      },
      {
        title: 'We bet on the trends. Users bet on the scanner.',
        choice:
          '100 results free, then a flat $10 for unlimited, and hundreds of scans a day at peak. So scanning became the front door.',
        cost: "We set down features we'd assumed people wanted. Following the evidence beat defending the plan.",
      },
      {
        title: 'Keep a human in the loop, without touching their data.',
        choice:
          'Old results come in every format. Low-confidence scans went to a de-identified review queue: a reviewer saw only the values, corrected them, and sent them back.',
        cost: "More to build than trusting the OCR. It's the difference between a number you rely on and one you second-guess.",
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '1400 × 900',
        aspect: '1400/900',
        innerLabel: 'Lab results pipeline architecture',
        src: '/case-studies/sage/Sage-02.jpg',
        alt: 'Sage lab-results ingestion architecture — S3, EventBridge, Textract, and status updates',
        caption: {
          tag: 'FIG. A',
          desc: 'The scan pipeline: OCR, review, and status updates.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '800 × 600',
        aspect: '800/600',
        innerLabel: 'Purchase → lab status flow',
        src: '/case-studies/sage/Sage-03.jpg',
        alt: 'Sage app flow from how to purchase through lab test status tracking',
        caption: {
          tag: 'FIG. B',
          desc: 'Ordering a follow-up test without leaving the app.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '800 × 600',
        aspect: '800/600',
        innerLabel: 'User research synthesis',
        src: '/case-studies/sage/Sage-04.jpg',
        alt: 'Sage user research synthesis — survey themes on results, data, and notifications',
        caption: {
          tag: 'FIG. C',
          desc: 'Research: confusing results, scattered data, and how people wanted to be guided.',
        },
      },
    ],
  },

  solution: {
    chapter: {
      label: 'Solution',
      subtitle: 'the part with the pictures',
    },
    principles: [
      {
        numeral: 'i.',
        title: 'Scan, and understand.',
        text: 'Point your phone at an old result and Sage reads it into your record. No typing.',
      },
      {
        numeral: 'ii.',
        title: 'A timeline you can actually read.',
        text: "Every value over time, in plain language. The trend, not just today's number.",
      },
      {
        numeral: 'iii.',
        title: 'Gaps that point you somewhere.',
        text: 'A page of numbers becomes a short list of things to do.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '1400 × 900',
        aspect: '1400/900',
        innerLabel: 'AI insights + sageMD+',
        src: '/case-studies/sage/Sage-05.jpg',
        alt: 'Sage Analyze results AI screen and sageMD+ proactive health marketing site',
        caption: {
          tag: '01',
          lead: 'Scan, timeline, and insight.',
          desc: 'The app, and the site that sells the same promise.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '800 × 600',
        aspect: '800/600',
        innerLabel: 'Integration ecosystem',
        src: '/case-studies/sage/Sage-07.jpg',
        alt: 'Sage Healthspan final integration ecosystem — Quest, AI, Shopify, and more',
        caption: {
          tag: '02',
          lead: 'One platform, many vendors.',
          leadInline: true,
          desc: ' Quest, AI, commerce, and support in one hub.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'At-home tests and kits',
        src: '/case-studies/sage/Sage-08.jpg',
        alt: 'Sage at-home test and hormone optimization kit product cards',
        caption: {
          tag: '03',
          lead: 'When free love meets paid.',
          leadInline: true,
          desc: ' At-home tests and kits: the hunt for what people would pay for.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      label: 'Outcome',
      subtitle: 'what got built, and what I learned',
    },
    lead: 'Zero to 6,000+ users, and a signal we almost bet against.',
    paragraphs: [
      'People scanned, read their insights, and far fewer bought. They loved the free product and stopped at the paid one. That gap pushed us toward at-home tests and supplements.',
    ],
    asideLabel: 'What I learned',
    lessons: [
      {
        title: "The feature people love isn't always the one they'll pay for.",
        text: 'Watch where people drop between using and paying. It tells you more than any usage number.',
      },
      {
        title: 'Follow the data over your own bet.',
        text: 'We were sure it was the trends. Users said scanning. The fastest thing I did right was believe them.',
      },
    ],
  },

  // Collage-only images (not placed in the page body).
  gallery: [
    {
      placeholder: 'Gallery',
      dims: '1200 × 1200',
      aspect: '1/1',
      innerLabel: 'App screens collage',
      src: '/case-studies/sage/Animation-square02.png',
      alt: 'Sage app screens — dashboard, biological age, biomarker detail, and purchase flow',
      caption: {
        tag: 'APP',
        lead: 'The product surfaces.',
        desc: 'Dashboard, biological age, biomarker detail, and the purchase path — the app as members actually used it.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1200 × 1200',
      aspect: '1/1',
      innerLabel: 'Lifestyle photography',
      src: '/case-studies/sage/Animation-square03.png',
      alt: 'Sage lifestyle photography — wellness, lab work, and aging well',
      caption: {
        tag: 'PHOTO',
        lead: 'The world around the data.',
        desc: 'Lifestyle and clinical photography that framed Sage as everyday health, not another medical portal.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1200 × 1200',
      aspect: '1/1',
      innerLabel: 'Brand and UI exploration',
      src: '/case-studies/sage/Animation-square04.png',
      alt: 'Sage brand mood board with mushroom-inspired palette and light/dark home screens',
      caption: {
        tag: 'BRAND',
        lead: 'Look and feel.',
        desc: 'Early brand and UI exploration — earthy palette into light and dark home screens.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1200 × 1200',
      aspect: '1/1',
      innerLabel: 'Health category icons',
      src: '/case-studies/sage/Animation-square05.png',
      alt: 'Sage health category icons — blood, cardiometabolic, thyroid, and more',
      caption: {
        tag: 'SYSTEM',
        lead: 'Categories you can scan into.',
        desc: 'Icon system for the health areas Sage could read from a pile of old results.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '7465 × 5274',
      aspect: '7465/5274',
      innerLabel: 'Color system',
      src: '/case-studies/sage/colors-sage.jpg',
      alt: 'Sage color palette and brand swatches',
      caption: {
        tag: 'COLOR',
        lead: 'The palette.',
        desc: 'Brand color system that had to feel like everyday health, not another medical portal.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '4618 × 2992',
      aspect: '4618/2992',
      innerLabel: 'Light and dark modes',
      src: '/case-studies/sage/color-modes-sage.jpg',
      alt: 'Sage light and dark mode tokens with dashboard, insights, labs, and shop screens',
      caption: {
        tag: 'THEME',
        lead: 'Light and dark, same system.',
        desc: 'Token set mapped across dashboard, insights, labs, and shop so both themes stay one product.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1950 × 1491',
      aspect: '1950/1491',
      innerLabel: 'Environmental range states',
      src: '/case-studies/sage/weather-ranges-sage.jpg',
      alt: 'Sage environmental health cards for air quality, UV, allergens, and humidity',
      caption: {
        tag: 'RANGES',
        lead: 'Good, moderate, unhealthy.',
        desc: 'Air, UV, allergens, and humidity as range states — the same language as a lab result, for the world around you.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '5899 × 3342',
      aspect: '5899/3342',
      innerLabel: 'Graph scale logic',
      src: '/case-studies/sage/test-graph-ui-explanation-sage.jpg',
      alt: 'Whiteboard explaining how Sage biomarker graphs scale around result, upper, and lower bounds',
      caption: {
        tag: 'LOGIC',
        lead: 'How the graph finds its top and bottom.',
        desc: 'Scale rules for a result that sits inside, outside, or missing a bound — so a blood-test chart always has room to breathe.',
      },
    },
  ],

  nextCase: {
    label: 'Bexa Suite',
    note: '— the med-device one.',
    to: '/work/bexa',
  },
};
