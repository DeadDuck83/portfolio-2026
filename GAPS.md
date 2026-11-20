# Gaps

What the site still builds by hand, and what should replace each one (the rule is in
CLAUDE.md). The older gaps (the three missed buttons, the scatter tags, motion and
layout tokens) are still in `portfolio-2026-case-study/gaps.md`, outside the repo, until
they move here.

## Waiting (component inventory, 2026-11-19)

From the inventory Derek reviewed after Move 12. Each of these waits on something before
it can be built. The decisions are in `docs/in-system-design/DECISIONS.md`, under
"Component inventory".

### Patterns drawn inline

| Pattern | Where | Places | Should become | Waiting on |
|---|---|---|---|---|
| Uppercase nav link | `src/components/home/SiteHeader.tsx:108, 111` (desktop), `:155, 169, 183` (phone menu); `src/components/casestudy/CaseStudyHeader.tsx:54` (← All work), `:99` (section nav) | 7 | One nav-link component in `src/ui/` | A design call: there are four sizes (0.62 to 0.8rem), so one size moves both headers. The section nav (`:99`) already matches the small label exactly (0.62rem, 0.18em, `textFaint`). |
| Stat: big number with a small label | `src/components/casestudy/StatBand.tsx:31` (number), `:34` (label); `src/styles/about-rail.css:286–310` | 2 | A stat component | A design call: the labels match, but the number's size and colour don't, and StatBand counts up. |
| Arrow buttons (← →) | `src/components/casestudy/FlowStrip.tsx:169, 179` (the strip, `.stripArrow`), `:289, 292` (the viewer, `.arrow`) | 4 | Button, with an icon-only form | Button has no icon-only form yet, and the strip's arrows use each case study's brand colours. |
| Media tile: cover and title, linking to a piece of work | `src/components/home/Hero.tsx:162, 168` (styles in `hero.css:334–475`); `src/pages/Gallery.tsx:97` (GalleryTile) | 2 | One tile component, if the two designs converge | They're two different designs, and the Gallery page isn't linked from the site. |
| Case-study section frame: top rule, alternating background, inner padding | `src/pages/CaseStudy.tsx:307, 345, 391, 438, 544` | 5 | A section component in the Case study folder | Its padding is `layout.sidePad`, a `clamp()` that Figma variables can't hold (Move 15). |

### Components outside `src/ui/`

| Component | Where it renders | Should go | Waiting on |
|---|---|---|---|
| ChapterHeading | `src/pages/CaseStudy.tsx:314, 352, 397, 444, 551` | Storybook's Case study folder | Prompt K (Move 21) |
| PlaceholderFigure | `src/pages/CaseStudy.tsx:301, 414, 429, 521, 535` | Storybook's Case study folder | Prompt K (Move 21) |
| PersonaCard | `src/pages/CaseStudy.tsx:367, 368` | Storybook's Case study folder | Prompt K (Move 21) |
| SiteFooter | `src/pages/Home.tsx:49`, `src/pages/CaseStudy.tsx:646`, `src/pages/Gallery.tsx:92` | Storybook's Site folder | Prompt L (Move 22) |
