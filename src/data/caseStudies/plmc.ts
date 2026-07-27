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
    decisionCostLabel: 'The payoff',
    decisions: [
      {
        title: 'Five functions, not fifty tests.',
        choice:
          'Turned a sprawling range of inputs (blood panels, cognitive quizzes, balance and strength tests, functional-health clinicals, behavioral habits) into five clear functions any doctor or patient could read at a glance: Physical, Cognitive, Emotional, Metabolic, Behavioral.',
        cost: 'Every practitioner brought strong, well-earned opinions on what belonged where. My job was to hold the whole conversation, find the common ground, and hand both sides one shared language they trusted. It became the foundation the entire scoring system still runs on.',
      },
      {
        title: 'Eight steps, one payoff screen.',
        choice:
          'Designed every step (history, biometrics, motor skills) to feed a single culminating summary, so the visit builds toward one rewarding moment instead of scattering into disconnected screens.',
        cost: 'The real win was keeping that summary effortless to read even as eight steps of data poured into it. Smart drill-downs let the top stay clean and scannable while every detail stayed one tap away.',
      },
      {
        title: 'Let them watch it arrive.',
        choice:
          'Populated results live as the lab returned them, letting patients see their own numbers land in real time rather than waiting for a finished dashboard.',
        cost: "Research showed patients so captivated watching their data appear that nurses noticed they'd never look away from the screen. That pull was the signal, so I leaned into the live reveal and built a richer, more engaging screen experience around it.",
      },
      {
        title: 'Sequenced the visit so the data compounds.',
        choice:
          'Ordered all eight steps to calm the patient and feed the finale at once. Vitals under a meditation video, a quick blood draw as it ends for early processing, then profile, history, biometrics, and motor skills while the panel runs in the background. By the summary screen, every data point has arrived right on time, and patients leave with their protocol supplements in hand.',
        cost: 'This was design beyond the screen. Lab timing, room flow, and staff handoffs all choreographed so the data lands exactly when it’s needed and no one makes a second trip.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2480 × 1480',
        aspect: '2480/1480',
        innerLabel: 'Patient TV + examiner iPad — live screens',
        src: '/case-studies/plmc/step3_plmc_2x.jpg',
        alt: 'PLMC patient TV and examiner iPad screens for Motor Skills and Biometric Screening, with sticky notes about cognitive load and design review',
        caption: {
          tag: 'FIG. A',
          desc: 'Two surfaces, one visit — the 60″ patient display keeps cognitive load low while the examiner iPad captures what the scribe misses.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1010 × 758',
        aspect: '1010/758',
        innerLabel: 'Early sketches / whiteboard',
        src: '/case-studies/plmc/process-whiteboard.png',
        alt: 'Whiteboard sketch of the PLMC visit flow with red annotations for errors and wait times',
        caption: {
          tag: 'FIG. B',
          desc: 'The whiteboard phase — first layout died here, cheaply.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1010 × 758',
        aspect: '1010/758',
        innerLabel: 'Session journey map',
        src: '/case-studies/plmc/process-session-map.png',
        alt: 'Session 1 visit journey frame mapping patient display, examiner iPad, and PLMx data',
        caption: {
          tag: 'FIG. C',
          desc: 'Patient display, examiner iPad, and PLMx — annotated with what each layer does while blood runs in the background.',
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
    label: 'Sage Healthspan',
    note: '— the longevity one.',
    to: '/work/sage',
  },
};
