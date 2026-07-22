import type { CaseStudy } from './types';

/**
 * Case study 01 — Sage Healthspan (founding product owner).
 *
 * DRAFT: grounded facts (0 → 6k+ members, unified Quest lab-ordering +
 * payments + app checkout, AI health timeline, HIPAA, founding hire) come from
 * the real role; the personas, the four decisions, figure captions, and the
 * "if I did it again" are plausible narrative to be reviewed/corrected by Derek.
 */
export const sage: CaseStudy = {
  slug: 'sage',
  caseNumber: '01',
  eyebrowRight: 'Sage Healthspan · Consumer Longevity Platform',

  headlineLead: 'From a lab result to a ',
  headlineAccent: 'life change.',
  intro:
    'Sage Healthspan promises to add healthy years to your life — but that promise was buried under lab orders, a separate payment portal, and PDF results nobody could act on. As the founding product hire, I unified lab ordering, payments, and the app into one checkout, then built an AI health timeline that turns a pile of scattered results into a next step you can actually take.',
  tldr: 'Fragmented longevity journey → one integrated checkout + an AI health timeline → 0 → 6,000+ members who can act on their data.',
  meta: {
    role: 'Product Owner · founding hire',
    org: 'Sage Healthspan',
    timeline: '2023 — Now · 0 → 1',
    scope: 'Product · Systems · AI',
  },
  heroFigure: {
    placeholder: 'Hero',
    dims: '2880 × 1260',
    aspect: '16/7',
    innerLabel: 'Health timeline — hero view',
  },

  context: {
    chapter: {
      numeral: '01',
      label: 'Context',
      subtitle: 'the longevity promise, buried in busywork',
    },
    h2: 'The science was sound. The experience was three logins and a stack of PDFs.',
    paragraphs: [
      'Getting a single healthspan reading meant ordering a panel through Quest, clearing eligibility, paying in a separate portal, going in for a blood draw, and finally receiving results as a PDF with no context. Powerful data, delivered like a utility bill.',
      'Members signed up motivated and churned confused. Without a way to see whether anything was improving over time, the core promise — more healthy years — was impossible to feel.',
    ],
    panelLabel: "One member's first panel",
    chips: [
      'Quest lab order',
      'Eligibility check',
      'Payment portal',
      'Blood draw',
      'PDF results',
      'Manual tracking',
      'Guesswork',
    ],
    captionBefore: 'The "before" state.',
    captionAfter: 'All of this became one flow.',
  },

  users: {
    chapter: {
      numeral: '02',
      label: 'Two members',
      subtitle: 'same goal, opposite starting lines',
    },
    h2: 'The same screens had to satisfy the quantified-self veteran and the first-timer who has never seen an ApoB number.',
    personas: [
      {
        label: 'Member 01',
        name: 'The optimizer',
        subtitle: 'tracks everything, trusts the data',
        needs: [
          'Raw values and trends, not just a green "normal" checkmark',
          'Compared against optimal ranges, not population averages',
          'A way to export and go deeper on their own',
        ],
      },
      {
        label: 'Member 02',
        name: 'The first-timer',
        subtitle: 'first blood panel, a little anxious',
        needs: [
          '"Am I okay?" answered in plain language, not lab jargon',
          'One clear next step instead of forty numbers',
          'Reassurance about what is actually worth attention',
        ],
      },
    ],
    pullLead: 'Every screen had to work for both — ',
    pullAccent: 'precise for one, human for the other.',
  },

  process: {
    chapter: {
      numeral: '03',
      label: 'Process',
      subtitle: 'the decision log',
    },
    h2: 'As the founding PM I owned research, roadmap, and the build — four calls shaped everything.',
    paragraph:
      'Working with a small design-and-engineering team, every flow was checked against the real vendor constraints — Quest ordering, payments, and HIPAA — before it earned a second iteration. Slower to design, but nothing died in integration later.',
    decisions: [
      {
        title: 'One checkout, three vendors.',
        choice:
          'Unify lab ordering, payment, and account setup into a single in-app flow instead of handing members off to Quest and a separate payment portal.',
        cost: 'Heavy integration work across three systems and eligibility rules — but it is the line between members finishing signup and abandoning it.',
      },
      {
        title: 'A timeline, not a dashboard.',
        choice:
          'Organize health data as a longitudinal timeline — what changed and when — rather than a snapshot of the latest panel.',
        cost: 'Required normalizing results across labs and dates into one model. Harder to build; also the only thing that makes progress visible.',
      },
      {
        title: 'AI that guides, never diagnoses.',
        choice:
          'Use AI to summarize trends and surface one plain-language next step, behind hard guardrails against anything that reads as a medical diagnosis.',
        cost: 'Constant review of prompts and outputs plus clinical guardrails. Slower to ship, but the only responsible way to put AI on health data.',
      },
      {
        title: 'Ship the smallest honest loop.',
        choice:
          'Launch the order → result → insight → retest loop before adding breadth, and measure whether members came back for a second panel.',
        cost: 'Said no to a lot of requested features early. In exchange, the team stayed on the loop that actually retains members.',
      },
    ],
    figures: [
      {
        placeholder: 'Fig. A',
        dims: '2400 × 1400',
        aspect: '12/7',
        innerLabel: 'Member journey / data-flow map',
        caption: {
          tag: 'FIG. A',
          desc: 'Every vendor, hand-off, and data source mapped against the moment a member actually needs it.',
        },
      },
      {
        placeholder: 'Fig. B',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Early checkout sketches',
        caption: {
          tag: 'FIG. B',
          desc: 'The first unified-checkout concepts — where the three-vendor flow got collapsed into one.',
        },
      },
      {
        placeholder: 'Fig. C',
        dims: '1600 × 1200',
        aspect: '4/3',
        innerLabel: 'Timeline wireframes',
        caption: {
          tag: 'FIG. C',
          desc: 'Timeline wireframes annotated with which result each row draws from, and how it normalizes over time.',
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
        text: 'One flow, start to finish — order, pay, and onboard without ever leaving the app.',
      },
      {
        numeral: 'ii.',
        text: 'Time is the axis — every value plotted against your own history, not just a reference range.',
      },
      {
        numeral: 'iii.',
        text: 'AI as a guide, not an oracle — a plain-language next step, never a diagnosis.',
      },
    ],
    figures: [
      {
        placeholder: 'Screen 01',
        dims: '2880 × 1800',
        aspect: '8/5',
        innerLabel: 'Health timeline — full view',
        hoverLift: true,
        caption: {
          tag: '01',
          lead: 'The health timeline — progress you can see.',
          desc: 'Every panel, biomarker, and habit on one scrollable timeline, so a member can tell at a glance whether the last three months moved the needle.',
        },
      },
      {
        placeholder: 'Screen 02',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'Unified checkout',
        hoverLift: true,
        caption: {
          tag: '02',
          lead: 'One checkout.',
          leadInline: true,
          desc: ' Lab order, eligibility, and payment in a single flow — the three-portal handoff, gone.',
        },
      },
      {
        placeholder: 'Screen 03',
        dims: '1400 × 1050',
        aspect: '4/3',
        innerLabel: 'AI next step',
        hoverLift: true,
        caption: {
          tag: '03',
          lead: 'The next step.',
          leadInline: true,
          desc: ' AI reads the trend and suggests one concrete action in plain language — with a clear line it never crosses into diagnosis.',
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
      { kind: 'count', to: 6, suffix: 'k+', label: 'Members, from a standing start' },
      { kind: 'static', display: '3 → 1', label: 'Vendor handoffs, one checkout' },
      { kind: 'static', display: '0 → 1', label: 'Built and shipped from scratch' },
    ],
    closingParagraph:
      'More members finished signup once it was one flow, and more came back for a second panel once progress was finally visible. The AI timeline turned one-time testers into members with a reason to return — the whole point of a longevity product.',
    ifIDidItAgain:
      'Instrument the retest loop from day one. We learned too late which nudge actually brought members back for their second panel — the single metric the business runs on.',
  },

  nextCase: {
    label: 'Bexa Suite',
    note: '— the med-device one.',
    to: '/work/bexa',
  },
};
