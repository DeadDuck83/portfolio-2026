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
    "Sage set out to make personalized health work for everyday people. The insight underneath it: most of us already carry years of health data, old lab results and records, that we can't actually read or use. As the founding product hire, I helped turn that into something usable. You scan your old results, Sage reads them and builds a personal health timeline, and the AI reads the trends to show you where to look deeper: a question for your doctor, a follow-up test you can order through Sage, or a supplement worth a closer look. We grew it past 6,000 users.",
  tldr: "A consumer health app built on one idea: you already have the data, you just can't use it. Scan old lab results, get a health timeline and AI insight you can act on. Zero to 6,000+ users.",
  meta: {
    role: 'Founding Product Hire · Product Owner',
    org: 'Sage Healthspan',
    timeline: '2023 to present · 0 → 1',
    scope: 'Product Design · Product Ownership · AI · Consumer Health',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '1440 × 630',
    aspect: '1440/630',
    innerLabel: 'Healthspan hero — lifespan to healthspan',
    src: '/case-studies/sage/Sage-01.jpg',
    alt: 'Sage Healthspan hero — lifespan to healthspan with app screens',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'the data was already there',
    },
    h2: "The raw material for personalized health is sitting in everyone's files, unread.",
    paragraphs: [
      "Most people have a trail of old lab results and records, but it shows up as PDFs and numbers with no context. You can't tell what your bloodwork means, whether anything is trending the wrong way, or what to do about it. The ingredients for real, personalized health are already in the drawer. They're just unreadable.",
      "Sage's job was to make them legible. Take what someone already has and turn it into a picture they can understand and act on, without making them start over with a new test and a new bill.",
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
      numeral: '02',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'We made our bets. The data moved them.',
    paragraph:
      'As the founding product hire I owned research, roadmap, and a lot of the build, working alongside a small design and engineering team.',
    decisions: [
      {
        title: 'Start from the data people already have.',
        choice:
          "Don't make people begin from zero. Start with the results already in their files, scan them, and build from there. The fastest path to value is the data they already own, not another test.",
        cost: 'Old results arrive in every format imaginable. A lot of the work lived in the OCR and review layer that turns a messy PDF into clean, structured data you can build on.',
      },
      {
        title: 'A timeline, not a dashboard.',
        choice:
          'Show results as a personal health timeline, not a one-time readout. Healthspan is about which way things are trending, so the product had to make change over time the main event.',
        cost: 'A timeline only works if you have history and can line up results that were never meant to sit together. More plumbing than a snapshot, and worth it.',
      },
      {
        title: "Don't just show results. Show the gaps worth chasing.",
        choice:
          "Reading a number isn't the goal, knowing what to do about it is. Sage runs a gap analysis across your results and trends, flags the gaps worth a closer look, and turns each one into a next step: a question for your doctor, a follow-up test you can order through Sage, or a supplement worth considering. You get an action, not just a value.",
        cost: "On health data, the line that matters is guidance versus diagnosis. Gap analysis had to point people to where to look and help them ask sharper questions, never tell them what's wrong. The first version keeps it simple on purpose, surfacing the gaps that matter, with plenty of room to grow.",
      },
      {
        title: 'We bet on the trends. Users bet on the scanner.',
        choice:
          "We shipped the scan and the trending views, then headed straight for the lab-panel purchase, sure the trends would be the draw. The data said otherwise. People went wild for scanning. We let them store up to 100 results free, then charged a flat $10 for unlimited, and at peak we were seeing hundreds of scans a day. So we followed them and treated scanning as the front door, not a step on the way to something else.",
        cost: "Leaning into the thing people actually loved meant setting down some of what we'd assumed they'd want. But a product that guesses wrong and won't adjust is worse than one that gets surprised and follows the evidence.",
      },
      {
        title: 'Keep a human in the loop, without touching their data.',
        choice:
          "Not every scan came back clean, and on health data a wrong number isn't an acceptable default. So we built the Document For Review flow. When a scan wasn't confident enough for someone to approve, it went to a review queue stripped of everything identifying. A team member saw only the scanned values, checked them, and sent the corrected scan back to the user's device.",
        cost: "A de-identified review loop is more to design and run than trusting the OCR and moving on. It's also the difference between a number a person can rely on and one they have to second-guess.",
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
          desc: 'The scan pipeline end to end — OCR, review, and status updates that turn a messy PDF into data someone can trust.',
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
          desc: 'When a gap pointed to a follow-up test, the purchase path stayed in-app — order to draw to results as one status trail.',
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
          desc: 'Research as the foundation — confusing results, scattered data, and how people wanted to be guided.',
        },
      },
    ],
  },

  solution: {
    chapter: {
      numeral: '03',
      label: 'Solution',
      subtitle: 'the part with the pictures',
    },
    principles: [
      {
        numeral: 'i.',
        title: 'Scan, and understand.',
        text: 'Point your phone at an old lab result and Sage reads it, cleans it up, and pulls the numbers into your record. The messy PDF becomes usable data with no manual typing.',
      },
      {
        numeral: 'ii.',
        title: 'A timeline you can actually read.',
        text: "Your results laid out over time, each value in plain language and in context, so you see the trend, not just today's number.",
      },
      {
        numeral: 'iii.',
        title: 'Gap analysis that points you somewhere.',
        text: 'Sage flags the gaps in your results worth a closer look and turns each into a next step: a question for your doctor, a test you can order through Sage, or a supplement to consider. A page of numbers becomes a short list of things to actually do.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '1400 × 900',
        aspect: '1400/900',
        innerLabel: 'AI insights + sageMD+',
        hoverLift: true,
        src: '/case-studies/sage/Sage-05.jpg',
        alt: 'Sage Analyze results AI screen and sageMD+ proactive health marketing site',
        caption: {
          tag: '01',
          lead: 'Scan, timeline, and insight.',
          desc: 'Personalized analysis in the app — and a public face that sells the same promise: proactive health, made practical.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '800 × 600',
        aspect: '800/600',
        innerLabel: 'Integration ecosystem',
        hoverLift: true,
        src: '/case-studies/sage/Sage-07.jpg',
        alt: 'Sage Healthspan final integration ecosystem — Quest, AI, Shopify, and more',
        caption: {
          tag: '02',
          lead: 'One platform, many vendors.',
          leadInline: true,
          desc: ' Quest, AI, commerce, and support wired into one hub — the plumbing behind scan, timeline, and next step.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'At-home tests and kits',
        hoverLift: true,
        src: '/case-studies/sage/Sage-08.jpg',
        alt: 'Sage at-home test and hormone optimization kit product cards',
        caption: {
          tag: '03',
          lead: 'When free love meets paid.',
          leadInline: true,
          desc: ' At-home tests and kits — the bet on what people might pay for after scanning won the engagement fight.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      numeral: '04',
      label: 'Outcome',
      subtitle: 'what got built, and what I learned',
    },
    lead: 'Zero to 6,000+ users, and a signal we almost bet against.',
    paragraphs: [
      'Sage went from a blank page to a working product with more than 6,000 users. Scanning became the runaway feature, hundreds a day at peak, and the Document For Review flow kept those scans trustworthy. But the order people used things told the real story. They scanned, they reviewed, they read their insights, and then far fewer of them bought. They loved the free product and stopped at the paid one. That gap is what pushed us toward at-home tests and supplements, hunting for the thing people would actually pay for.',
    ],
    asideLabel: 'What I learned',
    lessons: [
      {
        title: "The feature people love isn't always the one they'll pay for.",
        text: 'We won the engagement fight and still had a conversion problem, and no amount of scanning volume papers over that. Watching where people drop between using and paying is worth more than any single usage number.',
      },
      {
        title: 'Follow the data over your own bet.',
        text: 'We were sure the trends would be the draw. Users told us it was scanning. The fastest thing I did right was believe them and move the product toward what they were already doing.',
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
  ],

  nextCase: {
    label: 'Bexa Suite',
    note: '— the med-device one.',
    to: '/work/bexa',
  },
};
