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
  after Storybook." **Status:** Agreed; logged in gaps.md, and in Prompts K and L.

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
  (`colors.textFaint`, `#6f6858`, used by 3), at one size and letter spacing chosen the
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
  **Open:** the collage caption tags show the same `caption.tag` data as
  PlaceholderFigure's figure tags (FIG. A, 01), which the counters decision below leaves
  alone, but also words (APP, PHOTO, BRAND). They're counted here because they're one of
  the 11. Derek to confirm.
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
  Done. Moving gaps.md's entries into GAPS.md is still open.

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
  where it lands. The old DECISIONS.md in the case-study folder was deleted, so this
  file is the only copy.
- **Decision:** fix the guide where it drifted from what was run: Move 5 stages files
  by name, the "Done when" lines for Moves 6 and 7 point to the approved differences,
  the intro's counts are corrected (223 style blocks; the patterns weren't used),
  Move 8 shows the install command that actually ran, and Prompt D names
  `preview.tsx`, which is what Storybook 10.6 creates. **Why:** CLAUDE.md's rule
  (update the guide with each move). **Status:** Done with the Move 8 commit.
