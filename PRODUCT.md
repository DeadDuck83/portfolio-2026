# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitors are **hiring managers**, **recruiters**, and **peers** (designers / PMs) evaluating Derek Moore for product roles or professional context.

## Product Purpose

A personal portfolio site that presents Derek’s product work through narrative case studies and a clear path to contact. **Success for a visit is opening case studies** — deeper engagement with the work, not vanity metrics alone.

## Positioning

**Product & Systems Designer** (repositioned 2026-11-09 from “Product Manager · Systems & Integrations”: application feedback points to design roles over PM roles). The exact title wording is still being refined and may be less literal than this. The design + engineering + product systems depth stays the differentiator: neighboring generic designer portfolios should not be able to claim it without inventing it.

## Operating Context

Visitors arrive from recruiting channels (LinkedIn, Wellfound, Greenhouse, Indeed and similar), browse home sections (path/career, selected work, contact), and drill into internal case-study routes. Evaluation happens quickly on a laptop or phone during hiring loops.

## Capabilities and Constraints

- Static Vite + React + TypeScript site; React Router routes: `/` (home), `/work/:slug` (case studies).
- Case-study content is data-driven (`src/data/caseStudies/`).
- Contact via email (mailto with optional first-touch attribution) and LinkedIn.
- “Open to new product roles” is a toggleable site flag.
- LogRocket session replay + custom events in production (Get in touch, work clicks, About chapter views).
- Résumé CTA links out to a Google Doc (URL supplied in site config).

## Brand Commitments

- Name: **Derek Moore**
- Role framing: Product & Systems Designer (working title, wording TBD)
- The hero leads with **name + title**. “Bringing focus to the product.” is no longer the headline: Derek finds it less impactful now (2026-11-09). The depth-of-field “focus” effect can survive as a mechanic, but not as the slogan.
- Selected work should be visible in the first viewport, ahead of the About rail.
- Do not invent new brand names, fake employers, or alternate positioning without explicit change.

## Evidence on Hand

- Case studies: Sage Healthspan, Bexa Suite, Parker & Ace, PLMC (`src/data/caseStudies/`, routes under `/work/…`)
- About journey chapters (`src/data/aboutJourney.ts`)
- Selected work list (`src/data/work.ts`)
- Process visuals for PLMC (`public/case-studies/plmc/`)
- Pixel cameo easter egg (`public/derek-pixels.svg`)
- Do **not** fabricate testimonials, metrics, logos, or employers beyond what these sources contain.

## Product Principles

1. **Case studies carry the sale** — optimize for opening and finishing work stories.
2. **Specific beats generic** — preserve systems/integrations and design↔eng↔product overlap; don’t flatten into a template PM pitch.
3. **Fast evaluation** — hiring managers and recruiters should find role, proof, and contact without hunting.
4. **Truthful evidence only** — show real work and real constraints; never invent social proof.
5. **Wit without fluff** — sharp, descriptive, not corporate filler.
6. **Authored, not templated** — the first build came from Claude and reads that way (stock serif+mono pairing, italic accent words, tracked caps everywhere, hairline-divided sections, generic fade-ups). Derek wants the 80% kept and his own 20% added: type, entrance motion, and pattern breaks that are recognisably his.
7. **Half the words** (Derek, 2026-11-10, applies to every page) — cut copy by at least half. Short, impactful lines; let the outcome imply the detail, and leave the rest for visitors to ask (the avatar, or Derek directly). Never pad a section to fill space.
8. **Start with the finished dish** (Derek, 2026-11-10) — tell case studies, and stories generally, like a recipe blog: open on the end product and its result ("whoa, I'm about to make that"), then the ingredients (role, team, constraints, users), then the steps (decisions in order), then notes. Never build up to the solution; the current studies run problem → process → solution → outcome and need flipping. Pair with the Webdrift Trendwolves reference: make the complicated look easy.

## Accessibility & Inclusion

No product-specific legal standard was set beyond general web best practice. Prefer keyboard-usable primary paths and respect `prefers-reduced-motion` for non-essential motion.
