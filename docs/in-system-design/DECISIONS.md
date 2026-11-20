# Decisions

How the In-System Design build got to where it is. One entry per decision, newest
at the bottom of each section. Read this before changing anything the guide or a
prompt says, so a later session doesn't undo a choice that was made on purpose.

Each entry: **Decision**, **Why**, **Status** (Done, Agreed, Proposed or Open), and
where it came from. "Derek" means Derek said or approved it. "Claude Code" means his
local Claude Code chose it and Derek didn't object.

Drafted 2026-11-19 from build-log-notes.md, gaps.md, prompts-revised.md and the
chat about the guide. Where the files kept by Claude Code say something different,
they win: tell Derek and fix this file. Checked against those three files and GUIDE.md by
Claude Code on 2026-11-19. Everything that names Step 3 or Prompts J to P matches
GUIDE.md. Two "Scope and governance" entries (WCAG 2.2 AA at the component level,
and heavy token use in Figma) come only from the chat and couldn't be checked.

---

## How the work is run

### Code is the source of truth, not the guide's counts
- **Decision:** check every prompt against the live code before running it. Prompts
  A, B and C were rewritten from the code (see prompts-revised.md).
- **Why:** the guide was written from a word count. Nothing imports solidCta or the
  eyebrow pattern, and chip is only used by two files nothing renders. Derek:
  "Running it as written could build components we no longer use."
- **Status:** Done (Moves 5 to 7).

### Exact pixel diffs, plus style and layout checks
- **Decision:** every visual check is an exact pixel diff (no tolerance), backed by a
  computed-style compare and a layout compare where pixels can't tell a move from a
  change.
- **Why:** a 0.1 tolerance called the header hover bug "identical" (the exact diff
  found 331 pixels). The film grain makes a moved button look changed, and text
  redrawn after a shift never lines up again.
- **Status:** Done. Use it for every move that touches the site.

### Switch one place at a time, Derek approves each change
- **Decision:** after each place switches, show every page that changed with before
  and after shots, and Derek approves each difference.
- **Why:** Derek's addition to Prompt B, so an intended change gets his sign-off
  instead of being waved through as "matches the hero".
- **Status:** Agreed. Applies to Prompts B, C and Step 3 (Prompts K and L).

### Stage commits by name
- **Decision:** commit by naming files, never `git add -A`.
- **Why:** keeps the untracked Rive file (`public/background/squares_v1.riv`) out of
  the repo. It's hidden with `.git/info/exclude`, not committed.
- **Status:** Done since Move 5.

### Dependency warnings wait for their own branch
- **Decision:** leave `npm audit` advisories alone during this work (13 as of Move 8,
  9 before it).
- **Why:** changing dependencies mid-refactor means "nothing moved" can't be proven.
- **Status:** Open. Fix on a separate branch after this one merges.

### Pushing the branch doesn't deploy derekjmoore.com
- **Decision:** keep pushing `feature/design-system-foundation` as a backup. Cloudflare
  builds every branch push, but branch builds run `npx wrangler versions upload`,
  which uploads a version without deploying it. Only `main` runs `npx wrangler deploy`.
- **Why:** each pushed tip from `87c0522` on got a "Workers Builds: portfolio-2026"
  check on GitHub with a Version ID and no Preview URL, and after all of them the live
  site still served main's build (`index-74ec8GQs.js`, the file a local build of
  `a987ef8` makes; the branch builds `index-DWaJDR4d.js`). Derek checked the Cloudflare
  dashboard on 2026-11-19: "The dashboard's non-main command is the Version command:
  npx wrangler versions upload (Deploy command for main is npx wrangler deploy)."
- **Status:** Done. Earlier notes ("builds main only", "no check runs") were wrong:
  branches are built, just not deployed.

### No Version URLs for now
- **Decision:** `preview_urls` stays `false` in `wrangler.jsonc`, so an uploaded branch
  version has no workers.dev link of its own.
- **Why:** the project deploys straight to production, and Cloudflare's docs say
  disabling Version URLs "disables routing to Version URLs and aliased Version URLs".
  Derek: false "for now". Turning it on would give each branch version a link to check
  before merging.
- **Status:** Agreed for now.

---

## Tokens (Move 5)

- **Decision:** two layers in tokens.ts, primitive and semantic, with a generated
  tokens.css imported once in src/main.tsx and a test that fails when it's stale.
  **Why:** without the import the site never reads its own variables, and Figma's
  code syntax would point at nothing. **Status:** Done (`5296baa`).
- **Decision:** palette names umber, sand, olive, forest and stone; alpha names like
  `sand100A08` / `--sand-100-a08`. **Why:** Claude Code's naming. **Status:** Done, no
  objection from Derek.
- **Decision:** `paper` stays JS-only and out of tokens.css. **Why:** only the
  unrendered About journey reads it. **Status:** Done.
- **Decision:** `layout` isn't aliased. **Why:** a `clamp()` isn't a raw value, and
  Figma variables can't hold it either. **Status:** Done; flagged for Move 15.
