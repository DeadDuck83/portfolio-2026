# Gaps

What the site still builds by hand, and what should replace each one (the rule is in
CLAUDE.md). The older gaps from `portfolio-2026-case-study/gaps.md`, outside the repo,
moved here on 2026-11-20 (see "Older gaps" below).

## Waiting (component inventory, 2026-11-19)

From the inventory Derek reviewed after Move 12. Each of these waits on something before
it can be built. The decisions are in `docs/in-system-design/DECISIONS.md`, under
"Component inventory".

### Patterns drawn inline

| Pattern | Where | Places | Should become | Waiting on |
|---|---|---|---|---|
| Uppercase nav link | `src/components/home/SiteHeader.tsx:108, 111` (desktop), `:141, 155, 169` (phone menu); `src/components/casestudy/CaseStudyHeader.tsx:54` (← All work), `:99` (section nav) | 7 | One nav-link component in `src/ui/` | A design call: there are four sizes (0.62 to 0.8rem), so one size moves both headers. The section nav (`:99`) already matches the small label exactly (0.62rem, 0.18em, `textFaint`). |
| Stat: big number with a small label | `src/components/casestudy/StatBand.tsx:23` (number), `:26` (label); `src/styles/about-rail.css:286–310` | 2 | A stat component | A design call: the labels match, but the number's size and colour don't, and StatBand counts up. |
| Arrow buttons (← →), and the flow viewer's Close beside them | `src/components/casestudy/FlowStrip.tsx:170, 180` (the strip, `.stripArrow`), `:291, 294` (the viewer, `.arrow`), `:297` (the viewer's Close, `.close`) | 5 | Button, with an icon-only form | Button has no icon-only form yet, and the strip's arrows use each case study's brand colours. The viewer's Close is styled as one set with its arrows, so it moves with them (DECISIONS.md, "Five promotions"). |
| Media tile: cover and title, linking to a piece of work | `src/components/home/Hero.tsx:162, 168` (styles in `hero.css:334–475`); `src/pages/Gallery.tsx:97` (GalleryTile) | 2 | One tile component, if the two designs converge | They're two different designs, and the Gallery page isn't linked from the site. |
| Case-study section frame: top rule, alternating background, inner padding | `src/pages/CaseStudy.tsx:253, 291, 330, 377, 454` | 5 | A section component in the Case study folder | Its padding is `layout.sidePad`, a `clamp()` that Figma variables can't hold (Move 15). |

### Components outside `src/ui/`

| Component | Where it renders | Should go | Waiting on |
|---|---|---|---|
| SiteFooter | `src/pages/Home.tsx:49`, `src/pages/CaseStudy.tsx:535`, `src/pages/Gallery.tsx:92` | Storybook's Site folder | Prompt L (Move 22) |

ChapterHeading, PlaceholderFigure and PersonaCard left this table on 2026-11-20: they have
stories in the Case study folder (Prompt K), with the other six case-study blocks.

## Older gaps (moved from the case-study gaps.md, 2026-11-20)

### Buttons that weren't Button yet: switched

Logged 2026-11-19, Derek: "Log the three missed buttons (Tidy it up toggle, collage open
and Close, phone Menu) as a gap to fix after Storybook." Switched on 2026-11-20, approved by
Derek and committed as "Five promotions" (DECISIONS.md, "Five promotions"):
- the Tidy it up toggle, the image collage's Close, the full-size view's Close and the
  phone Menu are on Button (outline, compact), the toggle with `aria-pressed`;
- "Show me the images →" is the Callout's link.

The flow viewer's Close isn't switched: it waits with the arrows (above).

### Also open

The "Next case study" label and the context panel's scattered tags are settled as one-offs
that stay inside their components (COMPONENTS.md; Derek: "They're one offs.").

| Gap | Where | Now | Should become, and when |
|---|---|---|---|
| Motion tokens | `src/ui/Button.css:7` (`--ui-button-ease`, a literal curve) | | A motion token. Code only: Figma can't store easing. |
| Layout tokens | `src/theme/tokens.ts:142` (`layout.sidePad`, a `clamp()`) | | A layout token, once there's a way to hold a `clamp()`; Figma variables can't (Move 15). |

## Accessibility (flagged in Storybook)

