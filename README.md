# Derek Moore — Portfolio

Personal portfolio site (Product Manager). Built from the Claude Design handoff
in `../reference`. Vite + React + TypeScript, deployed as a static site on
Cloudflare Pages.

## Stack

- **Vite** (build + dev server)
- **React 19** + **TypeScript**
- **React Router 7** — `/` home, `/work/:slug` case studies
- No CSS framework: design tokens in `src/theme/tokens.ts`, styles applied
  inline to match the design reference 1:1 (all reference styling was inline).

## Local development

```bash
npm install       # once
npm run dev       # http://localhost:5173
npm run build     # type-check (tsc -b) + production build → dist/
npm run preview   # serve the built dist/ locally
npm run lint      # oxlint
```

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

## Deployment — Cloudflare Pages

This is a static SPA. `public/_redirects` (`/* /index.html 200`) makes
client-side routes resolve on deep-link/refresh.

**Connect the GitLab repo to Cloudflare Pages:**

1. Push this folder to GitLab (see below).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → authorize GitLab → pick the repo.
3. Build settings:
   - **Framework preset:** Vite (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `portfolio` (if the repo root is `design_handoff_portfolio`)
     — or leave blank if this `portfolio/` folder is the repo root.
4. Deploy. Every push to the default branch triggers a rebuild.

**Custom domain (GoDaddy):**

1. In Cloudflare Pages → your project → **Custom domains** → add your domain.
2. Cloudflare shows the DNS records to create. In GoDaddy DNS, add the
   `CNAME` (or the apex records Cloudflare specifies) pointing at the
   `*.pages.dev` target. DNS propagation + TLS issuance take a few minutes.

## Push to GitLab

```bash
git remote add origin git@gitlab.com:<you>/<repo>.git
git push -u origin main
```
