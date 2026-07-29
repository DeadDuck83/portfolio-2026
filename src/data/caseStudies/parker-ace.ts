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
    "Parker & Ace wanted to be the vet your neighborhood actually knows. Real clinics run as local hubs for pet events and everyday care, starting with one flagship to prove it could work before opening more. I helped stand up that first location's tech and designed the app that ran it, built on a headless CMS made for vet practices. I started as the designer and front-end engineer. When our Head of Product left, I picked up product too, so I owned this one end to end: the research, the flows, the screens, and a good chunk of the code. It was never really about screens. It was about two things. A community being built behind a branded experience, and a vet trying to make it through a long day.",
  tldr: 'Community vet brand, one flagship first, built on a low-cost membership bet. Custom app on a headless vet CMS, shaped by user interviews and research: lead with availability, nail the first visit, and remember the burned-out vet is part of the product too.',
  meta: {
    role: 'Founding Designer → Product Owner',
    org: 'Parker & Ace',
    timeline: '2023 · 0 → 1',
    scope: 'Research · Product Design · IA · Front-End',
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
      numeral: '01',
      label: 'Context',
      subtitle: 'The part nobody tells you about vets',
    },
    h2: "Everybody worries about the pet. Almost nobody worries about the vet.",
    paragraphs: [
      'Before we drew a single screen, we spent real time with vets. Shadowing their days, asking what grinds them down. It was rougher than we expected. Burnout runs high in this field, and it is not a footnote. People get into this to help animals and end up buried in admin, back-to-back rooms, and hard days. So the brief grew a second half: build a place vets actually want to work, with software that hands time back instead of taking more of it.',
      "Owners surprised us too. We assumed they'd pick a clinic by location. They didn't. They chose by who could see them soonest, and they wanted to know that before committing to anyone. Availability beat proximity almost every time.",
      "So the real job wasn't one problem, it was two. A vet running on empty, and an owner whose loyalty gets decided fast. People don't switch vets often. They pick one and stay unless something gives them a reason to leave, which means the first visit does most of the work. Availability gets them through the door. The first impression is what keeps them there.",
    ],
    panelLabel: 'What was on the table to get right.',
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
    captionAfter: 'Carful care for each side.',
  },

  process: {
    chapter: {
      numeral: '02',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: "Four calls did most of the work. Here's the thinking behind each.",
    paragraph:
      'Wearing the design, product, and part of the engineering hats at once kept me honest. Every idea got checked against what the CMS could actually do and what a tired vet would actually use, not the perfect version on a whiteboard.',
    decisions: [
      {
        title: "Build on top, don't build from scratch.",
        choice:
          'We found a headless CMS made for vet practices and built on it instead of starting at zero. It got us to a real, working product far faster.',
        cost:
          'We inherited someone else\'s data model. Every screen had to fit what the CMS could actually store, so "wouldn\'t it be cool if" got filtered through "can this thing even hold that" early and often.',
      },
      {
        title: 'Bet on membership, not per-visit.',
        choice:
          "Instead of billing per visit, we ran on a low annual membership with no exam fees. It matched the research: people don't switch vets, so the win is becoming their vet for years, not maximizing one appointment. We priced it aggressively and bet on scale across many offices to carry the business, not the margin on any single visit.",
        cost:
          "At that price the model only works at volume, so every decision had to serve the long relationship over the next transaction. And the billing got involved enough that we built our own payment processor, since off-the-shelf tools couldn't handle how we wanted membership and visits to work together.",
      },
      {
        title: "Design for the vet's day, not just the owner's booking.",
        choice:
          'Every vet-facing flow got held against one question. Does this give the vet time back or take more of it. Fewer taps, less double entry, less busywork between rooms. And since the first visit is the one that decides whether an owner stays, a calmer vet pulled double duty: a better day for them, a better first impression for the owner.',
        cost:
          'A quieter vet side usually meant more work under the hood and more restraint in the UI. The temptation is always to add. The better move was to remove.',
      },
      {
        title: 'Make the clinic a neighborhood fixture, not just a building.',
        choice:
          'The brand lived past the app. Dog parks, local pet events, showing up where the community already was, so each clinic became the place people knew.',
        cost:
          'A membership brand only works if people feel it\'s theirs. The app and the real-world presence had to say the same thing, so "your local friendly vet" had to be true in the room, not just on the welcome screen.',
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
          desc: 'The research said people choose on availability. The third welcome card is that finding, shipped: seen today or next day, guaranteed.',
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
          desc: 'Early onboarding concepts — the moment a skeptical front desk decides whether this is worth it.',
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
          desc: 'Booking wireframes annotated with what the CMS could and could not support.',
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
        title: 'One promise, right up front.',
        text: 'The welcome flow leads with what owners actually care about: a friendly local clinic that can see you today or next day, on one simple membership. No exam fees to squint at.',
      },
      {
        numeral: 'ii.',
        title: 'Everything for your pet in one place.',
        text: 'Care, appointments, records, and your pets, sorted so nothing hides. Get Care sits at the center, with urgent visits, video calls, and prescriptions one tap away.',
      },
      {
        numeral: 'iii.',
        title: 'Quiet where it counts.',
        text: 'The vet side was built to get out of the way. Less to click, less to re-enter, more time for the animal in front of them.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2800 × 1800',
        aspect: '2800/1800',
        innerLabel: 'Welcome — four cards',
        hoverLift: true,
        src: '/case-studies/parkerace/Parkerace-Outcome-01.jpg',
        alt: 'Parker & Ace welcome — four cards pitching local care, membership, availability, and video',
        caption: {
          tag: '01',
          lead: 'Welcome: the whole pitch in four cards.',
          desc: 'Community focused location, focus on vet health and confort, remote access for remote care, and fully integrated custom saas system.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'App map',
        hoverLift: true,
        src: '/case-studies/parkerace/Parkerace-Outcome-02.png',
        alt: 'Parker & Ace app — care, appointments, records, and pets as clear lanes',
        caption: {
          tag: '02',
          lead: 'App: everything for your pet, sorted.',
          leadInline: true,
          desc: ' Care, appointments, records, and pets as four clear lanes. The kind of structure a tired owner can move through at 9pm without thinking about it.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1600 × 1200',
        aspect: '1600/1200',
        innerLabel: 'Clinic site',
        hoverLift: true,
        src: '/case-studies/parkerace/Parkerace-Outcome-03.png',
        alt: 'Parker & Ace clinic website — membership and visit options',
        caption: {
          tag: '03',
          lead: 'The marketing site.',
          leadInline: true,
          desc: ' Membership and pay-per-visit side by side, with same-day care front and center — the public face of what the app delivers.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      numeral: '04',
      label: 'Outcome',
      subtitle: 'a real 0 to 1',
    },
    lead: 'We built the whole thing. Then the company pivoted, and I led that too.',
    paragraphs: [
      'From a blank page it became a working app: the research, the information architecture, the core flows, a front end on a real CMS, and a custom payment processor to run the membership model nobody sold off the shelf. I started as the designer and front-end engineer and ended as the product owner, having picked up the role when our Head of Product left. When leadership later moved onto an established platform, I led that migration and carried the operation across without dropping the people already using it.',
      "So there's no growth chart to wave around. What's here is a 0 to 1 build that actually worked, a team that trusted me to run it, and a clean handoff when the plan changed.",
    ],
    asideLabel: 'What I actually learned',
    lessons: [
      {
        title: 'Availability is the strategy, not a feature.',
        text: "People pick a vet by who can see them soonest, and they almost never switch afterward, so the whole game is getting that first visit. Build acquisition around time, and treat the first appointment like it's the only one you get, because it nearly is.",
      },
      {
        title: 'The person giving the care is part of the product.',
        text: "The best app in the world can't fix a vet who's fried. Designing for the provider's day turned out to be designing for the customer's experience, and I'd never split the two again.",
      },
      {
        title: "The hardest calls weren't design calls.",
        text: 'A small team can build almost anything, right down to its own billing. Whether it should is the real question, and every custom piece is runway you\'re spending. I learned to ask "should we build this" a lot sooner, not just "can we."',
      },
    ],
  },

  nextCase: {
    label: 'PLMC',
    note: '— the clinic app.',
    to: '/work/plmc',
  },
};
