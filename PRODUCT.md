# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitors are **hiring managers**, **recruiters**, and **peers** (designers / PMs) evaluating Derek Moore for product roles or professional context.

## Product Purpose

A personal portfolio site that presents Derek’s product work through narrative case studies and a clear path to contact. **Success for a visit is opening case studies** — deeper engagement with the work, not vanity metrics alone.

## Positioning

Confirmed voice/positioning the site should preserve: **Product Manager** with a systems & integrations focus, and the headline stance **“Bringing focus to the product.”** Neighboring generic PM portfolios should not be able to claim the same design + engineering + product systems depth without inventing it.

## Operating Context

Visitors arrive from recruiting channels (LinkedIn, Wellfound, Greenhouse, Indeed and similar), browse home sections (path/career, selected work, contact), and drill into internal case-study routes. Evaluation happens quickly on a laptop or phone during hiring loops.

## Capabilities and Constraints

- Static Vite + React + TypeScript site; React Router routes: `/` (home), `/work/:slug` (case studies).
- Case-study content is data-driven (`src/data/caseStudies/`).
- Contact via email (mailto with optional first-touch attribution) and LinkedIn.
- “Open to new product roles” is a toggleable site flag.
- LogRocket session replay + custom events in production (Get in touch, work clicks, Path navigation).
- Résumé CTA links out to a Google Doc (URL supplied in site config).

## Brand Commitments

- Name: **Derek Moore**
- Role framing: Product Manager · Systems & Integrations
- Site title / headline stance the owner wants kept: **“Bringing focus to the product.”** (with “focus” as the optical/conceptual center)
- Do not invent new brand names, fake employers, or alternate positioning without explicit change.

## Evidence on Hand

- Case studies: Sage Healthspan, Bexa Suite, Parker & Ace, PLMC (`src/data/caseStudies/`, routes under `/work/…`)
- Career path roles slider (`src/data/roles.ts`)
- Selected work list (`src/data/work.ts`)
- Process visuals for PLMC (`public/case-studies/plmc/`)
- Pixel cameo easter egg (`public/derek-pixels.svg`)
- Do **not** fabricate testimonials, metrics, logos, or employers beyond what these sources contain.

## Product Principles

1. **Case studies carry the sale** — optimize for opening and finishing work stories.
2. **Specific beats generic** — preserve systems/integrations and design↔eng↔product overlap; don’t flatten into a template PM pitch.
3. **Fast evaluation** — hiring managers and recruiters should find role, proof, and contact without hunting.
4. **Truthful evidence only** — show real work and real constraints; never invent social proof.
5. **Wit without fluff** — keep the current title’s tone: sharp, descriptive, not corporate filler.

## Accessibility & Inclusion

No product-specific legal standard was set beyond general web best practice. Prefer keyboard-usable primary paths and respect `prefers-reduced-motion` for non-essential motion.