- **Decision:** the generator strips types with the TypeScript compiler already in
  the project. **Why:** Node 20 can't run TypeScript directly. **Status:** Done.

## Button (Move 6)

- **Decision:** one `src/ui/Button.tsx` with `variant` (solid, outline) and `size`
  (default, compact), CSS states instead of the JS hover, and a class-name helper
  for EmailLink and Link. **Why:** the site drew the same button three ways, and the
  JS hover can't do `:focus-visible`, ignored Pause motion and had a colour bug.
  **Status:** Done (`18cc772`).
- **Decision:** EmailLink gets a `plain` prop (on by default). **Why:** its inline
  reset beats any class, and the hero's "Copy email" link depends on that reset.
  **Status:** Done.
- **Decision:** Derek approved all six resolved differences (email button border,
  compact size from the case-study header, one focus ring, eased hover on Contact and
  headers, About rail respects Pause motion, header hover bug fixed). **Status:** Done.
- **Decision:** focus-ring contrast check before committing. **Why:** Derek asked.
  **Result:** 19 of 19 pass, worst 6.90:1 against 3:1. **Status:** Done.
- **Decision:** two new tokens for the buttons: `border.control` (`sand100A15`, the
  outline border) and `colors.accentWash` (`olive500A14`, the outline hover fill).
  **Why:** Prompt B allowed no new hex or rgba values outside tokens. **Status:** Done.
- **Decision:** the easing curve stays a literal in Button.css. **Why:** there are no
  motion tokens yet, and Prompt B only asked for colours to come from tokens. Figma
  can't store easing, so a motion token would be code-only. **Status:** Open as a
  motion-token gap.

## Chip and Eyebrow (Move 7)

- **Decision:** Eyebrow at .68rem, not .70rem. **Why:** it's the chapter labels' size
  (5 uses per case study); .70 pushed the subtitle of PLMC's "Two users" heading onto
  its own line on phone. Derek approved the cost: the case-study hero line shrinks,
  so every case study moves up 1 to 3px below it (17px on Bexa's phone layout, where
  "Case study 02" now wraps onto two lines instead of three). **Status:** Done
  (`56bca7b`).
- **Decision:** Eyebrow comes from the chapter labels and the "Case study 04" line,
  not the guide's "/ Section" label, which no longer exists. **Status:** Done.
- **Decision:** Chip takes `as="li"` so the About rail keeps its list markup.
  **Status:** Done.
- **Decision:** leave `patterns.ts`, `WorkList.tsx` and `AboutJourney.tsx` in place.
  **Why:** AboutJourney belongs to the Rive About journey, which may come back.
  Deleting is a separate decision. **Status:** Open (Prompt J asks keep or delete).
- **Decision:** log the three missed buttons (ContextPanel toggle, collage open and
  Close, phone Menu) to fix after Storybook. **Why:** Derek: "Log the three missed
  buttons (Tidy it up toggle, collage open and Close, phone Menu) as a gap to fix
  after Storybook." **Status:** Agreed; logged in gaps.md (now in GAPS.md, since
  2026-11-20), and in Prompts K and L.

## Storybook (Move 8)

