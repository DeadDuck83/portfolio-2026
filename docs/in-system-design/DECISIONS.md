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
