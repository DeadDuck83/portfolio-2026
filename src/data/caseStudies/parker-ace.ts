import type { CaseStudy } from './types';

/**
 * Case study 03 — Parker & Ace (founding member / product manager).
 *
 * DRAFT: grounded facts (two-sided veterinary-care marketplace; founding member
 * and PM who set vision + strategy, ran scrum, and led code reviews and
 * production deploys; flows designed around real vendor/integration
 * constraints; 2023, 0 → 1, Washington D.C.) come from the real role. Personas,
 * the four decisions, outcome badges, figure captions, and the "if I did it
 * again" are plausible narrative for Derek to review/correct. This was an
 * early-stage 2023 stint, so the outcome stats are qualitative placeholders
 * rather than user metrics — swap in real numbers if there are any.
 */
export const parkerAce: CaseStudy = {
  slug: 'parker-ace',
  caseNumber: '03',
  eyebrowRight: 'Parker & Ace · Two-sided Vet-care Marketplace',

  headlineLead: 'A marketplace only works if ',
  headlineAccent: 'both sides show up.',
  intro:
    'Parker & Ace set out to connect pet owners with veterinary clinics — a two-sided marketplace where neither side is worth much without the other. As a founding member and the product manager, I set the vision, ran the sprints, and reviewed the code and deploys, designing every flow around the vendor and integration realities of getting real clinics online.',
  tldr: 'Two-sided vet-care marketplace → chicken-and-egg supply and demand → founding PM owning vision, scrum, and deploys → a 0 → 1 build grounded in real clinic constraints.',
  meta: {
    role: 'Product Manager · founding',
    org: 'Parker & Ace',
    timeline: '2023 · 0 → 1',
    scope: 'Strategy · Product · Delivery',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'The marketplace — both sides',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'the two-sided cold start',
    },
    h2: "Pet owners won't come without clinics. Clinics won't join without owners. Someone has to break the tie.",
    paragraphs: [
      'A marketplace is worth nothing empty. Vet clinics run on legacy practice-management software and a busy front desk with no time for another tool. Pet owners just want to find care, book it, and know what it costs — ideally at 11pm when something is wrong.',
      'Neither side moves first on its own. The whole build hinged on making one side trustworthy enough that the other had a reason to show up.',
    ],
    panelLabel: 'What it takes to fill both sides',
    chips: [
      'Clinic sign-up',
      'PIMS integration',
      'Availability sync',
      'Owner search',
      'Booking',
      'Payments',
      'Vendor limits',
    ],
    captionBefore: 'The "before" state.',
    captionAfter: 'Supply first, then demand.',
  },

  users: {
    chapter: {
      numeral: '02',
      label: 'Two sides',
      subtitle: 'supply and demand, one platform',
    },
    h2: 'The same platform had to win over a skeptical clinic front-desk and an anxious pet owner at 11pm.',
    personas: [
      {
        label: 'Side 01',
        name: 'The clinic',
        subtitle: 'the supply — busy, skeptical, on legacy software',
        needs: [
          'No double data-entry — meet the software they already run',
          'Control over their own availability and rules',
          'Real bookings, not more admin',
        ],
      },
      {
        label: 'Side 02',
        name: 'The pet owner',
        subtitle: 'the demand — worried, wants it easy',
        needs: [
          'Find nearby care and book it in minutes',
          'Clarity on availability and price up front',
          'Trust that the clinic is real and reachable',
        ],
      },
    ],
    pullLead: 'Every feature had to earn its place on both sides — ',
    pullAccent: 'supply and demand, or it does not work.',
  },

  process: {
    chapter: {
      numeral: '03',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'As founding PM I set the vision, ran scrum, and reviewed the deploys — four calls shaped the build.',
    paragraph:
      'Wearing the vision, delivery, and code-review hats at once kept scope honest: every booking flow was designed against what clinic software could actually support, not the ideal version on a whiteboard.',
    decisions: [
      {
        title: 'Solve supply first.',
        choice:
          'Get clinics onboarded and their availability trustworthy before chasing owner-side growth.',
        cost: 'Slower visible demand-side traction early — but an empty marketplace converts no one.',
      },
      {
        title: 'Meet clinics where their data lives.',
        choice:
          'Integrate with the practice-management systems clinics already run instead of asking them to double-enter.',
        cost: 'Hard, vendor-by-vendor integration work. It was both the moat and the bottleneck.',
      },
      {
        title: 'Founder-PM, hands on the code.',
        choice:
          'Run scrum, but also review pull requests and production deploys to keep scope shippable.',
        cost: 'Split focus across strategy and delivery — the price of keeping a founding team small and fast.',
      },
      {
        title: 'Design for the real constraint.',
        choice:
          'Shape every flow around what the integrations could actually support, and validate against how clinics really schedule.',
        cost: 'Some elegant flows died against vendor limits. What shipped actually worked in a real clinic.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2400 × 1400',
        aspect: '12/7',
        innerLabel: 'Marketplace / two-sided flow map',
        caption: {
          tag: 'FIG. A',
          desc: 'Both sides of the marketplace mapped end to end — where clinic supply and owner demand actually meet.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Clinic onboarding sketches',
        caption: {
          tag: 'FIG. B',
          desc: 'Early onboarding concepts — the moment a skeptical front desk decides whether this is worth it.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Owner booking wireframes',
        caption: {
          tag: 'FIG. C',
          desc: 'Booking wireframes annotated with what each clinic integration could and could not support.',
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
        text: 'Supply before demand — a marketplace with trustworthy availability, or nothing.',
      },
      {
        numeral: 'ii.',
        text: "Integrate, don't ask — meet clinics inside the software they already run.",
      },
      {
        numeral: 'iii.',
        text: 'Ship the real thing — every flow built against actual vendor constraints.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2880 × 1800',
        aspect: '8/5',
        innerLabel: 'Owner booking flow',
        hoverLift: true,
        caption: {
          tag: '01',
          lead: 'The booking flow — care in a few taps.',
          desc: 'Search nearby clinics, see real availability and price, and book — the demand side made simple enough to use at 11pm.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Clinic dashboard',
        hoverLift: true,
        caption: {
          tag: '02',
          lead: 'Clinic side.',
          leadInline: true,
          desc: ' Availability, rules, and incoming bookings in one place — synced from the software the clinic already runs.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Availability / scheduling',
        hoverLift: true,
        caption: {
          tag: '03',
          lead: 'Availability.',
          leadInline: true,
          desc: ' The scheduling seam where a clinic’s real calendar becomes a bookable slot an owner can trust.',
        },
      },
    ],
  },

  outcome: {
    chapter: {
      numeral: '05',
      label: 'Outcome',
      subtitle: 'an early-stage 0 → 1',
    },
    stats: [
      { kind: 'static', display: '0 → 1', label: 'From vision to shipped product' },
      { kind: 'static', display: '2-sided', label: 'Marketplace, supply and demand' },
      { kind: 'static', display: 'PM + Eng', label: 'Strategy through production deploys' },
    ],
    closingParagraph:
      'What got built was a working two-sided foundation with real clinic integrations behind it. The supply-first bet meant that when owner demand arrived, it had trustworthy availability to land on instead of an empty grid.',
    ifIDidItAgain:
      'Take one clinic all the way through integration before signing more. The integration work — not the app — was always the real timeline.',
  },

  nextCase: {
    label: 'PLMC',
    note: '— the clinic app.',
    to: '/work/plmc',
  },
};