- **Decision:** install docs and a11y only, no test feature, telemetry off, with
  explicit installer flags. **Why:** the default would have rewritten the test setup
  that has been the gate for every move, and the installer answers its own prompts
  when it detects Claude Code. **Status:** Done (Storybook 10.6.7, commit "Install
  Storybook", approved by Derek).
- **Decision:** delete two unused React imports in Storybook's sample files.
  **Why:** they broke `npm run build`, which would have broken the Cloudflare deploy
  on push. **Status:** Done (before anything was pushed).

## Storybook stories (Move 9)

- **Decision:** the preview loads tokens.css and global.css in the site's order, copies
  index.html's font preconnects into preview-head.html, and takes its default
  background from `colors.bg` in tokens.ts. **Why:** the fonts come from global.css's
  `@import`, and a token avoids a second copy of `#1a1712`. **Status:** Done.
- **Decision:** each component's "when to use" text lives in its own JSDoc, with an
  `@import` tag. **Why:** the MCP server reads the component's JSDoc, not the story
  file, and without the tag the manifest invents `import { Button } from 'portfolio'`.
  **Status:** Done, but the tag had no effect until the engine change under "Docs import
  snippets" below.
- **Decision:** Storybook uses `react-docgen-typescript`, and Button's allowed values are
  written out as unions. **Why:** the default docgen dropped Button's props, which are
  imported from buttonClass.ts, and an alias showed as `ButtonVariant` instead of its
  values. Costs a slower manifest (about 1.2s instead of 19ms). **Status:** Done.
- **Decision:** the click and keyboard test lives in its own Keyboard Focus story.
  **Why:** a play function that clicks leaves the Solid story opening with its focus
  ring showing. **Status:** Done.
- **Result:** every story's computed styles match the same element on the live site in
  every state; the Accessibility panel reports 0 violations on all 8 stories; the
  site is unchanged (0 px after recapturing one text-antialiasing flake).

## Storybook MCP (Move 10)

- **Decision:** the Storybook MCP is added at project scope, so `.mcp.json` is
  committed and every session in the repo gets `portfolio-sb`. **Why:** the guide's
  command, so the connection doesn't depend on one machine's settings. **Status:** Done
  (commit "Connect Storybook MCP").
- **Decision:** Move 10 now says both lines go at the terminal prompt, and the second
  is `claude --continue` instead of `claude`. **Why:** in the run, `claude --resume`
  and `claude` were typed inside Claude Code, where they go to the agent as a message
  and do nothing. Derek approved the fix. **Status:** Done.
- **Result:** `docs-list` returns Button (4 stories), Chip (2) and Eyebrow (2), each
  with its JSDoc description.

## Agent rules (Move 11)

- **Decision:** the four agent rules go into the existing CLAUDE.md as a Building UI
  section, and the Build docs rule stays as it was. **Why:** Prompt E said to create
  CLAUDE.md, which would have overwritten the rule that keeps GUIDE.md and this file
  up to date. Derek: "adding the agent rules to the existing CLAUDE.md and keeping the
  build-docs rule." **Status:** Done.
- **Decision:** the GAPS.md rule says the file goes at the repo root and is created
  when missing. **Why:** no move has created it yet (Moves 19 and 25 commit it), and
  the old gaps.md lived outside the repo. **Status:** Done.
- **Result:** in a new session, `Which component should I use for a section label?`
  got Eyebrow, found with `docs-list` and `docs-show`. The answer also showed that the
  docs' import snippets read `import { Eyebrow } from 'portfolio'`, which doesn't exist.

## Docs import snippets (after Move 11)

- **Decision:** the manifest is built with `features.experimentalReactComponentMeta`,
  and Controls keep `react-docgen-typescript`. **Why:** in Storybook 10.6.7 the
  react-docgen-typescript manifest looks for `@import` in the component description,
  and react-docgen-typescript 2.4.0 keeps tags out of it, so the tag was ignored and
  every snippet fell back to the package name. The new engine reads the tag and lists
  the same props and descriptions (Button's unions intact), plus Button's `href`.
  Derek asked for the snippets to show the real default import; Claude Code chose the
  engine over patching Storybook or rewriting the manifest in main.ts. **Status:**
  Done. The flag is experimental: if an upgrade breaks the manifest, check this first.
- **Decision:** the `@import` tags read `'../ui/Button'`, `'../ui/Chip'` and
  `'../ui/Eyebrow'`. **Why:** `'src/ui/…'` doesn't resolve (no `src/` alias).
  `'../ui/…'` is how `src/pages` imports them, and matches the `'../data/…'` lines in
  the same snippets. **Status:** Done.
- **Result:** the manifest gives `import Eyebrow from '../ui/Eyebrow';` (and the same
  for Button and Chip), checked on a second Storybook with this config. A Storybook
  that was already running needs a restart to pick up the change.

## Check that nothing moved (Move 12)

- **Decision:** Move 12 passes when the branch differs from `main` only where Derek
  approved in Moves 6 and 7, not when it "matches the baseline screenshots". **Why:**
  the branch changes the Contact email button, the header Contact and the case-study
  eyebrow on purpose, so an exact match can't happen. **Status:** Done; Derek approved
  the revised "Done when" line.
- **Result:** build, 106 tests and lint pass. Against Move 9's captures: 0 px on all
  five. Against `main` on the four baseline pages: home desktop 2,752 px (Move 6's
  2,746 in the Contact buttons, plus 6 single pixels on one rounded box, the control
  floor); home phone 2px taller, with the same 4,928 + 37 px Move 6 recorded; PLMC 1px
  (desktop) and 3px (phone) shorter. The layout compare matches Moves 6 and 7 element
  for element. Derek's look at main (:5174) and the branch (:5173): "Site looks right
  on both."

## Component inventory (after Move 12)

Part of Prompt J (Move 20), run early. Derek reviewed a list of every repeated element
that isn't in `src/ui/` yet, then a contact sheet of the small caps:
`portfolio-2026-case-study/step-13/compare.html`, 22 shots from the dev server with the
computed font size, letter spacing and colour of each (made by `tools/labelsheet.mjs`).
COMPONENTS.md isn't written yet. "Derek:" below quotes his review.

- **Decision:** the 11 small uppercase labels become one component with two colours,
  green (`colors.accentBright`, `#9da767`, used by 7 of the 11) and grey
  (`colors.textFaint`, `#6f6858`, used by 3; later `colors.textMuted`, for contrast:
  see "Five promotions"), at one size and letter spacing chosen the
  same way: 0.62rem and 0.18em (8 of the 11). **Why:** Derek: "The small uppercase label
  becomes its own component with two colours, green and grey. Use the green and grey
  most of the 11 labels use, and one size and letter spacing the same way." **Status:**
  Agreed, not built. Its name and props are decided when it's built.
  **What changes when it switches** (4 of the 11; the other 7 already match):
  - `DecisionLog.tsx:102`, the column labels ("The call", "What it cost", PLMC's "The
    payoff"): 0.6rem to 0.62rem. Stays grey.
  - `ImageCollage.tsx:84`, "Image collage": letter spacing 0.2em to 0.18em. Stays green.
  - `ImageCollage.tsx:289`, the collage caption tags: 0.6rem to 0.62rem and 0.16em to
    0.18em. Stays green.
  - `FlowStrip.tsx:279` (style at `flowStrip.module.css:27`), "Flow 01 / 05": colour
    `#8f8674` (`textMuted`, hard-coded in the CSS) to grey. Size and spacing stay.
  **Settled:** the collage caption tags show the same `caption.tag` data as
  PlaceholderFigure's figure tags (FIG. A, 01), which the counters decision below leaves
  alone, but also words (APP, PHOTO, BRAND). They stay one of the 11 labels. Derek:
  "I would say their labels."
- **Decision:** Eyebrow stays as it is (0.68rem, 0.24em, `colors.textMuted`). **Why:**
  Derek: "Eyebrow stays as is; all its uses are valid." The sheet shows all 7 uses (2 in
  the case-study hero, 5 through ChapterHeading) with the same computed style on every
  case study. flowStrip's `.eyebrow` isn't an Eyebrow: it's one of the 11 labels above,
  which answers Prompt J's question about it. **Status:** Done (no change).
- **Decision:** the dashed callout becomes one component with an option for with or
  without a link. The two are the TL;DR box (`CaseStudy.tsx:220`) and the Feature this
  box (`CaseStudy.tsx:491`); the link is "Show me the images →" (`CaseStudy.tsx:246`),
  which opens the image collage and is only in the TL;DR box. **Why:** Derek: "Dashed
  callout is one component with an option for with or without a link." The sheet shows
  the same border, padding, label and body text in both. **Status:** Agreed, not built.
  **Open:** the border, `rgba(132,137,69,0.45)`, has no token. It sits between
  `border.accentSoft` (0.4) and `border.accentMed` (0.5), so it needs a token decision
  when the component is built.
- **Decision:** the accent-rule aside is its own component, not a style of the callout.
  It's the ruled block in `CaseStudy.tsx:593` (one per lesson, on Sage, Bexa and Parker
  & Ace) and `CaseStudy.tsx:626` ("If I did it again", on PLMC). **Why:** Derek: "The
  accent-rule aside is not a callout; it becomes its own component." This replaces the
  inventory's suggestion that it could be a second style of the callout. Both have a
  1px `border.accentMed` rule on the left and 1.4rem of left padding; what's inside
  differs (a bold title and body, or a small label and body). **Status:** Agreed, not
  built.
- **Decision:** counters stay as they are and don't become labels: the flow strip's
  step numbers (`flowStrip.module.css:517`), the figure tags (`PlaceholderFigure.tsx:129`)
  and the decision log's row numerals (`DecisionLog.tsx:46`). **Why:** Derek: "Counters
  (step numbers, figure tags, row numerals) are not labels; leave them." **Status:** Done
  (no change).
- **Decision:** `GAPS.md` is created at the repo root now, holding the inventory's Wait
  rows (five patterns and four components). The older entries stay in the case-study
  folder's gaps.md, where the collage row was corrected: it called
  `ImageCollage.tsx:119` and `:385` "open / Close", but both are Close buttons (the
  collage's and the full-size view's), and the open control is `CaseStudy.tsx:246`.
  **Why:** Derek asked for the Wait rows in GAPS.md and the fix in gaps.md. **Status:**
  Done.
- **Decision:** gaps.md's open entries move into GAPS.md, under "Older gaps", updated
  with the decisions since. The flow viewer's counter becomes the small label, and
  "Show me the images →" becomes the dashed callout's link. Three line numbers now
  point at the element instead of its style (`ContextPanel.tsx:92` and `:61`,
  `SiteHeader.tsx:126`). gaps.md keeps a note at the top saying where they went, with
  its old text kept below for the case study. **Why:** CLAUDE.md sends every session
  to the repo's GAPS.md, so gaps outside the repo were invisible to them. Derek: "I
  think that's fine to update the the gaps MD." **Status:** Done (commit "Five
  promotions").

## TextLink (after the component inventory)

- **Decision:** one `src/ui/TextLink.tsx` for the small uppercase text link: the home
  footer's About, Work and Contact, the case footer's All work, Contact and Pause
  motion, and "← Gallery" above a gallery piece. It renders an `<a>`;
  `textLinkClass()` (`src/ui/textLinkClass.ts`) gives the same class to React
  Router's Link, EmailLink (with `plain={false}`) and MotionToggle. CSS `:hover` and
  `:focus-visible` replace `accentLinkHover`. It has no props of its own, because
  all seven places are one style. **Why:** Derek: "promote TextLink only, same
  pattern as Button." **Status:** Done (commit "TextLink").
- **Decision:** no `<button>` form. **Why:** the two buttons that use the style
  (EmailLink, MotionToggle) render their own element, so the branch would have no
  user. **Status:** Done.
- **Decision:** hover stays instant, with no transition. **Why:** it matches the JS
  hover it replaced, so nothing moves. **Status:** Done.
- **Decision:** the MotionToggle reset in `global.css` is wrapped in `:where()`.
  **Why:** on the site, component CSS loads before global.css (`main.tsx` imports
  App first), so the reset's `inherit` values tied with TextLink's class and won.
  In Storybook the order is reversed. `:where()` lets any class win in both.
  **Status:** Done.
- **Decision:** keyboard focus on all seven links gets Button's ring (accent bright,
  2px solid, 3px out) instead of the browser's blue ring (auto, 1px). Contrast is
  6.94:1 on `colors.bg` and 7.20:1 on `colors.bgAlt`, against 3:1 needed. **Why:**
  Derek: "Approve the focus ring." **Status:** Done.
- **Decision:** "← Gallery" on `/gallery/lifespan-vs-healthspan` takes TextLink's
  letter spacing, 0.16em instead of 0.14em, so it's 1.9px wider; nothing else on the
  page moves. **Why:** Derek: "Approve ... the Gallery letter spacing." **Status:**
  Done.
- **Decision:** buttons styled as TextLink lose the browser's button padding
  (`padding: 0` in TextLink.css). Until now the case footer's Contact (EmailLink)
  had 1px top and bottom and 6px each side. **Why:** Derek: "Drop the browser
  padding on the case footer's Contact." **Result:** Contact now sits the row's
  1.6rem gap (25.6px) from its neighbours instead of 31.6px. The three links' text
  is now level (All work used to sit 1px higher). On desktop the group is 12px
  narrower and stays centred (All work moves 6px right, Pause motion 6px left). On
  phone the footer is 2px shorter. Its focus ring now sits 3px from the text.
  Derek asked to see the row before and after on desktop and phone, and to commit if
  it looked right. Claude Code checked it (`step-13/textlink/footer-row.html`) and
  committed; Derek then reviewed the footer before and after himself and approved
  it. **Status:** Done, approved by Derek.
- **Result:** each place was switched on its own, then checked with:
  - exact pixel diffs of home, Sage, Gallery and the gallery piece, desktop and
    phone, with reduced motion;
  - the three footers shot on their own without reduced motion, so Pause motion
    shows;
  - each link at rest, on hover, after hover and on keyboard focus, plus its
    computed styles.

  Everything was 0 px except the focus ring and the Gallery link. Dropping the
  padding then changed only the case footer (on case studies and Gallery). Home
  desktop showed about 500 px three times in the decorative grid at CSS y
  1393–1743, the box behind Move 12's 6-pixel floor; retakes were 0 px. Build, 111
  tests and lint pass. The three stories have 0 axe violations, the Keyboard Focus
  play test passes, and the story styles match the live footer link.
  `accentLinkHover` stays in `src/lib/hover.ts`, because SiteHeader and Gallery
  still use it.
- **Found:** Chrome won't capture more than 16,384 device pixels in one screenshot.
  A full-page capture taller than that is blank below it, on both sides of a diff,
  so that part of the page is never compared. That covers every case study on phone
  (21,225 to 25,164 px at 3×) and Bexa on desktop (16,612 px at 2×). Every capture
  of those since Move 3 has missed the bottom of the page: on Sage's phone page, the
  last 1,809 CSS px, footer included. For TextLink, the footers were also shot on
  their own, so the switch is covered.
- **Decision:** full-page captures taller than the limit are shot in parts and
  stitched. `tools/shoot.mjs` (in the case-study folder, not the repo) clips the
  same full-page render into parts of at most 16,000 device px and joins them into
  one PNG; shorter pages are still one shot. **Why:** Derek: "fix the capture so
  long pages are shot in parts and compared in full." On Sage's phone page:
  - the top 16,384 rows match the old single shot exactly;
  - two captures match;
  - splitting at 9,000 instead of 16,000 gives the same image, so the joins don't
    show.

  **Status:** Done (commit "Full-page captures"). The tools live in the case-study
  folder, which isn't under git, so the commit holds these notes, not the code.
- **Result:** the full-page check against `main` (`a987ef8`) was re-run on
  `b78de0d`: home and the four case studies, desktop and phone, every page captured
  in full.
  - Home: desktop 2,746 px and phone 4,928 / 37 px, the same as Move 12.
  - Case studies: changed height, so each was compared row by row to the first
    difference, then shifted by the height change from where the two line up again
    (`tools/aligndiff.mjs`, which counts every pixel). Three kinds of difference:
    - the hero eyebrow band (Move 7);
    - the footer's links row (TextLink's padding);
    - small mid-page bands, 536 to 2,365 px a page: the context panel's rotated
      tags, single pixel rows inside photos and hairlines, drawn differently after
      the page moved up.
  - Layout compare, all eight case-study pages: only the eyebrow line, its wrappers
    and the footer's links row changed size, and every other element moved by
    exactly the eyebrow's amount.
  - In the part that had been hidden: the footer's links row on all five tall
    pages, 7 px on Sage's wordmark full stop, and one pixel row inside the photos
    on Bexa's phone page (137 px).
  - Nothing unapproved. The pictures are in `step-13/fullpage/hidden.html`.
  - Derek looked at Bexa's phone hero, 17px shorter since Move 7: "Bexa phone hero
    looks right."
