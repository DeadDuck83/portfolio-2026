# Components

Every component in `src/ui/`, `src/components/` and `src/pages/`, what kind it is, where
it's used and where its stories go, plus the repeated patterns and one-offs that aren't
components. Written for Move 20 (Prompt J) on 2026-11-20, after the "Five promotions"
commit. The decisions behind it are in `docs/in-system-design/DECISIONS.md`
("Component inventory", "Five promotions", "COMPONENTS.md"); what's still built by hand
is in `GAPS.md`. The contact sheet that goes with it is
`portfolio-2026-case-study/step-20/contact-sheet.html`, outside the repo.

## Kinds

| Kind | Means | Storybook folder |
|---|---|---|
| Primitive | Small, reused, has variants | UI |
| Block | Composed, fed by case-study data | Case study |
| Chrome | Frames every page (headers, footer) | Site |
| Experience | One-off or animated; never reuse it in a new page | Experiences |
| Page | A route | Pages |
| Behavior | No visuals of its own | none |
| Unused | In the repo, but nothing renders it | none |

A **one-off** is something drawn inside a component that isn't a component itself
(see "One-offs" below).

## Primitives in `src/ui/` (all have stories)

| Component | Files | Used in | Kind | Storybook |
|---|---|---|---|---|
| Button | `src/ui/Button.tsx`, `Button.css`, `buttonClass.ts` | Hero, SiteHeader, AboutRail, ContactSection, ImageCollage, ContextPanel; `buttonClass()` on EmailLink in CaseStudyHeader and ContactSection | Primitive | UI |
| Chip | `src/ui/Chip.tsx`, `Chip.css` | AboutRail (skills) | Primitive | UI |
| Eyebrow | `src/ui/Eyebrow.tsx`, `Eyebrow.css` | CaseStudy (hero), ChapterHeading | Primitive | UI |
| Label | `src/ui/Label.tsx`, `Label.css` | CaseStudy, Callout, PersonaCard, ContextPanel, DecisionLog, ImageCollage, FlowStrip | Primitive | UI |
| Callout | `src/ui/Callout.tsx`, `Callout.css` | CaseStudy (TL;DR, Feature this) | Primitive | UI |
| Aside | `src/ui/Aside.tsx`, `Aside.css` | CaseStudy (lessons, If I did it again) | Primitive | UI |
| CellGrid | `src/ui/CellGrid.tsx`, `CellGrid.css` | CaseStudy (meta row, personas, principles), StatBand, AboutRail | Primitive | UI |
| TextLink | `src/ui/TextLink.tsx`, `TextLink.css`, `textLinkClass.ts` | SiteFooter; `textLinkClass()` in SiteFooter and GalleryExperiment | Primitive | UI |
| EmailLink | `src/ui/EmailLink.tsx` | Hero, ContactSection, CaseStudyHeader, SiteFooter | Primitive | UI |
| Wordmark | `src/ui/Wordmark.tsx`, `Wordmark.css` | SiteHeader, CaseStudyHeader, SiteFooter, Gallery | Primitive | UI |

## Primitives still in `src/components/`

Prompt L gives these stories in the UI folder; they stay where they are.

| Component | Files | Used in | Kind | Storybook |
|---|---|---|---|---|
| MotionToggle | `src/components/MotionToggle.tsx` (styles in `global.css`) | SiteFooter | Primitive | UI (Prompt L) |
| CompanyPopover | `src/components/home/CompanyPopover.tsx` | AboutRail | Primitive | UI (Prompt L) |
| SkillIcon | `src/components/avatar/SkillIcon.tsx` | SkillsShare | Primitive | UI (Prompt L) |

## Case study blocks

All nine have stories in the Case study folder (Prompt K, 2026-11-20), with real data:
PLMC's, plus Sage's for FlowStrip's Screens. Each story is as wide as the block is on a
case study page, on the same background (`.storybook/caseStudyFrames.tsx`).

