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
| `textFaint` (`#6f6858`) text that's still under AA: 3.23:1 on the page background, where this size needs 4.5:1 (axe `color-contrast`, WCAG 1.4.3, Level AA). | NextCaseFooter's italic note (`src/components/casestudy/NextCaseFooter.tsx:50`): it passes on desktop, where it's large text (27px, which needs 3:1), but not on a phone, where it's 16px. `textFaint` text in SiteFooter and CaseStudyHeader gets checked with their stories in Prompt L. | Low-vision visitors may not be able to read it. | Derek's call. The fix used for the others: `colors.textMuted`. ChapterHeading's and PersonaCard's subtitles and ContextPanel's caption were fixed that way on 2026-11-20 (below). |
| The flow cards' accessible names don't contain their visible words (axe `label-content-name-mismatch`, WCAG 2.5.3 Label in Name, Level A). Flagged 2026-11-20 on all three FlowStrip stories. | `src/components/casestudy/FlowStrip.tsx:137`: each card is named "{title}: open all {n} screens", but it shows the title with a full stop, the flow's line, and "{n} screens →". | Same as EmailLink: someone using speech control who says the words they see may not reach the card. | Nothing: left as is, a known exception alongside EmailLink. Derek: "fix real failures, stay consistent on 2.5.3." It was already on the live site. The fix, if it's wanted later: start the name with what's shown, for example "The exam room. 9 screens, open them all". |

### Fixed (commit "Case study fixes", 2026-11-20)

Derek: "fix real failures, stay consistent on 2.5.3." Details in DECISIONS.md, "Case study fixes".
- **Contrast:** ChapterHeading's subtitle, PersonaCard's subtitle and ContextPanel's caption are `colors.textMuted` (4.96 to 5.28:1), the grey Label uses. axe: 0 on their stories.
- **Focus in the full-size view:** focus moves to its Close, Tab and Shift+Tab stay inside it (an image's Close, or a video's controls), and closing it returns focus to the image that opened it. Checked with real key presses on a production build.
- **DecisionLog:** each row has `aria-expanded` and `aria-controls`, a closed row's text is hidden from screen readers, and the rows have the site's focus ring.

### Seen while checking the fixes (not flagged by axe)

| Gap | Where | What it means | Waiting on |
|---|---|---|---|
| Closing the image collage doesn't return focus to "Show me the images →"; focus goes to the page itself. | `src/pages/CaseStudy.tsx:70` (`closeCollage`) and the Callout's link (`:226`). | A keyboard user has to find their place again from the top of the page. | Derek's call. The fix: keep a ref to the link and focus it when the collage closes. |
