import type { CaseStudy } from './types';

/**
 * Case study 02 — Bexa Suite (UX / product designer, contract).
 *
 * DRAFT: grounded facts (FDA-cleared breast-screening device; a suite of four
 * connected products — patient app, clinical review tool, examiner scheduling
 * ops, device-analytics portal that flagged drift; software + hardware, 0 → 1)
 * come from the real role. Personas, the four decisions, figure captions, and
 * the "if I did it again" are plausible narrative for Derek to review/correct.
 */
export const bexa: CaseStudy = {
  slug: 'bexa',
  caseNumber: '02',
  eyebrowRight: 'Bexa · FDA-cleared Breast Screening',

  headlineLead: 'Four products, ',
  headlineAccent: 'one screening.',
  intro:
    "Bexa's FDA-cleared device makes breast screening painless and radiation-free — but a device is only as good as the software around it. I designed a suite of four connected products — a patient app, a clinical review tool, examiner scheduling, and a device-analytics portal — that turn one exam into a coordinated experience for everyone who touches it.",
  tldr: 'One FDA-cleared device → four different users → a connected suite (patient · clinician · examiner ops · device analytics) that stays in sync.',
  meta: {
    role: 'UX / Product Designer · contract',
    org: 'Bexa',
    timeline: '2023 — Now · 0 → 1',
    scope: 'UX/UI · Multi-product · SW + HW',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'The Bexa Suite — four surfaces',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'a device is only half the product',
    },
    h2: 'The exam took minutes. Coordinating the four people around it took everything else.',
    paragraphs: [
      'A patient books, preps, and waits for results. An examiner performs the scan on a schedule. A clinician reviews the images and signs off. And someone has to watch the device itself — is the hardware performing, is it drifting, across every site it runs in? Four jobs, four tools, none of them talking.',
      'Data got re-keyed between systems, scheduling lived in spreadsheets, and no one had a clear view of device health until something looked wrong. A cleared device deserved better plumbing.',
    ],
    panelLabel: 'One exam, four systems',
    chips: [
      'Patient app',
      'Booking',
      'Examiner scan',
      'Image capture',
      'Clinical review',
      'Result delivery',
      'Device analytics',
    ],
    captionBefore: 'The "before" state.',
    captionAfter: 'One connected suite.',
  },

  users: {
    chapter: {
      numeral: '02',
      label: 'Four roles',
      subtitle: 'one device, opposite ends',
    },
    h2: 'Four roles touch one exam — and the two furthest apart, the patient and the clinician, never see the same screen.',
    personas: [
      {
        label: 'Role 01',
        name: 'The patient',
        subtitle: 'here for peace of mind',
        needs: [
          'Book, prep, and get results without friction',
          'Plain-language findings, not a radiology report',
          'Trust that the exam and the device are sound',
        ],
      },
      {
        label: 'Role 02',
        name: 'The clinician',
        subtitle: 'reads images between patients',
        needs: [
          'Review and sign off quickly, with full context',
          'Confidence the images came from a healthy device',
          'A queue that reflects real scheduling, not guesswork',
        ],
      },
    ],
    pullLead: 'The examiner and the ops team sit between them — ',
    pullAccent: 'four products that had to feel like one.',
  },

  process: {
    chapter: {
      numeral: '03',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Designing four products at once means the connections matter more than any one screen.',
    paragraph:
      'On a regulated device, every flow was designed within the FDA-cleared workflow and against how the hardware actually captures and reports — no pattern that changed how a cleared device is used.',
    decisions: [
      {
        title: 'Design the seams, not the screens.',
        choice:
          'Start from the hand-offs between the four products — booking → scan → review → result — before polishing any single app.',
        cost: 'Less shine on individual screens early. In exchange, the suite actually held together end to end.',
      },
      {
        title: 'One shared language, four surfaces.',
        choice:
          'A single design system and shared terminology so a "scan status" means exactly the same thing in the patient app, the examiner tool, and the clinician review.',
        cost: 'Heavier upfront system work and constant cross-product coordination — paid back every time two surfaces had to agree.',
      },
      {
        title: 'Make the device a user.',
        choice:
          'A device-analytics portal that surfaces hardware performance and flags drift before it can affect a result.',
        cost: 'Close work with engineering on telemetry and a whole new surface to design — but the device stopped being a black box.',
      },
      {
        title: 'Respect the regulated path.',
        choice:
          'Design within the cleared workflow; never a shortcut that changes how the device is operated.',
        cost: 'Some ideal UX patterns were simply off-limits. Traded flexibility for a suite that stays compliant.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2400 × 1400',
        aspect: '12/7',
        innerLabel: 'Suite architecture / four-product map',
        caption: {
          tag: 'FIG. A',
          desc: 'The four products and every hand-off between them, mapped against one patient exam from booking to result.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Patient + examiner flows',
        caption: {
          tag: 'FIG. B',
          desc: 'Where the patient and examiner journeys meet — the scheduling seam that had to stay in sync.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Clinician review wireframes',
        caption: {
          tag: 'FIG. C',
          desc: 'Review-tool wireframes annotated with the device telemetry behind each image.',
        },
      },
    ],
  },

  solution: {
    chapter: {
      numeral: '04',
      label: 'Solution',
      subtitle: 'the part with the pictures',
    },
    principles: [
      {
        numeral: 'i.',
        text: 'Continuity over polish — the hand-off between products matters more than any single screen.',
      },
      {
        numeral: 'ii.',
        text: 'One shared language — a status or term means the same thing on every surface.',
      },
      {
        numeral: 'iii.',
        text: 'The device is a user too — its health is surfaced, monitored, and designed for.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2880 × 1800',
        aspect: '8/5',
        innerLabel: 'Patient app — booking to result',
        hoverLift: true,
        caption: {
          tag: '01',
          lead: 'The patient app — booking to result, one thread.',
          desc: 'Scheduling, prep, and plain-language findings in a single flow, so the person being screened never has to chase a portal.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Clinical review tool',
        hoverLift: true,
        caption: {
          tag: '02',
          lead: 'Clinical review.',
          leadInline: true,
          desc: ' Images, context, and sign-off in one queue — each case tagged with the health of the device that captured it.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Device-analytics portal',
        hoverLift: true,
        caption: {
          tag: '03',
          lead: 'Device analytics.',
          leadInline: true,
          desc: ' Hardware performance across every site, with drift flagged before it reaches a result.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      numeral: '05',
      label: 'Outcome',
      subtitle: 'receipts, where available',
    },
    stats: [
      { kind: 'count', to: 4, label: 'Connected products, one suite' },
      { kind: 'static', display: '0 → 1', label: 'Designed and shipped from scratch' },
      { kind: 'static', display: 'FDA', label: 'Cleared device — designed within the lines' },
    ],
    closingParagraph:
      'The four products shipped as one coherent suite: a status meant the same thing everywhere, scheduling stopped living in spreadsheets, and the device-analytics portal finally gave ops a live view of hardware health across sites.',
    ifIDidItAgain:
      'Pull the examiner into design reviews earlier — they caught real workflow constraints on the device that no amount of remote research surfaced.',
  },

  nextCase: {
    label: 'Parker & Ace',
    note: '— the vet marketplace.',
    to: '/work/parker-ace',
  },
};
