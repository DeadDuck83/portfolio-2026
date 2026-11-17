import type { CaseStudy } from './types';

/**
 * Case study 02 — Bexa Suite (UX / product designer, contract).
 * Structure: Brief → Context → Process → Solution → Outcome (no Users chapter).
 * Images still pending — figures are placeholders until assets land in
 * `public/case-studies/bexa/`.
 */
export const bexa: CaseStudy = {
  slug: 'bexa',
  caseNumber: '02',
  eyebrowRight: 'Bexa · FDA-cleared Breast Screening',

  headlineLead: 'One device screens for cancer. ',
  headlineAccent: 'Four systems turn it into a service.',
  intro:
    "Bexa screens for breast cancer with a handheld device: no radiation, no compression. But a device isn't a service. I came in as a contractor to review it and stayed to design the four systems that run it.",
  tldr: 'One FDA-cleared device, four users, four systems: patient, scheduling, examiner, and device quality.',
  meta: {
    role: 'UX / Product Designer · contract',
    org: 'Bexa',
    timeline: '2023 to present · 0 → 1',
    scope: 'Audit · Product Design · Software + Hardware',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'The Bexa Suite — four systems',
    src: '/case-studies/bexa/Bexa-01-hero.jpg',
    alt: 'Bexa handheld breast screening device and suite',
  },

  context: {
    chapter: {
      label: 'Context',
      subtitle: 'a device is only half the product',
    },
    h2: 'The exam is the easy part. The service around it is the design problem.',
    paragraphs: [
      "Every exam produces two files: the Bexa reading and an ultrasound report. The dashboards built on them looked finished but ran on broken filters and placeholder data, over legacy code from a team long gone. The numbers meant to prove the device worked couldn't be trusted.",
    ],
    panelLabel: 'One exam, four systems',
    chips: [
      'Patient · MyBexa',
      'Ops · BexaSupport',
      'Examiner · BexaClinical',
      'Quality · BexaQuality',
      'Rebranding',
    ],
    captionBefore: 'Legacy app, placeholder data.',
    captionAfter: 'Four systems, new position.',
  },

  process: {
    chapter: {
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Diagnose first, then build a tool for each person who touches an exam.',
    paragraph: 'Two rules: the data has to be provable, and each user gets a tool shaped around their job.',
    decisions: [
      {
        title: 'Audit before adding.',
        choice: 'I traced what was actually running before designing anything. That is how the placeholder data surfaced.',
        cost: "A slower start and news nobody wanted. The audit wasn't a delay. It was the work.",
      },
      {
        title: 'One service became four.',
        choice: 'Patient, ops, examiner, and quality each got a tool of their own.',
        cost: 'Far more to design and keep in sync. Each one finally did its job well.',
      },
      {
        title: 'Make the device prove itself.',
        choice:
          'With the medical team I defined what a good evaluation looks like for every metric, plus alerts when a device drifts out of spec.',
        cost: "Slow, exacting work. It's the difference between hoping a device is fine and knowing it.",
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Finding Location — annotated states',
        src: '/case-studies/bexa/Bexa-01.jpg',
        alt: 'Bexa Clinical Finding Location screens with design annotations',
        caption: {
          tag: 'FIG. A',
          desc: 'Finding Location states, edge cases included, walked with the clinical team.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Imaging + results wireframes',
        src: '/case-studies/bexa/Bexa-02.jpg',
        alt: 'Wireframes for adding imaging and radiologist results',
        caption: {
          tag: 'FIG. B',
          desc: 'Imaging and radiologist results, empty to filled.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Patient flow wireframes',
        src: '/case-studies/bexa/Bexa-03.jpg',
        alt: 'Early Bexa patient app wireflow',
        caption: {
          tag: 'FIG. C',
          desc: 'Early patient wireflows: one calm path through booking and prep.',
        },
      },
    ],
  },

  solution: {
    chapter: {
      label: 'Solution',
      subtitle: 'four systems, one exam',
    },
    principles: [
      {
        numeral: 'i.',
        title: "MyBexa, the patient's side.",
        text: 'Book, fill in forms, and read results in plain language.',
      },
      {
        numeral: 'ii.',
        title: 'BexaSupport, the operation behind the events.',
        text: 'Clients, locations, examiner schedules, and the numbers behind them.',
      },
      {
        numeral: 'iii.',
        title: "BexaClinical, the examiner's workspace.",
        text: 'Run the exam, record the outcome, add the ultrasound findings.',
      },
      {
        numeral: 'iv.',
        title: "BexaQuality, the device's watchdog.",
        text: 'Pass conditions for every metric, and alerts before a bad reading reaches a result.',
      },
    ],
    feature: {
      text: "It all traces to one finding: the numbers couldn't be trusted. BexaQuality makes sure that never happens quietly again.",
    },
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Four systems, one exam',
        src: '/case-studies/bexa/Bexa-04.jpg',
        alt: 'MyBexa, BexaSupport, BexaClinical, and BexaQuality — four systems around one exam',
        caption: {
          tag: '01',
          lead: 'The four systems, one exam.',
          desc: 'Where each hand-off has to stay in sync.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Photo shoot for new branded look',
        fullWidth: true,
        src: '/case-studies/bexa/Bexa-04-b.jpg',
        alt: 'Bexa handheld device and charging base in clinical and product photography',
        caption: {
          tag: '02',
          lead: 'People needed to see it.',
          desc: 'I ran a photo shoot for the new brand. Bexa replaces an uncomfortable exam, so it had to look inviting.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Partner schedule page',
        src: '/case-studies/bexa/Bexa-05.jpg',
        alt: 'Texas Health Resources partner page to schedule a Bexa breast exam',
        caption: {
          tag: '03',
          lead: 'The public face.',
          leadInline: true,
          desc: ' A more feminine, welcoming palette across all of myBexa.',
        },
      },
      {
        placeholder: 'Screen 04',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'What is Bexa',
        src: '/case-studies/bexa/Bexa-06.jpg',
        alt: 'What is Bexa marketing section with device, dock, and SureView tablet',
        caption: {
          tag: '04',
          lead: 'What is Bexa.',
          leadInline: true,
          desc: ' Most people don\'t know Bexa yet, so the site shows what an exam looks like.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      label: 'Outcome',
      subtitle: 'shipped, and still shipping',
    },
    stats: [
      {
        kind: 'count',
        to: 9,
        suffix: 'k+',
        label: 'Exams run on the platform',
      },
      {
        kind: 'count',
        to: 4,
        label: 'Unique applications designed and deployed',
      },
      {
        kind: 'count',
        to: 1600,
        suffix: '+',
        label: 'Mass locations identified',
      },
    ],
    lead: "All four are live. I'm still building them.",
    paragraphs: ["All four are in active use, and I'm still shipping updates as real usage comes in."],
    asideLabel: 'What I learned',
    lessons: [
      {
        title: 'On a regulated device, trust is the product.',
        text: "A clean dashboard means nothing if the data under it isn't real. Prove the numbers before you trust them.",
      },
      {
        title: 'One tool for everyone serves no one.',
        text: "Splitting into four was the right call. Next time I'd bring the business team along sooner, so they see why.",
      },
    ],
  },

  // Collage-only media (file in public/case-studies/bexa/, not placed in-page).
  gallery: [
    {
      placeholder: 'Gallery',
      dims: '1196 × 1732',
      aspect: '1196/1732',
      innerLabel: 'Handheld device in use',
      kind: 'video',
      src: '/case-studies/bexa/bexa-device.mp4',
      alt: 'Bexa handheld device screening tissue — no radiation, no compression',
      caption: {
        tag: 'MOTION',
        lead: 'The device in the room.',
        desc: 'A short look at the handheld exam — density reading, no radiation, no compression.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '2880 × 1260',
      aspect: '2880/1260',
      innerLabel: 'Device, palette, exam room',
      src: '/case-studies/bexa/bexa-animation.jpg',
      alt: 'Bexa SureTouch device, brand palette, and exam-room photography',
      caption: {
        tag: 'BRAND',
        lead: 'Make the exam feel inviting.',
        desc: 'Device, palette, and room — the branded look that had to replace an uncomfortable process.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1814 × 1745',
      aspect: '1814/1745',
      innerLabel: 'BexaQuality components',
      src: '/case-studies/bexa/bexaQuality.png',
      alt: 'BexaQuality dashboard components — status ranges, gauges, filters, and alerts',
      caption: {
        tag: 'QUALITY',
        lead: 'The device watchdog, in pieces.',
        desc: 'Range states, gauges, and alerts for BexaQuality — so a drifting device gets flagged before a bad reading does.',
      },
    },
  ],

  nextCase: {
    label: 'Parker & Ace',
    note: '— the community vet.',
    to: '/work/parker-ace',
  },
};