- **Found:** `tools/pixdiff.mjs`, which every check since Move 5 has used, leaves out
  pixels that pixelmatch classes as anti-aliasing, so its "exact" isn't every pixel.
  `aligndiff.mjs` counts every pixel. **Status:** Left as is for now; a possible
  later improvement. Derek: "Honestly, I just want to get this working. We can always
  enhance it later." Moves, resizes and colour changes reach far past edge pixels,
  and the layout and computed-style checks don't use pixels at all.

## EmailLink (after TextLink)

- **Decision:** EmailLink moves from `src/components/` to `src/ui/EmailLink.tsx`
  (a git rename), with a JSDoc saying when to use it and how `plain` works with
  `buttonClass()` and `textLinkClass()`, an `@import` tag, 4 stories (Plain, As
  Button, As Text Link, Copied) and 4 tests. Its four uses (hero, Contact section,
  case-study header, case footer) and the two tests that render it import it from
  `src/ui/`. **Why:** Derek: "promote EmailLink the same way." **Status:** Done;
  Derek: "looks good to me." Committed as `49589c2` "EmailLink".
- **Decision:** its code stays as it was, including the inline plain-text reset;
  only the props type got a name (`EmailLinkProps`). **Why:** the hero's "Copy
  email" depends on that reset winning over classes. Its font size comes from the
  parent, because the inline `font: inherit` beats `.hx__link`'s 0.95rem. Its colour
  is set on `.hx__links` for the same reason, and its hover needs `!important`.
  Moving the reset into a CSS class would change the hero. Button and TextLink
  already style EmailLink through `plain={false}`. **Status:** Done.
