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
    "Bexa screens for breast cancer with a handheld device that reads tissue density — no radiation, no compression. But a device isn't a service. Scaling it means scheduling exams, running them, delivering results, and proving the whole thing holds up. I came in as a contractor to review the exam service, reporting, and patient experience, and stayed to design the four systems that turn one device into a working medical service.",
  tldr: 'One FDA-cleared device, four kinds of users, and reporting that had to go from placeholder data to something a clinician could stake a call on. Four systems: patient, scheduling ops, examiner clinical, and device quality.',
  meta: {
    role: 'UX / Product Designer · contract',
    org: 'Bexa',
    timeline: '2023 to present · 0 → 1',
    scope: 'Audit · Product Design · Multi-product · Software + Hardware',
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
      numeral: '01',
      label: 'Context',
      subtitle: 'a device is only half the product',
    },
    h2: 'The exam is the easy part. The service around it is the design problem.',
    paragraphs: [
      'A Bexa exam looks like this: an examiner brings the handheld device and an ultrasound on site, screens with Bexa, and confirms a flagged mass with ultrasound. Every exam produces two files — the Bexa reading and the ultrasound report — and those feed the analytics.',
      "A device runs an exam, not a service, and the parts meant to connect them weren't holding up. Reporting was the clearest tell: dashboards that looked finished but ran on broken filters and placeholder data. The numbers meant to prove the device worked couldn't be trusted.",
      "It went deeper than reporting. Underneath was legacy code, built years ago by a team long gone, holding scheduling, exams, results, and quality checks together. A new service on old plumbing isn't a patch job. It needed four systems, one for each person who touches an exam.",
    ],
    panelLabel: 'One exam, four systems',
    chips: [
      'Patient · MyBexa',
      'Ops · BexaSupport',
      'Examiner · BexaClinical',
      'Quality · BexaQuality',
      'Rebranding'
    ],
    captionBefore: 'Legacy app, placeholder data.',
    captionAfter: 'Four systems, new position.',
  },

  process: {
    chapter: {
      numeral: '02',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Diagnose first, then build a tool for each person who touches an exam.',
    paragraph:
      'Every call came back to two foundations. 1, on a bexa device the data has to be provable/accurate, and 2, each user needs a tool shaped around their job — not one screen that half-fits everyone.',
    decisions: [
      {
        title: 'Audit before adding.',
        choice:
          "Before designing anything new, I traced what was actually running. That's how the placeholder-data problem surfaced. You can't fix reporting you haven't followed end to end.",
        cost: "It slowed the start and turned up news nobody wanted. It also meant everything after got built on what was real instead of decorating what wasn't.",
      },
      {
        title: 'One service became four.',
        choice:
          'Split the overloaded system into four, each for a distinct user: patient, ops, examiner, and quality. One tool per job instead of one tool pretending to serve everyone.',
        cost: 'Four systems is far more to design, connect, and keep in sync. Worth it — each one finally did its job well instead of all of them doing theirs badly.',
      },
      {
        title: 'Make the device prove itself.',
        choice:
          'FDA-cleared output needs constant watching. With the medical team I defined the data points that confirm a good evaluation for every metric, plus alerts the moment a device drifts out of spec.',
        cost: 'Pinning down what "good" means for each metric is slow, exacting work. It\'s the difference between hoping a device is fine and knowing it.',
      },
      {
        title: 'Two report formats, one pipeline you can trust.',
        choice:
          'The Bexa reading and ultrasound report had to merge into one analytics pipeline people could rely on, replacing the placeholder plumbing underneath.',
        cost: "Two formats from two sources is real integration work, not a mapping table. It's also the only way the numbers add up to something a clinician can stand behind.",
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
          desc: 'Finding Location states walked with the clinical team — Bexa plus ultrasound, including the edge cases a cleared device has to handle.',
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
          desc: 'Empty to filled: imaging and radiologist results as states the examiner actually hits, not a single happy path.',
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
          desc: 'Early patient wireflows — booking and prep shaped around one calm path instead of a scavenger hunt.',
        },
      },
    ],
  },

  solution: {
    chapter: {
      numeral: '03',
      label: 'Solution',
      subtitle: 'four systems, one exam',
    },
    principles: [
      {
        numeral: 'i.',
        title: "MyBexa, the patient's side.",
        text: 'Book, fill in surveys and forms, and read results in plain language. One calm place for the whole screening instead of a scavenger hunt.',
      },
      {
        numeral: 'ii.',
        title: 'BexaSupport, the operation behind the events.',
        text: 'Create clients, set up locations, schedule examiners, and see the business clearly: volume, no-shows versus completions, promotions. Everything that runs the service but isn\'t the exam.',
      },
      {
        numeral: 'iii.',
        title: "BexaClinical, the examiner's workspace.",
        text: 'Where examiners run the exam, record the outcome, and fold in ultrasound findings. Built around how the exam happens on site, not a generic form bent to fit.',
      },
      {
        numeral: 'iv.',
        title: "BexaQuality, the device's watchdog.",
        text: 'The FDA side. Every metric has defined pass conditions, and alerts fire when a device drifts out of spec — before a bad reading reaches a result.',
      },
    ],
    feature: {
      text: "The rebuild traces to one finding: the numbers couldn't be trusted. BexaQuality exists so that never happens quietly again, and every other system feeds it clean, real data.",
    },
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Four systems, one exam',
        hoverLift: true,
        src: '/case-studies/bexa/Bexa-04.jpg',
        alt: 'MyBexa, BexaSupport, BexaClinical, and BexaQuality — four systems around one exam',
        caption: {
          tag: '01',
          lead: 'The four systems, one exam.',
          desc: 'How patient, ops, examiner, and quality connect around a single screening — and where each hand-off has to stay in sync.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Photo shoot for new branded look',
        hoverLift: true,
        fullWidth: true,
        src: '/case-studies/bexa/Bexa-04-b.jpg',
        alt: 'Bexa handheld device and charging base in clinical and product photography',
        caption: {
          tag: '02',
          lead: 'People needed to see it.',
          desc: 'I ran a photo shoot for the new branded look for Bexa. It is replacing an uncomfortable process so I wanted it to look inviting.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Partner schedule page',
        hoverLift: true,
        src: '/case-studies/bexa/Bexa-05.jpg',
        alt: 'Texas Health Resources partner page to schedule a Bexa breast exam',
        caption: {
          tag: '03',
          lead: 'The public face.',
          leadInline: true,
          desc: ' We updated the look and feel of the entire myBexa brand. Targeting a more feminine and welcoming color palette.',
        },
      },
      {
        placeholder: 'Screen 04',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'What is Bexa',
        hoverLift: true,
        src: '/case-studies/bexa/Bexa-06.jpg',
        alt: 'What is Bexa marketing section with device, dock, and SureView tablet',
        caption: {
          tag: '04',
          lead: 'What is Bexa.',
          leadInline: true,
          desc: ' We put the product out in front. Our customers do not know much about Bexa, so we wanted to make sure it was accessable and easy to see what an exam looks like.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      numeral: '04',
      label: 'Outcome',
      subtitle: 'shipped, and still shipping',
    },
    lead: "All four are live. I'm still building them.",
    paragraphs: [
      "The four systems are deployed and in active use. This isn't a write-up I finished and moved on from — I'm still shipping updates on agile cycles as real usage comes in. With 0-1 creations there are always new things that need to be built as soon as it gets in the hands of users.",
    ],
    asideLabel: 'What I actually learned',
    lessons: [
      {
        title: 'On a regulated device, trust is the product.',
        text: "A clean dashboard means nothing if the data under it isn't real. Proving the numbers was as much design work as any screen — and the most important work on the project. I took away from this that I should never trust the data until I have proven it.",
      },
      {
        title: 'One tool for everyone serves no one.',
        text: "Splitting the system into 4 separate systems was a big win at a cost. If I could do it again, I would have spent more time with the Business team to explain the value of each system and how they fit into the overall process. More buy in from the business side would have been helpful.",
      },
      {
        title: 'Diagnose before you design.',
        text: "The most valuable thing I did early was refuse to build until I understood what was actually running. The audit wasn't a delay. It was the work.",
      },
    ],
  },

  nextCase: {
    label: 'Parker & Ace',
    note: '— the community vet.',
    to: '/work/parker-ace',
  },
};
