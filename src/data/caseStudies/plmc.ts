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
    'A functional-medicine clinic measured everything: blood panels, body scans, questionnaires, motor tests, phone data. I designed and built the app that reads it all in one sitting.',
  tldr: 'Seven sources of patient data, one screen clinician and patient read together. Shorter prep, smarter visits.',
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

  // PLMC's own teal (its primary buttons and in-range values); highlight: a
  // pale mint, the lightest colour under the devices
  brand: { color: '#30AE90', ink: '#0e0c09', highlight: '#E6F6F0' },

  // One exam, on the two screens in the room, then the scheduler around it.
  // Derek's device pictures (transparent, screens cut out by
  // cover-videos/plmc/tools/prep_frames.py; sizes are layout units, so the TV
  // and the iPad stand the same height). Mock data throughout (contact
  // details patched in cover-videos/plmc/tools/patch_screens.py).
  flows: [
    {
      title: 'The exam room',
      line: 'The patient follows each step, then reads the whole picture with their clinician.',
      device: 'tv',
      frame: { src: '/case-studies/plmc/frames/tv.webp', size: [1911, 1170], screen: [0.0341, 0.0375, 0.9319, 0.8229], align: 'center' },
      // the five functions of health: yellow, teal, green
      glow: ['#F5BC22', '#5AC1B9', '#89C45A'],
      cover: 7,
      screens: [
        {
          src: '/case-studies/plmc/flows/tv-1-welcome.webp',
          alt: 'Welcome screen: the Personalized Lifestyle Medical Center logo over stacked stones and bamboo',
          label: 'Welcome',
        },
        {
          src: '/case-studies/plmc/flows/tv-2-vitals.webp',
          alt: 'Vitals and Nutritional Physical: heart rate, oxygen saturation and blood pressure, with fingernail, skin and tongue photos',
          label: 'Vitals and nutrition photos',
        },
        {
          src: '/case-studies/plmc/flows/tv-3-blood.webp',
          alt: 'Blood Panel: how the blood draw works and which panels are being analysed',
          label: 'What the blood draw measures',
        },
        {
          src: '/case-studies/plmc/flows/tv-4-profile.webp',
          alt: 'Profile for Jane Doe: reason for visit, wellness goals, contact details, health status, willingness to change and emotional wellbeing',
          label: 'The patient, in their own words',
        },
        {
          src: '/case-studies/plmc/flows/tv-5-history.webp',
          alt: 'Medical History: conditions, a timeline, supplements and medications, family history and allergies',
          label: 'Medical history',
        },
        {
          src: '/case-studies/plmc/flows/tv-6-biometric.webp',
          alt: 'Biometric Screening: height, weight and body composition from the scanner',
          label: 'Biometric screening',
        },
        {
          src: '/case-studies/plmc/flows/tv-7-motor.webp',
          alt: 'Motor Skills: balance results as pass or fail, and dexterity and motor scores for each hand',
          label: 'Motor skills',
        },
        {
          src: '/case-studies/plmc/flows/tv-8-summary.webp',
          alt: 'Health Summary: biometrics, blood panel, lifestyle and activity, questionnaires, medical history and the five functions of health on one screen',
          label: 'The whole patient, on one screen',
        },
        {
          src: '/case-studies/plmc/flows/tv-9-biometrics.webp',
          alt: 'Biometric Screening dashboard: vitals and a blood pressure chart, body water and mass mapped on a body outline, and the InBody body composition, obesity and muscle-fat analysis',
          label: 'Biometrics, in depth',
        },
      ],
    },
    {
      title: "The clinician's iPad",
      line: 'The clinician runs each step here; every reading appears on the TV.',
      device: 'ipad',
      frame: { src: '/case-studies/plmc/frames/ipad.webp', size: [906, 1152], screen: [0.1324, 0.0395, 0.7332, 0.8106] },
      // casting blue, the active-step pink, a pale blue
      glow: ['#58A0E0', '#FF5C8A', '#A8D0F0'],
      cover: 1,
      screens: [
        {
          src: '/case-studies/plmc/flows/ipad-1-welcome.webp',
          alt: 'Videos to cast to the TV while the patient settles in: the five functions, about PLMC, diet and supplementation',
          label: 'Videos while they settle in',
        },
        {
          src: '/case-studies/plmc/flows/ipad-2-vitals.webp',
          alt: 'Vitals: start the exam on the machine, enter readings, launch the NPX app by QR code, and take fingernail, skin and tongue photos',
          label: 'Start the vitals',
        },
        {
          src: '/case-studies/plmc/flows/ipad-3-photo.webp',
          alt: 'Camera: place the middle finger inside the guideline to photograph the fingernail',
          label: 'Photograph the fingernail',
        },
        {
          src: '/case-studies/plmc/flows/ipad-4-blood.webp',
          alt: 'Select tests for the blood draw: basic metabolic, lipid panel, electrolyte and general chemistry 13, then hand over the iPad for a quiz',
          label: 'Choose the blood tests',
        },
        {
          src: '/case-studies/plmc/flows/ipad-5-profile.webp',
          alt: 'Profile, contact info: name, date of birth, doctor, height, how to reach the patient and their address',
          label: "The patient's details",
        },
        {
          src: '/case-studies/plmc/flows/ipad-6-history.webp',
          alt: 'Medical History, conditions: each condition with its treatment and the year diagnosed',
          label: 'Add their history',
        },
        {
          src: '/case-studies/plmc/flows/ipad-7-biometric.webp',
          alt: "Biometric Screening: a video to play during the exam and the patient's InBody ID",
          label: 'Biometric screening',
        },
        {
          src: '/case-studies/plmc/flows/ipad-8-motor.webp',
          alt: "Motor skills: the patient's NIH ID and QR code, with balance, dexterity and motor results to enter",
          label: 'Motor skills',
        },
        {
          src: '/case-studies/plmc/flows/ipad-9-modules.webp',
          alt: 'Select a module to expand: the health summary, each of its sections, the five functions of health, and notes',
          label: 'Open any part of the summary',
        },
      ],
    },
    {
      title: 'The scheduler',
      line: "The day's visits by type, each patient's questionnaires and labs a tap away.",
      device: 'ipad',
      frame: { src: '/case-studies/plmc/frames/ipad.webp', size: [906, 1152], screen: [0.1324, 0.0395, 0.7332, 0.8106] },
      // the visit types: follow-up yellow, acute red, video-call blue
      glow: ['#F5BC22', '#B53C5C', '#58A0E0'],
      cover: 1,
      screens: [
        {
          src: '/case-studies/plmc/flows/sched-1-day.webp',
          alt: "The day's schedule for April 9, 2020: appointments coloured by type: new patient, follow-up, acute or video call",
          label: 'The day, by visit type',
        },
        {
          src: '/case-studies/plmc/flows/sched-2-new.webp',
          alt: 'A new patient selected: reasons for the visit, wellness goals, completed questionnaires and recent blood tests',
          label: 'A new patient, ready for their exam',
        },
        {
          src: '/case-studies/plmc/flows/sched-3-week.webp',
          alt: 'The week of April 9 to 13: appointments by day and type',
          label: 'The week at a glance',
        },
        {
          src: '/case-studies/plmc/flows/sched-4-block.webp',
          alt: 'Schedule a time block: pick a slot, a duration and a reason, with the open times shown on the schedule',
          label: 'Block out time',
        },
        {
          src: '/case-studies/plmc/flows/sched-5-record.webp',
          alt: "A patient's record: weight trajectory, lifestyle education, medical foods and supplements, labs, questionnaires and functional assessments",
          label: "The patient's plan",
        },
      ],
    },
  ],

  context: {
    chapter: {
      label: 'Context',
      subtitle: 'the clinic that measured everything',
    },
    h2: "The data wasn't missing. It just wasn't in one place.",
    paragraphs: ['Clinicians prepped by tab-hopping. Patients heard their results in fragments. Nobody saw the whole person at once.'],
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
      label: 'Two users',
      subtitle: 'same screen, opposite fluency',
    },
    h2: 'This screen gets read aloud, in the room, by both of them.',
    personas: [
      {
        label: 'User 01',
        name: 'The clinician',
        subtitle: 'eight minutes between visits',
        needs: ['One pass, not seven tabs', 'Outliers first', 'Every value traceable to its source'],
      },
      {
        label: 'User 02',
        name: 'The patient',
        subtitle: 'first time ever seeing an ALT value',
        needs: ['"Am I okay?" answered by shape and color', 'What changed since last visit', 'Something to take home and act on'],
      },
    ],
    pullLead: 'Every layout decision traces back to that moment: ',
    pullAccent: 'glanceable for one, legible for both.',
  },

  process: {
    chapter: {
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Sat in on visits, mapped every data source, then made three calls.',
    paragraph:
      'I was also building it, so every sketch was checked against real integration payloads. Slower ideation, zero "we can’t build that" later.',
    decisionCostLabel: 'The payoff',
    decisions: [
      {
        title: 'Five functions, not fifty tests.',
        choice:
          'Blood panels, cognitive quizzes, balance and strength tests, and habits roll up into five functions anyone can read: Physical, Cognitive, Emotional, Metabolic, Behavioral.',
        cost: 'Every practitioner had strong opinions on what belonged where. I found the common ground, and the scoring system still runs on it.',
      },
      {
        title: 'Let them watch it arrive.',
        choice: 'Results fill in live as the lab returns them.',
        cost: "Nurses noticed patients couldn't look away. So I leaned into the live reveal.",
      },
      {
        title: 'Sequenced the visit so the data compounds.',
        choice:
          'Vitals during a meditation video, blood drawn early, then history, biometrics, and motor skills while the panel runs. By the summary, everything has arrived.',
        cost: 'Design beyond the screen: lab timing, room flow, and staff handoffs, so no one makes a second trip.',
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
          desc: 'Two surfaces, one visit: a 60″ patient display and the examiner iPad.',
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
          desc: 'The whiteboard phase. The first layout died here, cheaply.',
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
          desc: 'Patient display, examiner iPad, and PLMx, layer by layer.',
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
        title: 'One language everyone speaks.',
        text: 'Everything rolls up into five scores. The doctor keeps every detail; you get a picture you can hold onto.',
      },
      {
        numeral: 'ii.',
        title: 'The full picture, already put together.',
        text: 'Every step of the visit feeds one summary. By the time you sit down, every result is in place, with details one tap away.',
      },
      {
        numeral: 'iii.',
        title: "The experience does what a screen can't.",
        text: 'Calm to start, blood drawn early, results live by the end, protocol in hand on the way out.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2752 × 1536',
        aspect: '2752/1536',
        innerLabel: 'Health Summary — full dashboard',
        src: '/case-studies/plmc/PLMC-04-solution_hero.png',
        alt: 'PLMC Health Summary dashboard — full scroll of vitals, labs, and 5 Functions of Health',
        caption: {
          tag: '01',
          lead: 'Health Summary: everything visible, nothing left unchecked.',
          desc: 'The whole patient before the doorknob turns.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Biometric Screening detail',
        src: '/case-studies/plmc/PLMC-04-solution_website.png',
        alt: 'PLMC marketing website homepage — Holistic Functional Medicine, Personalized',
        caption: {
          tag: '02',
          lead: 'The clinic website.',
          leadInline: true,
          desc: ' I designed and built that too.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '3008 × 1799',
        aspect: '4/3',
        innerLabel: 'Health Summary — full dashboard',
        src: '/case-studies/plmc/PLMC-04-solution-dashboard2.gif',
        still: '/case-studies/plmc/PLMC-04-solution-dashboard2-still.webp',
        alt: 'PLMC Health Summary TV dashboard with biometrics, blood panel, lifestyle, and 5 Functions of Health',
        objectFit: 'cover',
        objectPosition: 'center top',
        caption: {
          tag: '03',
          lead: 'Health Summary on the room display.',
          leadInline: true,
          desc: ' Biometrics, labs, lifestyle, and the five functions in one view.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      label: 'Outcome',
      subtitle: 'receipts, where available',
    },
    stats: [
      { kind: 'count', to: 7, suffix: ' → 1', label: 'Data sources, one summary' },
      { kind: 'count', to: 5, label: 'Functions of health, scored at a glance' },
      { kind: 'static', display: '0 → 1', label: 'Built from scratch, shipped to clinic' },
    ],
    closingParagraph:
      'Clinicians opened one screen before every visit instead of many. Patients saw their health as one picture. And because feasibility was checked at the sketch stage, what we designed is what shipped.',
    ifIDidItAgain: 'Bring in the front desk earlier. They knew where the paper piled up long before we did.',
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