- **Decision:** the stories import `buttonClass` and `textLinkClass` as
  `'../ui/…'`. **Why:** the docs manifest copies a story file's imports into every
  snippet, and `'./buttonClass'` only works inside `src/ui/`; `'../ui/…'` matches
  the `@import` tags. **Status:** Done.
- **Result:**
  - Switched one place at a time against `7368b1b` (:5174), with
    `tools/switch-check.sh`. Each round compared every page (home, Sage, Gallery,
    the gallery piece, desktop and phone, now captured in full), the footers on
    their own, and each EmailLink at rest, on hover, after hover and on focus,
    plus its computed styles.
  - Every place was 0 px, with no computed-style differences. The hero's "Copy
    email" has no phone states: it isn't shown at phone width.
  - The final round, with the old path gone, was 0 px on every page. Home desktop's
    decorative grid drew one of its two ways in some rounds (501 px).
  - Build, 115 tests and lint pass.
  - The stories render without errors and the Copied play test passes. On the
    site, the header Contact stays 99.06px wide when it changes to "Email copied".
  - axe flags `label-content-name-mismatch` (WCAG 2.5.3) on every EmailLink story:
    the name is always "Copy" plus the address, whatever the button says. It was
    already on the site. **Status:** Left as is. Derek: "thats fine, it might be
    overkill anyway." It stays in GAPS.md as a known exception to the WCAG 2.2 AA
    bar under "Scope and governance".

