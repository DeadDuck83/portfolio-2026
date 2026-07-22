import type { CaseStudy } from './types';

/**
 * Case study 04 — Metagenics / PLMC clinic app.
 * This is the master template all other case studies are cloned from.
 */
export const plmc: CaseStudy = {
  slug: 'plmc',
  caseNumber: '04',
  eyebrowRight: 'PLMC · Personalized Lifestyle Medical Center',

  headlineLead: 'The whole patient, on ',
  headlineAccent: 'one screen.',
  intro:
    "A functional-medicine clinic was drowning in its own thoroughness — blood panels, body scans, questionnaires, motor tests, phone data. I designed and built the clinic app that reads it all in one sitting, so clinicians and patients don't have to.",
  tldr: 'Clinic collects everything → nobody can read everything → one screen that does → shorter prep, smarter visits.',
  meta: {
    role: 'Frontend Dev / Sr. UX',
    org: 'Metagenics · PLMC',
    timeline: '2019 — 2021 · 0 → 1',
    scope: 'Research · UX/UI · Frontend',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'Health Summary UI — wide crop',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'the clinic that measured everything',
    },
    h2: "The data wasn't missing. It was hiding — in seven different systems.",
    paragraphs: [
      "A visit at PLMC starts with genuine mountains of signal: a full blood panel, an InBody composition scan, intake questionnaires, motor and balance testing, lifestyle data straight from the patient's phone. All useful. All in different systems, formats, and — occasionally — printouts.",
      'Clinicians prepped by tab-hopping. Patients heard their results in fragments. Nobody, at any point, saw the whole person at once.',
    ],
    panelLabel: "One patient's paper trail",
    chips: [
      'Vitals',
      'Blood panel',
      'InBody scan',
      'MSQ intake',
      'Questionnaires',
      'Motor testing',
      'Phone data',
    ],
    captionBefore: 'The "before" state.',
    captionAfter: 'This was the job, basically.',
  },

  users: {
    chapter: {
      numeral: '02',
      label: 'Two users',
      subtitle: 'same screen, opposite fluency',
    },
    h2: 'The hard constraint: this screen gets read aloud, in the room, by both of them.',
    personas: [
      {
        label: 'User 01',
        name: 'The clinician',
        subtitle: 'eight minutes between visits',
        needs: [
          'Prep the whole chart in one pass, not seven tabs',
          'Outliers surfaced first; normal ranges can wait',
          'Trust the source — every value traceable to its system',
        ],
      },
      {
        label: 'User 02',
        name: 'The patient',
        subtitle: 'first time ever seeing an ALT value',
        needs: [
          '"Am I okay?" answered by shape and color, not jargon',
          'What changed since last visit, at a glance',
          'Something worth taking home and acting on',
        ],
      },
    ],
    pullLead:
      'Every layout decision below traces back to that shared-screen moment — ',
    pullAccent: 'glanceable for one, legible for both.',
  },

  process: {
    chapter: {
      numeral: '03',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Sat in on visits, mapped every data source to the moment it’s needed — then made four calls that shaped everything.',
    paragraph:
      'Because I was also the one building it, every sketch was checked against the real integration payloads before it earned a second iteration. Slower ideation, zero "we can’t build that" later.',
    decisions: [
      {
        title: 'One scroll, not tabs.',
        choice:
          'A single vertical summary over a tabbed dashboard. Prep is linear reading, not lookup — a clinician shouldn’t have to remember where anything lives.',
        cost: 'Fought information density the whole way. Every module had to earn its vertical space or get collapsed.',
      },
      {
        title: 'Plot ranges, not numbers.',
        choice:
          'Every value drawn against its healthy range — a shape you read before a number you parse. This is what made the screen work for patients.',
        cost: 'Real engineering cost: reference ranges per data type, per lab, per demographic. Worth every hour.',
      },
      {
        title: 'Feasibility at the sketch.',
        choice:
          'Every sketch reviewed against the real integration payloads before iteration two. If the data couldn’t arrive, the layout didn’t survive.',
        cost: 'Slower ideation, and some pretty concepts died early. In exchange: zero “we can’t build that” rework.',
      },
      {
        title: 'Two reading levels, one layout.',
        choice:
          'Clinical labels with plain-language subtitles, instead of a separate simplified patient view.',
        cost: 'Denser rows and harder copywriting — but one codebase, and both people point at the same pixel.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2400 × 1400',
        aspect: '12/7',
        innerLabel: 'Data-flow / visit journey map',
        caption: {
          tag: 'FIG. A',
          desc: 'Every source, every hand-off, mapped against the moment a clinician actually needs it.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Early sketches / whiteboard',
        caption: {
          tag: 'FIG. B',
          desc: 'The whiteboard phase — first layout died here, cheaply.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Mid-fi wireframes',
        caption: {
          tag: 'FIG. C',
          desc: 'Wireframes annotated with the integration payload each region draws from.',
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
        text: 'Glanceable first, precise second — shape and color answer before numbers do.',
      },
      {
        numeral: 'ii.',
        text: 'Every value carries its context — plotted against its healthy range, never floating alone.',
      },
      {
        numeral: 'iii.',
        text: 'One screen, two reading levels — clinical labels with plain-language subtitles, one codebase.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2880 × 1800',
        aspect: '8/5',
        innerLabel: 'Health Summary — full dashboard',
        hoverLift: true,
        caption: {
          tag: '01',
          lead: 'Health Summary — everything, one scroll.',
          desc: 'Vitals, blood panel, questionnaires, lifestyle data, and the 5 Functions of Health score — the whole patient before the doorknob turns.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Biometric Screening detail',
        hoverLift: true,
        caption: {
          tag: '02',
          lead: 'Biometric Screening.',
          leadInline: true,
          desc: ' InBody scan data plotted against healthy ranges — "how am I doing?" mostly answers itself.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Motor Skills results',
        hoverLift: true,
        caption: {
          tag: '03',
          lead: 'Motor Skills.',
          leadInline: true,
          desc: ' Balance, dexterity, and strength a clinician can read from across the room.',
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
      { kind: 'count', to: 7, suffix: ' → 1', label: 'Data sources, one summary' },
      { kind: 'count', to: 5, label: 'Functions of health, scored at a glance' },
      { kind: 'static', display: '0 → 1', label: 'Built from scratch, shipped to clinic' },
    ],
    closingParagraph:
      'Clinicians opened one screen before every visit instead of many. Patients finally saw their health the way the clinic did — as one connected picture, not a stack of results. And because feasibility was checked at the sketch stage, what we designed is what actually shipped.',
    ifIDidItAgain:
      'Involve the front-desk staff even earlier. They knew where the paper piled up long before we did.',
  },

  nextCase: {
    label: 'Parker & Ace',
    note: '— the vet one. Brewing.',
    // No `to` yet — Parker & Ace case study is not built.
  },
};
