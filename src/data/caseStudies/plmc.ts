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
  tldr: 'Seven systems of patient data, one screen both clinician and patient can read in the room — shorter prep, smarter visits.',
  meta: {
    role: 'Frontend Dev / Sr. UX',
    org: 'Metagenics · PLMC',
    timeline: '2019 — 2021 · 0 → 1',
    scope: 'Research · UX/UI · Frontend',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2760 × 1208',
    aspect: '2760/1208',
    innerLabel: 'Health Summary UI — wide crop',
    src: '/case-studies/plmc/caseStudy_PLMC_hero.jpg',
    alt: 'PLMC health summary UI — wide crop of the clinic app dashboard',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'the clinic that measured everything',
    },
    h2: "The data wasn't missing. It just wasn't in a single place that worked together.",
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
        title: 'One language everyone speaks.',
        text: "Blood, brain, balance, strength, habits — it all rolls up into five clear scores. The doctor still has every detail underneath; you get a picture you can actually hold onto. Same five functions, whether you've read charts for years or you're seeing your health for the first time.",
      },
      {
        numeral: 'ii.',
        title: 'The full picture, already put together.',
        text: 'The whole visit was built to feed one screen, so nothing gets pieced together at the end. By the time you sit down together, every result is in place and in context. Nothing to decode, nothing to chase down — just your health, all in one view.',
      },
      {
        numeral: 'iii.',
        title: "The experience does what a screen can't.",
        text: 'Your results fill in live as the lab reads them, and it’s genuinely hard to look away — that pull is the point. People lean in when the data feels like theirs. And the visit is built around that moment: calm to start, blood drawn early, results ready by the end, protocol in hand on the way out. The design reaches past the screen and into the room itself.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2752 × 1536',
        aspect: '2752/1536',
        innerLabel: 'Health Summary — full dashboard',
        hoverLift: false,
        src: '/case-studies/plmc/PLMC-04-solution_hero.png',
        alt: 'PLMC Health Summary dashboard — full scroll of vitals, labs, and 5 Functions of Health',
        caption: {
          tag: '01',
          lead: 'Health Summary — Everything visible, nothing left unchecked.',
          desc: 'Vitals, blood panel, questionnaires, lifestyle data, and the 5 Functions of Health score — the whole patient before the doorknob turns.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Biometric Screening detail',
        hoverLift: false,
        src: '/case-studies/plmc/PLMC-04-solution_website.png',
        alt: 'PLMC marketing website homepage — Holistic Functional Medicine, Personalized',
        caption: {
          tag: '02',
          lead: 'The clinic website.',
          leadInline: true,
          desc: ' I designed and developed the website as well — the public face of the same personalized-care story.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '3008 × 1799',
        aspect: '4/3',
        innerLabel: 'Health Summary — full dashboard',
        hoverLift: false,
        src: '/case-studies/plmc/PLMC-04-solution-dashboard2.gif',
        alt: 'PLMC Health Summary TV dashboard with biometrics, blood panel, lifestyle, and 5 Functions of Health',
        objectFit: 'cover',
        objectPosition: 'center top',
        caption: {
          tag: '03',
          lead: 'Health Summary on the room display.',
          leadInline: true,
          desc: ' The full picture already put together — biometrics, labs, lifestyle, and the five functions in one view.',
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

  // Collage-only images (file in public/case-studies/plmc/, not placed in-page).
  gallery: [
    {
      placeholder: 'Gallery',
      dims: '980 × 980',
      aspect: '1/1',
      innerLabel: 'Early concept art',
      src: '/case-studies/plmc/plmc-concept-art.jpg',
      alt: 'PLMC early concept art',
      caption: {
        tag: 'CONCEPT',
        lead: 'Early concept art.',
        desc: 'Exploratory visual direction before the clinic screens locked in.',
      },
    },
    {
      placeholder: 'Gallery',
      dims: '1900 × 806',
      aspect: '1900/806',
      innerLabel: 'Data filling the summary live',
      kind: 'video',
      src: '/case-studies/plmc/plmc-gif-1_1.mp4',
      alt: 'Animation of PLMC results filling into the health summary as lab data returns',
      caption: {
        tag: 'MOTION',
        lead: 'Watch the data arrive.',
        desc: 'Results populate live as the lab returns them — the pull that keeps patients watching their own numbers land.',
      },
    },
  ],

  nextCase: {
    label: 'Sage Healthspan',
    note: '— the longevity one.',
    to: '/work/sage',
  },
};