## Wordmark (after EmailLink)

- **Decision:** Wordmark moves from `src/components/` to `src/ui/Wordmark.tsx`, with
  its styles in `Wordmark.css` using tokens.css variables (`--font-display`,
  `--font-weight-display`, `--color-accent-bright`). It also gets a JSDoc saying
  when to use it, an `@import` tag, 3 stories (Home Header, Footer, Sizes In Use)
  and 2 tests. Its `size` prop is unchanged. Its four uses (home header, case-study
  header, Gallery header, footer) import it from `src/ui/`. **Why:** Derek: "Promote
  Wordmark the same way as TextLink and EmailLink." **Status:** Done (commit
  "Wordmark"), after Derek's review.
- **Decision:** the font size stays on the element (`size × 1.1rem`); everything
  else moves to the class. **Why:** global.css shrinks the case-study header's
  wordmark on narrow phones with `.cs-head__brand > span { font-size: … !important }`,
  which needs the size to stay where it was. Measured: 23.2px at 375 wide and
  20.8px at 330, the same as before. **Status:** Done.
- **Decision:** the new file was built beside the old one, and each use switched to
  it on its own; the old file was deleted at the end. **Why:** moving the styles
  into CSS changes how every use is drawn, so converting the shared file would
  have switched all four at once. **Status:** Done.