| Component | Files | Used in | Kind | Storybook |
|---|---|---|---|---|
| ChapterHeading | `src/components/casestudy/ChapterHeading.tsx` | CaseStudy (5 chapters) | Block | Case study |
| PlaceholderFigure | `src/components/PlaceholderFigure.tsx` | CaseStudy (5 places) | Block | Case study |
| PersonaCard | `src/components/casestudy/PersonaCard.tsx` | CaseStudy (Users, PLMC) | Block | Case study |
| DecisionLog | `src/components/casestudy/DecisionLog.tsx` | CaseStudy (Process) | Block | Case study |
| StatBand | `src/components/casestudy/StatBand.tsx` | CaseStudy (Outcome) | Block | Case study |
| FlowStrip | `src/components/casestudy/FlowStrip.tsx`, `flowStrip.module.css` | CaseStudy (Sage, Bexa, PLMC) | Block | Case study: one story per variant. **Screens**: bare phone screens rising from a line (Sage). **Devices**: the whole device picture floating on the band, with a soft glow (Bexa, PLMC). The case study's data picks the variant: a flow with a `frame` gets Devices. |
| ImageCollage | `src/components/casestudy/ImageCollage.tsx` | CaseStudy (TL;DR's link) | Block | Case study |
| NextCaseFooter | `src/components/casestudy/NextCaseFooter.tsx` | CaseStudy | Block | Case study |
| ContextPanel | `src/components/casestudy/ContextPanel.tsx` | CaseStudy (Context) | Block | Case study |

## Site chrome

Prompt L gives these stories in the Site folder.

| Component | Files | Used in | Kind | Storybook |
|---|---|---|---|---|
| SiteHeader | `src/components/home/SiteHeader.tsx` | Home | Chrome | Site |
| CaseStudyHeader | `src/components/casestudy/CaseStudyHeader.tsx` | CaseStudy | Chrome | Site |
| SiteFooter | `src/components/SiteFooter.tsx` | Home, CaseStudy, Gallery | Chrome | Site |
| ContactSection | `src/components/home/ContactSection.tsx` | Home | Block | Site (Prompt L puts it there; it's the home page's contact section, not chrome) |

## Experiences

Prompt M gives these one story each in the Experiences folder, starting "One-off: not
a building block."

| Component | Files | Used in | Kind | Storybook |
|---|---|---|---|---|
| Hero | `src/components/home/Hero.tsx`, `src/styles/hero.css` | Home | Experience | Experiences |
| AboutRail | `src/components/home/AboutRail.tsx`, `aboutRailSquares.ts`, `src/styles/about-rail.css` | Home | Experience | Experiences |
| HeroAvatar | `src/components/avatar/HeroAvatar.tsx`, `HeroAvatarLive.tsx` | Hero | Experience | Experiences |
| AvatarGuide | `src/components/avatar/AvatarGuide.tsx`, `AvatarCall.tsx`, `controller.ts`, `corner.ts`, `dock.ts`, `eyeFollow.ts`, `lines.ts`, `audioUnlock.ts`, `brandPaths.ts` | App (every page) | Experience | Experiences |
| SkillsView | `src/components/avatar/SkillsView.tsx`, `SkillsShare.tsx`, `skills.ts` | AboutRail ("View my skills"); SkillsShare also in AvatarCall | Experience | Experiences |
| HealthspanSimulator | `src/components/healthspan/` (`HealthspanSimulator.tsx`, `HealthspanChart.tsx`, `chart.ts`, `hooks.ts`, `levers.ts`, `model.ts`, `theme.ts`, `index.ts`) | GalleryExperiment | Experience | Experiences |
| ChassisReveal | `src/components/telemetry/ChassisReveal.tsx`, `ShirtBay.tsx` | App (every page) | Experience | Experiences |
| Grain | `src/components/Grain.tsx` | Home, CaseStudy, Gallery | Experience | Experiences |

## Behaviors

Prompt N adds a line for each to CLAUDE.md. No stories.

| Component | Files | Used in | What it does |
|---|---|---|---|
| ScrollManager | `src/components/ScrollManager.tsx` | App | On a route change, scrolls to the top, or to the hash's element once it's mounted |
| PageTransition | `src/components/PageTransition.tsx` | App | Slides the new page in: from the right into a case study, from the left back home |
| Reveal | `src/components/casestudy/Reveal.tsx` | CaseStudy (22 places) | Fades and lifts a block in as it scrolls into view |

## Pages

Prompt N gives Home and the PLMC case study stories in the Pages folder.

| Page | File | Route | Storybook |
|---|---|---|---|
| Home | `src/pages/Home.tsx` | `/` | Pages |
| CaseStudy | `src/pages/CaseStudy.tsx` | `/work/:slug` | Pages (PLMC) |
| Gallery | `src/pages/Gallery.tsx` | `/gallery` (not linked from the site) | none yet |
| GalleryExperiment | `src/pages/GalleryExperiment.tsx` | `/gallery/:slug` | none yet |

## Unused

Nothing imports these (checked by searching every import in `src/`). All four stay in
the repo as Unused for now. Derek: "demo scope, and PixelCameo may come back." Deleting
any of them later is its own decision, on its own branch.

| Component | Files | What it was for | Decision |
|---|---|---|---|
| WorkList | `src/components/home/WorkList.tsx` | The old "The work" rows; the hero's grid replaced them (`Home.tsx` keeps it "for reference until the redesign settles") | Keep for now |
| AboutJourney | `src/components/home/AboutJourney.tsx`, `AboutJourneyBackground.tsx`, `aboutJourneyEngine.ts`, `aboutJourneyRunner.ts`, `aboutJourneyRive.ts`, `src/styles/about-journey.css` | The pinned About section with the Rive background; AboutRail replaced it ("preserved for reuse") | Keep for now |
| PixelCameo | `src/components/home/PixelCameo.tsx` (and its test) | The camera that brings out pixel Derek; "off for this iteration" (`Hero.tsx`) | Keep for now (may come back) |
| (patterns) | `src/theme/patterns.ts` | Inline style patterns used only by WorkList and AboutJourney | Keep for now (goes with them) |

## One-offs

Drawn inside a component, and staying there. Derek: "They're one offs. This doesn't
have to be a perfect 100% complete. It's just for demo purposes."

| One-off | Where | Looks like |
|---|---|---|
| "Next case study" label | `src/components/casestudy/NextCaseFooter.tsx:31` | 0.66rem / 0.2em uppercase, `colors.textMuted`; close to Eyebrow, but not one |
| The scattered tags | `src/components/casestudy/ContextPanel.tsx:54` | Chip-like outlined tags, larger than Chip, rotated and animated, accent when tidied |

## Repeated patterns that aren't components yet

From the inventory (Derek reviewed it after Move 12) and a fresh scan of `CaseStudy.tsx`
and `Hero.tsx` for repeated `style={{` blocks. `Hero.tsx` has none: its styles are all
in `hero.css`.

| Pattern | Where | Kind if built | Status |
|---|---|---|---|
| Uppercase nav link | SiteHeader (5), CaseStudyHeader (2) | Primitive | Waiting: four sizes, a design call (`GAPS.md`) |
| Stat: big number with a small label | StatBand, `about-rail.css` | Primitive | Waiting: the numbers differ, a design call (`GAPS.md`) |
| Arrow buttons and the flow viewer's Close | FlowStrip (5) | Primitive (Button, icon-only) | Waiting: Button has no icon-only form (`GAPS.md`) |
| Media tile | Hero, Gallery | Primitive | Waiting: two different designs (`GAPS.md`) |
| Case-study section frame | CaseStudy: `sectionInner` 5×, `scrollMargin` 6×, the top rule twice with and twice without the alternate background | Block | Waiting: `layout.sidePad` is a `clamp()` (Move 15; `GAPS.md`) |
| Section heading, body text | CaseStudy: `h2Style` 4×, `bodyP` 7× | Not a component: text styles | For text-style tokens (Prompt G in Figma) |
| Headline with an accent word | CaseStudy: `{ color: colors.accentBright }` span 2×, and ContactSection, FlowStrip, PersonaCard, SkillsShare | Not a component: a text style and a `<span>` | None |
| Spacing between blocks | CaseStudy: three `marginTop` clamps, each used twice | Not a component: spacing | For spacing tokens, if wanted |

## Done from GAPS.md

| Gap | What happened |
|---|---|
| Tidy it up toggle, collage Close, full-size view Close, phone Menu | On Button, outline compact; the toggle with `aria-pressed` ("Five promotions") |
| "Show me the images →" | The Callout's link |
| flowStrip's `.eyebrow` | Label, muted |
| "Next case study" label, scattered tags | One-offs (above) |
| Motion tokens, layout tokens | Still open in `GAPS.md`: token gaps, not components |

Counts: 13 Primitives (10 in `src/ui/`), 10 Blocks, 3 Chrome, 8 Experiences, 3
Behaviors, 4 Pages, 3 Unused components (plus `patterns.ts`), 2 one-offs.