| Gap | Where | What it means | Waiting on |
|---|---|---|---|
| EmailLink's accessible name doesn't contain its visible words (axe `label-content-name-mismatch`, WCAG 2.5.3 Label in Name). Flagged on all four EmailLink stories, 2026-11-19. | `src/ui/EmailLink.tsx:81`: the name is always "Copy" plus the address. Three uses show other words: the hero's "Copy email" (`src/components/home/Hero.tsx:86`) and "Contact" in the case-study header (`src/components/casestudy/CaseStudyHeader.tsx:67`) and case footer (`src/components/SiteFooter.tsx:55`). The Contact section shows the address itself (`src/components/home/ContactSection.tsx:62`). | Someone using speech control who says "click Contact" may not reach the button, because its name doesn't include "Contact". | Nothing: left as is for now. Derek: "thats fine, it might be overkill anyway." It was already on the live site; promoting EmailLink didn't change it. WCAG 2.5.3 is Level A, under the WCAG 2.2 AA bar in DECISIONS.md, so it stays listed as a known exception. The fix, if it's wanted later: start the name with the visible words (for example "Contact: copy" plus the address). |
| Italic subtitles and captions in `textFaint` (`#6f6858`) are 3.23:1 on the page background and 3.34:1 on the alternate one; text this size needs 4.5:1 (axe `color-contrast`, WCAG 1.4.3, Level AA). Flagged 2026-11-20 on the ChapterHeading, PersonaCard and ContextPanel stories. | ChapterHeading's subtitle (`src/components/casestudy/ChapterHeading.tsx:23`, 1.05rem), PersonaCard's subtitle (`src/components/casestudy/PersonaCard.tsx:26`, 1rem), ContextPanel's caption (`src/components/casestudy/ContextPanel.tsx:98`, 0.95rem). NextCaseFooter's italic note (`NextCaseFooter.tsx:50`) is also `textFaint`: it passes on desktop, where it's large text (27px, which needs 3:1), but not on a phone, where it's 16px. `textFaint` text in SiteFooter and CaseStudyHeader gets checked with their stories in Prompt L. | Low-vision visitors may not be able to read the subtitles. | Derek's call, since it changes how the site looks. The fix that worked for Label ("Five promotions"): `colors.textMuted` (`#8f8674`, 4.96 to 5.28:1). It was already on the live site; the stories didn't change it. |
| The flow cards' accessible names don't contain their visible words (axe `label-content-name-mismatch`, WCAG 2.5.3 Label in Name, Level A). Flagged 2026-11-20 on all three FlowStrip stories. | `src/components/casestudy/FlowStrip.tsx:137`: each card is named "{title}: open all {n} screens", but it shows the title with a full stop, the flow's line, and "{n} screens →". | Same as EmailLink: someone using speech control who says the words they see may not reach the card. | Derek's call. One fix: start the name with what's shown, for example "The exam room. 9 screens, open them all". It was already on the live site. |
| Opening the full-size view leaves focus on the collage's Close, behind it, instead of the view's own Close (WCAG 2.4.3 Focus Order, Level A). Pressing Enter then closes the whole collage. Found 2026-11-20 by the ImageCollage "Full Size View" story's test, not by axe. | `src/components/casestudy/ImageCollage.tsx:33–51`: the collage's effect focuses its Close and depends on `lightbox`, so when the full-size view opens it runs again, after the view has focused its own Close (`:319`). It happens on the live site (checked on a production build). The dev server's StrictMode re-runs the view's effect, which hides it there. | A keyboard user who opens an image and presses Enter or Space to close it loses the whole collage, and screen readers start on a control they can't see. | Derek's OK, since it changes behaviour. The fix: focus the collage's Close only when the collage opens (its own effect, with no `lightbox` dependency), and when the full-size view closes, put focus back on the image that opened it. The story would then check that focus lands on the view's Close. |

### Seen while writing the stories (not flagged by axe)

| Gap | Where | What it means | Waiting on |
|---|---|---|---|
| DecisionLog's rows don't say whether they're open, and their focus ring is the browser's default (blue, not Button's olive). | `src/components/casestudy/DecisionLog.tsx:34`: the row `<button>` has no `aria-expanded` and no focus style; its hover is JavaScript (`onMouseEnter`). | Screen readers hear "button" with no "expanded" or "collapsed"; keyboard users see a ring that doesn't match the rest of the site. | Derek's call. The fix: `aria-expanded={isOpen}` and `aria-controls` on the row, and Button's focus ring. |