- **Result:**
  - Checked against `49589c2` (:5174) with `tools/switch-check.sh`, which now uses
    `ui-round.sh` (the TextLink round plus the home page's scrolled header, desktop
    and phone).
  - Footer, home header, case-study header and Gallery header: each 0 px on every
    page and in every state of the link around it, with no computed-style
    differences.
  - The wordmark and its dot have the same computed styles in all four places at
    1440, 390, 375 and 330 wide (16 checks).
  - The final round was 0 px everywhere except home desktop's decorative grid
    (501 px). Two fresh baseline shots of home desktop each matched the final at
    0 px, so it was the grid's other state in the first baseline shot.
  - Build, 117 tests and lint pass.
  - The stories render without errors, with 0 axe violations, and the Footer
    story's styles match the live footer, dot included.
- **Decision:** the four wordmark sizes stay (1.6, 1.5, 1.35, 1.3), although Prompt L
  expected two. **Why:** Derek: "4 for word mark is fine." **Status:** Done (no
  change).

## Five promotions (after Wordmark)

Derek: "Let's promote the 5 that are ready to go now." These are the inventory's
"promote now" items: the small label, the dashed callout, the accent-rule aside, the
grid with 1px lines, and the hand-built buttons. The review page is
`step-13/batch/review.html`.

- **Decision:** the small uppercase label is `src/ui/Label`, with `tone` (`accent`,
  the green `colors.accentBright`, by default; `muted`, the grey `colors.textMuted`)
  and `as` (`div` or `span`). Spacing around it stays with the caller. All 11
  places use it. Seven were 0 px; three change size or spacing as decided under
  "Component inventory": the decision log's labels, "Image collage" and the
  caption tags. The flow viewer's counter keeps a `counter` class, so the
  short-screen rule in flowStrip.module.css can still hide it; its hard-coded
  colour rule is gone. **Why:** Derek's inventory decision; the names are new.
  "Label" says what it is, and the JSDoc says it isn't a form `<label>` or an
  Eyebrow. Eyebrow's JSDoc now points field labels to Label. **Status:** Done (commit
  "Five promotions").
- **Decision:** Label's grey is `colors.textMuted` (`#8f8674`, 4.96 to 5.28:1), not
  the fainter grey most of the labels used (`textFaint`, `#6f6858`). The tone is
  named `muted` to match (it was briefly `faint`). **Why:** `textFaint` is 3.2 to
  3.4:1 on the site's backgrounds, under WCAG AA's 4.5:1 for small text, and axe
  flagged it. The labels that used it were already under AA, and it would have
  taken the flow counter from 5.28:1 to 3.44:1. Derek: "I'm fine with the gray label
  updates that you suggest. I have a feeling I'll update the design in the future,
  but this is just for getting the components completed." **Result:**
  - Role/Org/Timeline/Scope, the panel label and the decision log's labels are a
    little lighter.
  - The flow counter is its original colour again: 0 px against the live site on
    desktop. On phone the page behind the viewer's 97% background shows through;
    the counter's own styles are identical.
  - axe reports 0 violations.

  **Status:** Done (commit "Five promotions").
- **Decision:** the dashed callout is `src/ui/Callout`, with `label`, `children`
  (the text) and an optional `link` (`{ label, onClick }`, drawn as an italic accent
  link but a button, because it opens something on the page). Its border is a new
  token, `border.callout` (`olive500A45`, the exact colour it had), added the way
  Move 6 added Button's. The TL;DR box and "Feature this" box use it, both 0 px.
  "Show me the images →" lost its JavaScript hover for CSS, and on keyboard focus it
  gets Button's ring, as TextLink's links did. **Why:** Derek: "Dashed callout is
  one component with an option for with or without a link." **Status:** Done, approved by
  Derek (below); commit
  "Five promotions".
- **Decision:** the accent-rule aside is `src/ui/Aside`, only the frame (the 1px
  `border.accentMed` rule and 1.4rem padding), rendered as a `div` so a case study
  doesn't gain a landmark per lesson. The lessons and PLMC's "If I did it again" use
  it, 0 px. **Why:** Derek: "The accent-rule aside is not a callout; it becomes its
  own component." **Status:** Done (commit "Five promotions").
- **Decision:** the grid with 1px lines is `src/ui/CellGrid`, with `min` (the
  narrowest column before it wraps), `line` (`default` or `faint`) and `as` (`div`
  or `dl`). Its styles sit in `:where()`, so the About rail's class can set its own
  two columns and line colour. The meta row, personas, principles, StatBand and the
  About rail's stats use it, all 0 px. **Why:** the inventory marked it "promote
  now". **Status:** Done (commit "Five promotions").
