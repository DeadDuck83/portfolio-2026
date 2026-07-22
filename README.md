# Derek Moore — Portfolio

Personal portfolio site (Product Manager). Built from the Claude Design handoff
in `../reference`. Vite + React + TypeScript, deployed as a static site on
Cloudflare Workers (static assets).

## Stack

- **Vite** (build + dev server)
- **React 19** + **TypeScript**
- **React Router 7** — `/` home, `/work/:slug` case studies. Imports come from
  the unified `react-router` package (not the legacy `react-router-dom` shim),
  which is the current v7 convention and keeps a v8 upgrade small.
- **Vitest + React Testing Library** for component tests.
- No CSS framework: design tokens in `src/theme/tokens.ts`, styles applied
  inline to match the design reference 1:1 (all reference styling was inline).

## Local development

```bash
npm install       # once
npm run dev       # http://localhost:5173
npm run build     # type-check (tsc -b) + production build → dist/
npm run preview   # serve the built dist/ locally
npm run lint      # oxlint
npm test          # run the Vitest suite once
npm run test:watch # re-run tests on change
```

## Testing

Component tests live next to what they cover (`*.test.tsx`) and run on
**Vitest** in a **jsdom** environment with **React Testing Library**. Setup and
helpers are in `src/test/`:

- `setup.ts` — registers jest-dom matchers, auto-cleanup, and jsdom polyfills
  (IntersectionObserver, `scrollTo`/`scrollIntoView`).
- `renderWithRouter.tsx` — wraps components that use router primitives.

Current coverage is deliberately focused on behavior that would break silently:
work-list link targets (internal vs. external vs. unlinked), the decision-log
accordion, the context-panel tidy/scatter toggle, the career-slider arrow
states, and case-study routing (slug → content, unknown slug → redirect). Test
files are excluded from the production build (`tsconfig.app.json`) and
type-checked separately via `tsconfig.test.json`.

## Project structure

```
src/
  main.tsx                 # entry — mounts <BrowserRouter><App/>
  App.tsx                  # routes
  components/
    ScrollManager.tsx      # scroll-to-top / hash scrolling on nav
    Grain.tsx              # film-grain overlay
    Wordmark.tsx           # "Derek Moore" + accent dot
    SiteFooter.tsx         # shared footer (home + case variants)
    PlaceholderFigure.tsx  # <img>-ready gray placeholder block
    home/                  # SiteHeader, Hero, CareerSlider, BrainBackground,
                           #   WorkList, ContactSection
    casestudy/             # CaseStudyHeader, ChapterHeading, ContextPanel,
                           #   PersonaCard, DecisionLog, StatBand,
                           #   NextCaseFooter, Reveal
  hooks/
    useScrollProgress.ts   # progress bar + chapter scroll-spy
    useCountUp.ts          # outcome stat count-up on scroll
  data/
    roles.ts               # career-journey slider content
    work.ts                # "Selected work" rows
    caseStudies/
      types.ts             # CaseStudy content model
      plmc.ts              # Metagenics/PLMC case study (master template)
      index.ts             # slug → CaseStudy registry
  theme/tokens.ts          # colors, borders, fonts, layout constants
  styles/global.css        # resets, fonts, keyframes
```

## Adding a case study

The case-study layout is fully data-driven — new case studies are new data
files, not new layouts.

1. Copy `src/data/caseStudies/plmc.ts` → e.g. `parker-ace.ts`, fill in the
   content (the `CaseStudy` type in `types.ts` documents every field).
2. Register it in `src/data/caseStudies/index.ts`.
3. Link it from the home page: set the row's `to` in `src/data/work.ts`
   (e.g. `to: '/work/parker-ace'`).
4. Update the previous case study's `nextCase.to` so its footer links onward.

Remaining case studies to author: **Parker & Ace, Bexa, Sage Healthspan**.

## Replacing placeholder images

Every figure renders a gray placeholder labeled with its required export size.
`PlaceholderFigure` is `<img>`-ready: drop the final asset in and pass `src`
(and `alt`) — the aspect ratio is already set. Sizes are in each case study's
`figure` entries.

## Deployment — Cloudflare Workers (static assets)

This is a static SPA deployed via Cloudflare Workers static assets. Config
lives in `wrangler.jsonc`: it uploads `./dist/` and sets
`not_found_handling: "single-page-application"` so client-side routes (e.g.
`/work/plmc`) serve `index.html` instead of 404ing. (This replaces the Pages
`_redirects` SPA-fallback convention.)

**Connect the GitHub repo (Workers build):**

1. Cloudflare dashboard → **Compute (Workers)** → **Create** → **Import a
   repository** → authorize GitHub → pick `portfolio-2026`.
2. Build settings:
   - **Root directory:** leave default (`/`) — the repo root *is* the app.
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
3. No environment variables or secrets are needed (fully static, no API calls).
4. Deploy. Every push to `main` triggers a rebuild + deploy.

Deploy locally instead: `npm run build && npx wrangler deploy`.

**Custom domain (GoDaddy):**

1. In the Worker → **Settings** → **Domains & Routes** → add your custom domain.
2. Cloudflare shows the DNS records to create. In GoDaddy DNS, add the
   records Cloudflare specifies (typically a `CNAME` to the `workers.dev`
   target, or apex records). DNS propagation + TLS issuance take a few minutes.

## Push to GitHub

Already wired up — the remote is `git@github.com:DeadDuck83/portfolio-2026.git`
and `main` tracks `origin/main`:

```bash
git push        # subsequent pushes
```
