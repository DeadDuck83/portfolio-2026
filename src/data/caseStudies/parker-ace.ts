import type { CaseStudy } from './types';

/**
 * Case study 03 — Parker & Ace (founding designer → product owner).
 * Structure: Brief → Context → Process → Solution → Outcome (no Users chapter).
 */
export const parkerAce: CaseStudy = {
  slug: 'parker-ace',
  caseNumber: '03',
  eyebrowRight: 'Parker & Ace · community vet care',

  headlineLead: 'A veterinary built around ',
  headlineAccent: 'community.',
  intro:
    'Parker & Ace set out to be the vet your neighborhood knows, starting with one flagship clinic. I designed and helped build its app, then took over product when our Head of Product left. Two jobs, really: a community brand, and a vet trying to get through a long day.',
  tldr: 'A community vet on a low-cost membership. Research said: lead with availability, nail the first visit, and design for the burned-out vet too.',
  meta: {
    role: 'Founding Designer → Product Owner',
    org: 'Parker & Ace',
    timeline: '2023 · 0 → 1',
    scope: 'Research · Product Design · Front-End',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'The marketplace — both sides',
    src: '/case-studies/parkerace/ParkerAce-hero.jpg',
    alt: 'Parker & Ace hero — community veterinary care app',
  },

  context: {
    chapter: {
      label: 'Context',
      subtitle: 'The part nobody tells you about vets',
    },
    h2: "Everybody worries about the pet. Almost nobody worries about the vet.",
    paragraphs: [
      'We shadowed vets before drawing a screen. Burnout runs high, and much of it is admin. So the brief grew a second half: software that hands vets time back.',
      "Owners surprised us too. They didn't pick by location; they picked whoever could see them soonest. And they rarely switch, so the first visit does most of the work.",
    ],
    panelLabel: 'What we had to get right.',
    chips: [
      'Clinic sign-up',
      'PIMS integration',
      'Community Events',
      'Mental Health',
      'Booking',
      'Payments',
      'Pet Care',
    ],
    captionBefore: 'The focus',
    captionAfter: 'Careful care for each side.',
  },

  process: {
    chapter: {
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'Three calls did most of the work.',
    paragraph:
      'We built on a headless CMS made for vet practices. Every idea had to fit what it could hold, and what a tired vet would actually use.',
    decisions: [
      {
        title: 'Bet on membership, not per-visit.',
        choice: "A low annual membership, no exam fees. People don't switch vets, so the win is being their vet for years.",
        cost: 'It only works at volume. And billing got complex enough that we built our own payment processor.',
      },
      {
        title: "Design for the vet's day, not just the owner's booking.",
        choice:
          'Every vet-facing flow had to give time back: fewer taps, less double entry. A calmer vet also makes a better first visit.',
        cost: 'More work under the hood, more restraint in the UI. The better move was usually to remove.',
      },
      {
        title: 'Make the clinic a neighborhood fixture, not just a building.',
        choice: 'Dog parks and local pet events, so each clinic became the place people knew.',
        cost: '"Your local friendly vet" had to be true in the room, not just on the welcome screen.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2400 × 1400',
        aspect: '2400/1400',
        innerLabel: 'Welcome — availability promise',
        src: '/case-studies/parkerace/Parkerace-Process-01.png',
        alt: 'Parker & Ace welcome card promising seen today or next day, guaranteed',
        caption: {
          tag: 'FIG. A',
          lead: 'From interview to promise.',
          desc: 'Research said availability wins. The welcome card ships it: seen today or next day, guaranteed.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Clinic onboarding sketches',
        src: '/case-studies/parkerace/Parkerace-Process-02.png',
        alt: 'Parker & Ace clinic onboarding sketches',
        caption: {
          tag: 'FIG. B',
          desc: 'Early clinic onboarding sketches.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Owner booking wireframes',
        src: '/case-studies/parkerace/Parkerace-Process-03.png',
        alt: 'Parker & Ace owner booking wireframes annotated for CMS constraints',
        caption: {
          tag: 'FIG. C',
          desc: 'Booking wireframes, annotated for what the CMS could hold.',
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
        title: 'One promise, right up front.',
        text: 'A local clinic that can see you today or next day, on one simple membership.',
      },
      {
        numeral: 'ii.',
        title: 'Everything for your pet in one place.',
        text: 'Care, appointments, records, and pets. Urgent visits, video calls, and prescriptions one tap from Get Care.',
      },
      {
        numeral: 'iii.',
        title: 'Quiet where it counts.',
        text: 'The vet side gets out of the way: less to click, more time for the animal.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Welcome — four cards',
        src: '/case-studies/parkerace/Parkerace-Outcome-01.jpg',
        alt: 'Parker & Ace welcome — four cards pitching local care, membership, availability, and video',
        caption: {
          tag: '01',
          lead: 'Welcome: the whole pitch in four cards.',
          desc: 'Local community care, vet wellbeing, remote visits, and one integrated system.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'App map',
        src: '/case-studies/parkerace/Parkerace-Outcome-02.png',
        alt: 'Parker & Ace app — care, appointments, records, and pets as clear lanes',
        caption: {
          tag: '02',
          lead: 'App: everything for your pet, sorted.',
          leadInline: true,
          desc: ' Four clear lanes a tired owner can use at 9pm.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Clinic site',
        src: '/case-studies/parkerace/Parkerace-Outcome-03.png',
        alt: 'Parker & Ace clinic website — membership and visit options',
        caption: {
          tag: '03',
          lead: 'The marketing site.',
          leadInline: true,
          desc: ' Membership and pay-per-visit side by side, same-day care up front.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      label: 'Outcome',
      subtitle: 'a real 0 to 1',
    },
    lead: 'We built the whole thing. Then the company pivoted, and I led that too.',
    paragraphs: [
      'Research, IA, core flows, a front end on a real CMS, and a custom payment processor. When leadership moved to an established platform, I led the migration without dropping the people already using it.',
      'No growth chart to wave around. A 0 to 1 that worked, and a clean handoff when the plan changed.',
    ],
    asideLabel: 'What I learned',
    lessons: [
      {
        title: 'Availability is the strategy, not a feature.',
        text: 'People pick the vet who can see them soonest, then rarely switch. Treat the first visit like the only one you get.',
      },
      {
        title: "The hardest calls weren't design calls.",
        text: 'Every custom piece spends runway. I learned to ask "should we build this" sooner, not just "can we."',
      },
    ],
  },

  nextCase: {
    label: 'PLMC',
    note: '— the clinic app.',
    to: '/work/plmc',
  },
};