- **Decision:** four hand-built buttons move onto Button's outline compact style, the
  header Contact's look:
  - the Tidy it up toggle, which also gains `aria-pressed`;
  - the image collage's Close;
  - the full-size view's Close;
  - the phone Menu.

  Each changes visibly (olive outline, 0.7rem, rounded, eased hover, Button's
  focus ring). The toggle is 2.2px shorter, so everything below the context panel
  moves up 2.19px. The full-size image sits 2.4px higher. The phone header is
  0.59px shorter. **Why:** gaps.md's three missed buttons and the inventory's
  Close buttons; Prompts K and L planned the same switches. **Status:** Done, approved by
  Derek (below); commit
  "Five promotions".
- **Decision:** the flow viewer's Close isn't promoted. **Why:** it's styled as one
  set with the ← → arrows beside it (plain-case, 0.95rem, 2.4rem tall), and the
  arrows wait on an icon-only Button. Moving the Close alone would put two button
  styles in one bar. **Status:** Waiting, with the arrows, in GAPS.md.
- **Decision:** a story that renders another documented component declares it in
  `subcomponents` (CellGrid and Aside declare Label). **Why:** in Storybook 10.6.7
  the manifest reads only the story's own component's `@import` tag. Other
  components in a snippet came out as `import { Label } from 'portfolio'`.
  Declaring them gives their real import and adds their docs to the page.
  **Status:** Done.
- **Result:**
  - Checked against `8f5fc85` (:5174), one place at a time, with
    `tools/batch-round.sh` and `batch-cmp.sh`: every page in full, the scrolled home
    header, and `overlay-shots.mjs` (collage, full-size view, flow viewer, tidied
    panel, open phone menu) on Sage and Bexa.
  - The control round was 0 px everywhere.
  - Flakes, each re-shot to 0 px: the About rail's squares on home phone, which
    settle one of two ways per load; anti-aliasing on home desktop and two desktop
    overlay shots; Bexa desktop's top.
  - Layout check by content (`tools/landmarks.mjs`): only the toggle and the phone
    Menu changed size on any page; everything else stayed or moved up 2.19px below
    the context panel.
  - Build, 125 tests and lint pass.
  - 8 new stories render without errors, and the Callout link test passes. axe
    shows 0 violations once the grey is `textMuted` (above).
- **Approval:** Derek saw every before and after on the review page (the Label size
  and spacing changes, the lighter grey, the callout link's focus ring, the four
  buttons on Button, and the shifts they cause). Derek: "I like the updates on all
  of before and after options you provided." **Status:** Approved.

---

## Scope and governance (from the chat about the guide)

- **Decision:** everything on the site goes into the design system, with the caveat
  that we may not capture every component on the first pass. **Why:** Derek: "Ideally,
  in a well governed design system, everything on the site is within the design
  system." **Status:** Agreed; became Step 3 (Prompts J to P).
- **Decision:** classify each component by kind: Primitive, Block, Chrome, Experience,
  Page, Behavior, plus Unused for files nothing renders. **Why:** Derek: "an important
  part of each Design is understanding which ones are components and not, and which
  ones are sort of one off." **Status:** Agreed.
- **Decision:** review the inventory visually on a screenshot contact sheet before
  any code changes. **Why:** Derek asked for a visual review step and said "Yes."
  **Status:** Agreed (Prompt J).
- **Decision:** platform rules live at the component level and follow each platform's
  guidance (WCAG 2.2 AA for web; Apple's and Google's guidelines if native ever
  comes). **Why:** Derek: "as long as it's adhering to the best practice guidance."
  **Status:** Agreed.
- **Decision:** plan for heavy token use in the Figma steps. **Why:** Derek: "You're
  gonna want to make sure you have lots of tokens for the step." **Status:** Noted.

## Keeping everything in one place

- **Decision:** the repo becomes the one source of truth for the guide and this file,
  in `docs/in-system-design/`, with the revised prompts written into GUIDE.md. Claude
  Code updates both after each move and commits them with that move (a rule in
  CLAUDE.md), and the branch is pushed so every session reads the same thing.
  **Why:** Derek: "I am a little worried that my claw code and what we're talking
  about is starting to branch off." **Status:** Agreed 2026-11-19, when Derek asked
  for the build docs to go into the repo; Done in `87c0522`, and the branch was pushed.
  gaps.md stays outside the repo for now; the guide's GAPS.md (Moves 18 to 19) is
  where it lands. (It landed earlier, on 2026-11-20: see "Component inventory".) The
  old DECISIONS.md in the case-study folder was deleted, so this file is the only
  copy.
- **Decision:** fix the guide where it drifted from what was run: Move 5 stages files
  by name, the "Done when" lines for Moves 6 and 7 point to the approved differences,
  the intro's counts are corrected (223 style blocks; the patterns weren't used),
  Move 8 shows the install command that actually ran, and Prompt D names
  `preview.tsx`, which is what Storybook 10.6 creates. **Why:** CLAUDE.md's rule
  (update the guide with each move). **Status:** Done with the Move 8 commit.
