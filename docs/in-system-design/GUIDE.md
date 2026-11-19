# In-System Design for derekjmoore.com

Nov 19, 2026 · @Derek

You can run Christine Vallaure's flow on your portfolio, but step 1 is real work: your site has tokens, but its UI is page components with inline styles, not a component library yet.

## The whole process at a glance

Her rule is "code always wins, and Figma is a mirror, not a second truth." Every step serves that, and the agent only ever builds from real components.

1. **Component layer:** two-layer tokens, a few real components and Storybook with its agent add-on. This is step 1, detailed below.
2. **AI-ready context:** a `CLAUDE.md` rules file, a `GAPS.md` log, and a description plus allowed prop values on every component's stories.
3. **Figma built from code:** starting from an empty file, Claude Code builds Figma variables and components from your code, then a script compares Storybook's manifest with Figma's.
4. **Prototype space:** stories in `src/prototypes/`, each on its own `proto/<name>` branch.
5. **Preview and feedback:** Cloudflare gives each branch a Storybook link, posted on a draft pull request where comments collect.
6. **Graduate:** accepted ideas are rebuilt on `feature/<name>`, checked by CI, merged, and deployed by Cloudflare as today.

## Where your site stands

You already have about half of the foundation: a token file, tests and a Cloudflare deploy. What's missing is the component layer that Storybook and Figma would mirror.

| Her flow needs | portfolio-2026 today | Gap |
| --- | --- | --- |
| A coded component library | Page-level components (Hero, WorkList, CaseStudyHeader) and 223 inline style blocks | Pull out primitives first |
| Tokens in two layers, raw values and semantic roles | `src/theme/tokens.ts`, one flat layer of hex values plus a `paper` palette | Split into primitive and semantic, add CSS variables |
| Repeated patterns named once | `src/theme/patterns.ts` has `solidCta`, `chip` and `eyebrow`, but nothing the site renders uses them (an earlier "used 44 times" was a word count) | The live buttons, chips and labels they describe become your first three components (see the revised Prompts A to C) |
| Storybook 10+ with the components manifest | None | Install it |
| An agent rules file | `PRODUCT.md` (Impeccable) and `README.md`, no `CLAUDE.md` | Add one |
| CI that runs checks before merge | Vitest and oxlint scripts exist, but no CI workflow runs them | Add a GitHub Actions workflow |
| A preview link per branch | `wrangler.jsonc` has `"preview_urls": false` | Turn previews on |

One correction to what I said earlier: the repo I can see is on **GitHub** (`DeadDuck83/portfolio-2026`), not GitLab, and its README says Cloudflare builds from GitHub. So this guide uses GitHub pull requests. Your local copy matches it exactly. If you also keep a GitLab copy, the flow is the same there with merge requests.

## Her flow on your stack

&#91;embedded content: prototype to live site · 6 steps, 1 decision\]

Your current deploy of `main` stays exactly as it is. Everything new happens on branches first, and a prototype branch is closed, never merged, once its idea is rebuilt.

## Her three open problems on your setup

GitHub plus Cloudflare solves two of her three problems almost for free, and a single-repo layout removes the third.

| Her problem | Fix on your stack | Solved? |
| --- | --- | --- |
| The design branch goes stale as the product moves on | Keep prototypes in a `src/prototypes/` folder on `main`, shown in Storybook but never imported by the site. Each prototype is a short-lived branch off the latest `main`, so it always uses current components. | Yes |
| Prototypes on her laptop are hard for others to click through | Cloudflare builds every non-main branch and gives it its own preview URL, which it posts on the pull request. You send that link. | Yes |
| Feedback has no real home | Open each prototype as a **draft pull request** that is never merged. The code, the preview link and comments live in one place. | Mostly. Reviewers need a GitHub account, so non-developer feedback still lands in email or Slack. |

The preview URLs are public by default. If a prototype shows client work like Bexa, put the preview behind Cloudflare Access.

## Recommended variant

Use one repo, with prototypes as Storybook stories in a folder the site never ships, and a draft pull request per prototype. It combines three of her alternatives and drops the standing design branch.

- **Prototypes folder:** `src/prototypes/<name>/` holds stories that compose real components. The site's Vite build never imports them, so they can't leak into derekjmoore.com.
- **Gallery:** a second Cloudflare Worker, say `portfolio-storybook`, builds Storybook from the same repo. Its sidebar is your prototype gallery, like Zapier's, and every branch gets its own preview URL.
- **Discussion:** each prototype is a `proto/<name>` branch with a draft pull request that never merges.
- **Graduation:** an accepted idea is rebuilt on a `feature/<name>` branch, with real props, tests and responsive states. It merges when CI is green, and Cloudflare deploys `main` as it does now.

I'd skip her fastest option, letting a prototype merge straight through, except for tiny tweaks. Prototype code is written to look right, and the rebuild is where tests, accessibility and mobile get done.

Figma comes right after step 1. Claude Code builds your first Figma library from the code, so you never draw these components by hand. Sign-off still happens in Storybook, and Figma is where you sketch with real components.

## Before you start: where each tool runs

&#91;embedded content: where each tool runs · 2 terminals, a browser, Figma\]

You'll keep two terminal windows open. Terminal 1 runs Storybook and stays running. Terminal 2 runs Claude Code, and that's where you paste every prompt below. You only open the browser and Figma to check results.

## Step 1A: branch, baseline and your first components

By the end of 1A you have a safe branch, screenshots of the site as it is today, and three real components the site already uses. Each move below ends in a commit, so you can always step back one.

Every move has the same five parts: **Where**, **Type**, **You'll see**, **Done when** and **If not**.

### 1. Open the repo

**Where:** Terminal window 1.

**Type:** swap in the folder where your copy lives.

```bash
cd ~/path/to/portfolio-2026
git status
```

**You'll see:** `On branch main` and `nothing to commit, working tree clean`.

**Done when:** you're on `main` and nothing is uncommitted.

**If not:** if it lists changed files, commit them or run `git stash` to set them aside.

### 2. Make a branch before anything changes

**Where:** Terminal 1.

**Type:**

```bash
git pull
git checkout -b feature/design-system-foundation
```

**You'll see:** `Switched to a new branch 'feature/design-system-foundation'`.

**Done when:** `git branch` shows a `*` next to `feature/design-system-foundation`.

**If not:** if it says the branch already exists, run `git checkout feature/design-system-foundation` instead.

### 3. Take a baseline of the site

**Where:** Terminal 1, then your browser.

**Type:**

```bash
npm install
npm run dev
```

**You'll see:** a line like `Local: http://localhost:5173/`. Open that address in your browser.

Screenshot the home page and `/work/plmc` twice: once at full width, and once at phone width using your browser's device toolbar in its developer tools. Save the four images somewhere outside the repo. Press `Ctrl+C` in the terminal to stop the site.

**Done when:** you have four screenshots saved.

**If not:** if `npm run dev` errors, you'll paste the error into Claude Code in the next move and ask it to explain.

### 4. Start Claude Code in the repo

**Where:** Terminal window 2, in the same folder.

**Type:**

```bash
cd ~/path/to/portfolio-2026
claude
```

**You'll see:** Claude Code's prompt box, with your folder name above it.

**Done when:** you ask `What branch am I on?` and it answers `feature/design-system-foundation`.

**If not:** you're in the wrong folder. Type `/exit`, `cd` to the right one, and run `claude` again.

Tip: inside Claude Code you can run a terminal command by starting the line with `!`, like `!git status`.

### 5. Prompt A: split your tokens into two layers

**Where:** Claude Code.

**Paste:**

```text
Read README.md, PRODUCT.md and src/theme/tokens.ts. Don't change how the site looks.

Restructure tokens.ts into two layers: a primitive object with raw values
(for example olive500: '#848945') and a semantic object that points at
primitives (for example accent: primitive.olive500). The translucent rgba
colours are primitives too; name them consistently.

Keep every existing export (colors, paper, border, fonts, weights, radius,
layout) working with the same values, so no other file has to change.
Keep the paper palette as plain hex values, because aboutJourneyEngine.ts
reads them in JavaScript.

Generate src/theme/tokens.css from it with matching CSS variables, like
--olive-500 and --color-accent: var(--olive-500), and add an npm script
called tokens that regenerates the file. This machine is on Node 20, which
can't run TypeScript directly, so pick the lightest way to run the
generator and tell me what you chose.

Import tokens.css once in src/main.tsx so the site can use the variables,
and add a test that fails when tokens.css is out of date with tokens.ts.

Run npm run build and npm test, then tell me what changed.
```

Revised on Nov 19 after checking the guide against the code; the original and the reasons for each change are in `prompts-revised.md` (case-study folder) and `DECISIONS.md`.

**You'll see:** a summary of the files it changed, including a new `src/theme/tokens.css`, and a passing build and tests.

**Done when:** you run `npm run dev`, the site looks exactly like your baseline, and you commit:

```bash
git add src/theme/tokens.ts src/theme/tokens.css src/theme/tokensCss.ts src/theme/tokens.test.ts scripts/tokens.mjs src/main.tsx package.json README.md
git commit -m "Tokens: primitive and semantic layers with CSS variables"
```

Stage files by name, never `git add -A`, so the untracked Rive file in `public/background/` stays out.

**If not:** tell Claude Code what looks different. To throw the whole change away, ask it to undo, or run `git restore .`.

### 6. Prompt B: make a Button component

**Where:** Claude Code.

**Paste:**

```text
The site draws the same buttons three separate ways:
- CSS classes .hx__btn and .hx__btn--solid in src/styles/hero.css (Hero)
- a copy of them, .about-rail__btn in src/styles/about-rail.css
  ("View my skills")
- inline styles plus solidCtaHover / outlinedCtaHover from src/lib/hover.ts
  (ContactSection, and the Contact buttons in SiteHeader and CaseStudyHeader)
The solidCta pattern in src/theme/patterns.ts isn't used anywhere any more.

Create src/ui/Button.tsx to replace all of them:
- Props: variant 'solid' | 'outline' and size 'default' | 'compact'
  (compact is the smaller accent-outlined Contact button in both headers),
  plus the normal props of the element it renders.
- It renders an <a> when given href, otherwise a <button>. EmailLink and
  React Router's Link render their own element, so also export the styling
  as a class-name helper they can use.
- Style it in a CSS file with real :hover, :active and :focus-visible
  states, using the variables in src/theme/tokens.css. No new hex or rgba
  values: if a value the buttons use isn't a token yet, add it to
  tokens.ts and regenerate tokens.css.
- Keep the hero's transition and press effect, and keep the rule that
  turns the press effect off when data-motion="off".

Where the copies disagree (borders, gaps, padding, letter spacing), match
the hero buttons and list every difference you resolved. Keep the
case-study header's phone spacing (.cs-head__cta in global.css) working.
One known bug: the JS hover resets the header Contact buttons to the body
colour after a hover instead of their accent tint. CSS :hover fixes that;
include it in your list.

Then delete solidCta and any hover helpers nothing uses. Don't touch
WorkList.tsx or AboutJourney.tsx; nothing renders them right now.

Run npm run build, npm test and npm run lint, and list every file you changed.

After switching each place, run the exact pixel diff and show me every page
that changed, with before and after shots, so I can approve each difference.
```

Revised on Nov 19: the original built Button from `solidCta`, which nothing imports, and used the JavaScript hover from `src/lib/hover.ts`. The last paragraph is Derek's approval step.

**You'll see:** a new `src/ui/Button.tsx` and a list of the files that now use it.

**Done when:** the buttons look and hover as before, apart from the differences you approved one by one (listed in `DECISIONS.md`), and you commit with the message `Button component`.

**If not:** describe the difference to Claude Code, for example "the hero button lost its arrow gap."

### 7. Prompt C: make Chip and Eyebrow

**Where:** Claude Code.

**Paste:**

```text
Do the same for two more patterns, but work from the live copies, not
src/theme/patterns.ts: its chip is only used by WorkList.tsx and
AboutJourney.tsx, which nothing renders, and nothing uses its eyebrow.

- Chip, from the skill tags in AboutRail (.about-rail__tags li in
  src/styles/about-rail.css). Make it src/ui/Chip.tsx.
- Eyebrow, from the small uppercase section labels: the chapter label in
  src/components/casestudy/ChapterHeading.tsx and the "Case study 04" line
  in src/pages/CaseStudy.tsx. Make it src/ui/Eyebrow.tsx.

Keep props small, use the tokens.css variables only, and replace every live
place that draws one of these by hand. Where the copies differ
(ChapterHeading uses 0.68rem, CaseStudy.tsx 0.7rem), pick one and tell me.
Other small uppercase text (nav links, the Role / Org / Timeline labels) is
a different role. Leave it, and list where it lives.

Don't touch WorkList.tsx or AboutJourney.tsx, and leave patterns.ts in
place for them. Don't change how anything looks. Run npm run build,
npm test and npm run lint, and list every file you changed.
```

Revised on Nov 19: the original worked from `patterns.ts`, whose chip and eyebrow nothing on the site renders. Run with the same per-place approval step as Prompt B.

**You'll see:** `src/ui/` now holds `Button.tsx`, `Chip.tsx` and `Eyebrow.tsx`.

**Done when:** the site matches your baseline screenshots, apart from the Eyebrow size change you approved (see `DECISIONS.md`), and you commit with the message `Chip and Eyebrow components`.

**If not:** same as before. Describe the difference, or undo with `git restore .`.

## Step 1B: Storybook, connected to Claude Code

By the end of 1B your three components show in Storybook in your browser, Claude Code can read them, and a rules file keeps it from inventing new ones.

### 8. Install Storybook

**Where:** Terminal 1, or Claude Code (it runs the same commands).

**Type:**

```bash
STORYBOOK_DISABLE_TELEMETRY=true npm create storybook@latest -- --features docs a11y --type react --builder vite --no-dev --no-agent --yes --disable-telemetry
STORYBOOK_DISABLE_TELEMETRY=true npx storybook add @storybook/addon-mcp --yes --disable-telemetry
```

Then turn telemetry off for the project: in `.storybook/main.ts`, add `"core": { "disableTelemetry": true }`.

Revised on Nov 19. The original said to take the installer's defaults, which include a `test` feature: Storybook's Vitest addon and Chromatic's addon, a Vitest config that runs every story in a real browser, and a Chromium download. Nothing later in this guide needs it, and `npm test` is the check for every move. The installer also answers its own prompts when it detects an AI agent (it checks `CLAUDECODE`), so the flags make the install the same whoever runs it. Both addons print "Could not resolve the postinstall hook"; that's harmless, because neither ships one.

**You'll see:** "Storybook was successfully installed in your project!", and Storybook's sample stories in `src/stories/`.

**Done when:** `npm run storybook` opens `http://localhost:6006` with the sample stories in the left sidebar, and `npm run build` still passes. If the build fails on an unused `import React` in `src/stories/Button.tsx` or `Header.tsx`, delete that line: the project's strict TypeScript rejects it, and Move 9 deletes the samples anyway. Commit with the message `Install Storybook`, staging `.gitignore`, `package.json`, `package-lock.json`, `.storybook/` and `src/stories/` by name.

**If not:** copy the error and paste it into Claude Code with "Storybook install failed, what do I do?"

### 9. Prompt D: make Storybook look like your site

**Where:** Claude Code.

**Paste:**

```text
Storybook is installed. Set it up for this site:
1. In .storybook/main.ts, turn on features: { componentsManifest: true }, make sure
   @storybook/addon-mcp is in addons, and set typescript: { reactDocgen:
   'react-docgen-typescript' } so props imported from another file (Button's variant
   and size) reach the manifest.
2. In .storybook/preview.tsx, import src/theme/tokens.css and then
   src/styles/global.css, as src/main.tsx does. Put the same font preconnect links
   as index.html in .storybook/preview-head.html. Make the site's page background
   (colors.bg in tokens.ts, #1a1712) the default background.
3. Delete the sample stories Storybook created.
4. Write stories in src/ui/ for Button, Chip and Eyebrow under a UI folder in the
   sidebar: one story per variant, with real copy from src/data. Put the short
   description of when to use each component in the component's own JSDoc, with an
   @import tag, because that's what the MCP server reads. Write allowed prop values
   out as unions so they show. Keep any interaction test in its own story, so the
   other stories open at rest.
Then check each story against the same element on the live site.
```

Revised on Nov 19 after running it. The original asked for steps 1 to 4 without the details, and running it showed why each is needed:
- **Fonts:** the fonts load through an `@import` in `global.css`. `index.html` only adds two preconnect links, which `preview-head.html` copies.
- **Background:** Storybook 10 sets a default background with `parameters.backgrounds.options` and `initialGlobals.backgrounds.value`. The colour comes from `tokens.ts`, so there's no hard-coded hex.
- **Descriptions:** the MCP server's `docs-list` and `docs-show` read each component's JSDoc, not the story file. Without an `@import` tag, the manifest invents `import { Button } from 'portfolio'`, a package that doesn't exist.
- **Props:** the default docgen (`react-docgen`) only reads types declared in the component's own file, so Button showed no props at all. A type alias shows as its name (`ButtonVariant`), not its values.
- **Interaction tests:** a play function that clicks leaves the button focused, so that story would open with its focus ring showing.

Then start Storybook in Terminal 1:

```bash
npm run storybook
```

**You'll see:** a sidebar with a **UI** folder holding Button (Solid, Outline, Compact and Keyboard Focus), Chip (Default and Skill List) and Eyebrow (Chapter Label and Case Study Line). Each one shows on your dark background in Big Shoulders or Host Grotesk. The **Controls** panel under a story lists its props, and the **Accessibility** panel reports no violations.

**Done when:** each story looks like the same element on your live site (checked by comparing computed styles at rest, on hover and on keyboard focus), and `docs-show` from the Storybook MCP gives each component's description, props with their allowed values, and a working import. Commit with the message `Storybook stories for UI components`.

**If not:** if fonts or colours look wrong, tell Claude Code what you see. A white background usually means the preview didn't load your CSS.

### 10. Connect Storybook to Claude Code

Leave Storybook running in Terminal 1 from now on. Her tip: always start Storybook before Claude Code, because the connection drops otherwise.

**Where:** Terminal 2. Type `/exit` to leave Claude Code first.

**Type:**

```bash
claude mcp add --transport http portfolio-sb http://localhost:6006/mcp --scope project
claude
```

Then, inside Claude Code, type `/mcp`.

**You'll see:** `portfolio-sb` listed as connected, next to your Figma connection. If you open `http://localhost:6006/mcp` in your browser, it shows a page listing Storybook's tools.

**Done when:** you ask `Use the Storybook MCP to list my components` and it names Button, Chip and Eyebrow. Commit the new `.mcp.json` file with the message `Connect Storybook MCP`.

**If not:** if it shows failed, check that Terminal 1 still shows Storybook running, then restart Claude Code.

### 11. Prompt E: write the rules file

**Where:** Claude Code.

**Paste:**

```text
Create CLAUDE.md at the repo root with short rules for any agent working here:
- Build UI only from components in src/ui/ and tokens from src/theme/. Never invent a prop or a hex value.
- Before building UI, call the Storybook MCP tools docs-list, then docs-show, then get-storybook-story-instructions.
- If something has to be built by hand, add it to GAPS.md with the component that should replace it.
- Read PRODUCT.md for who the site is for.
```

**You'll see:** a new `CLAUDE.md` of about ten lines.

**Done when:** you type `/exit`, start `claude` again, ask `Which component should I use for a section label?`, and it answers Eyebrow. Commit with the message `Agent rules`.

**If not:** if it suggests building a new element, ask it to re-read `CLAUDE.md`, and tighten the wording with it.

### 12. Check that nothing moved

**Where:** Terminal 2, inside Claude Code.

**Type:**

```bash
!npm run build && npm test && npm run lint
```

**You'll see:** the build finish, and all tests and lint pass.

**Done when:** `npm run dev` shows a site that matches your four baseline screenshots. Step 1 is finished, with about six commits on your branch.

**If not:** ask Claude Code to compare the failing page with what changed on the branch.

Nothing has left your laptop yet. When you want a backup, `git push -u origin feature/design-system-foundation` sends the branch to GitHub. Per your README, Cloudflare only deploys `main`, so pushing a branch doesn't change derekjmoore.com.

## Step 2: Claude Code builds your Figma library

By the end of step 2 an empty Figma file holds your tokens as variables, your text styles, and Button, Chip and Eyebrow as components that match Storybook. You do nothing in Figma except make the empty file and check the results.

Before each session: start Storybook in Terminal 1 first, then `claude` in Terminal 2.

### 13. Make an empty Figma file

**Where:** Figma, in your browser or the desktop app.

**Do:** create a new Design file and name it `Portfolio design system`. Click **Share**, then **Copy link**.

**You'll see:** a link that starts `https://www.figma.com/design/`.

**Done when:** you have that link copied. Keep it handy, because every prompt below needs it.

**If not:** if you only see FigJam or Slides options, pick **Design file**.

### 14. Check the Figma connection

**Where:** Claude Code.

**Type:** `/mcp`, then paste:

```text
Using the Figma MCP, what is the name of this file? <paste your Figma link>
```

**You'll see:** `figma` listed as connected, then an answer of "Portfolio design system".

**Done when:** it names the file correctly.

**If not:** reconnect Figma from the `/mcp` menu, and sign in again if it asks.

### 15. Prompt F: variables from your tokens

**Where:** Claude Code.

**Paste:**

```text
Use the figma-generate-library skill. In this Figma file: <paste your Figma link>
Create variables from src/theme/tokens.css:
1. A "Primitives" collection with every raw colour, radius and spacing value.
2. A "Semantic" collection where each variable is an alias of a Primitive, not a copied hex.
3. Set each variable's code syntax (Web) to its CSS variable name, like var(--color-accent).
Don't create components yet. When done, list what you made and anything you couldn't alias.
```

**You'll see:** Claude Code report two collections and a count of variables.

**Done when:** in Figma, the right panel's **Local variables** (or Variables) shows Primitives and Semantic, and Semantic values appear as pill-shaped references to Primitives rather than hex codes.

**If not:** if Semantic shows plain hex codes, ask Claude Code to redo the aliases. If it still can't, see the troubleshooting note below.

### 16. Prompt G: text styles

**Where:** Claude Code.

**Paste:**

```text
In the same Figma file, create text styles from the fonts, weights and sizes in src/theme/tokens.ts and src/styles/global.css. Name them by role (Display, Heading, Body, Label, Eyebrow). Tell me if a font isn't available in Figma.
```

**You'll see:** a list of text styles, and possibly a note that a font is missing.

**Done when:** Figma's **Text styles** list shows them in Big Shoulders and Host Grotesk.

**If not:** if a font is missing, install Big Shoulders and Host Grotesk from Google Fonts on your computer, restart Figma, and run the prompt again.

### 17. Prompt H: the Button component

**Where:** Claude Code.

**Paste:**

```text
Use the Storybook MCP to read Button (docs-show). Then in the same Figma file, create a Button component set that matches it exactly:
- the same props as variants or properties (variant: solid / outline, plus label text)
- fills, strokes, radius and text bound to the variables and text styles you made, never raw hex
- the component description from Storybook, plus a link to its story
Then take a screenshot of the Figma component and compare it with the Storybook story. Log any difference you couldn't fix in GAPS.md.
```

**You'll see:** Claude Code report the component, the comparison, and any gaps.

**Done when:** you select the Button in Figma and its properties panel offers the same choices as Storybook's **Controls** for Button. Hovering a fill shows a variable name, not a hex code.

**If not:** describe what looks different and ask Claude Code to fix the component in place. Her rule: rename and repair, never delete and recreate, so links to it don't break.

### 18. Prompt I: Chip and Eyebrow

**Where:** Claude Code.

**Paste:**

```text
Do the same for Chip and Eyebrow: read each with the Storybook MCP, build a matching component in the same Figma file bound to variables and text styles, compare screenshots, and log gaps in GAPS.md.
```

**Done when:** the Figma file has three components, each matching its Storybook story.

**If not:** same as step 17.

### 19. Commit

**Where:** Terminal 2, inside Claude Code.

**Type:**

```bash
!git add GAPS.md && git commit -m "Figma library: gaps log"
```

**Done when:** `git status` shows nothing left to commit. Step 2 is finished. Your Figma file is a mirror of the code, and when they differ, the code wins.

### If the Figma steps go wrong

- **The Figma connection shows failed:** run `/mcp` and reconnect.
- **Storybook tools are missing:** Storybook must be running in Terminal 1 before you start `claude`. Restart Claude Code after starting it.
- **Variables won't alias or code syntax won't set:** the official Figma connection may not support that yet. Christine uses Southleft's Figma Console MCP for this part, which you could add as a second connection.

Things I haven't tested on your setup: how well the official connection handles aliased variables, whether your fonts load in Figma, and the About section's dark-to-paper colour blend, which Figma can't show as one variable. Publishing the file as a team library needs a paid Figma plan, but you don't need to publish it for these steps.

## Step 3: bring the rest of the site into the system

By the end of step 3 every component on the site is listed, classified and in Storybook, and the ones you design with are in Figma. We might not capture every component on the first pass, but we'll do our best, and anything we miss goes into `GAPS.md`.

Stay on `feature/design-system-foundation`. Start Storybook in Terminal 1 first, then `claude` in Terminal 2, and type `/clear` between moves, because each one reads a lot of files. The companion doc, In-System Design, explained, says why each move matters.

Two habits from Steps 1 and 2 carry on here. Stage each commit by naming its files instead of `git add -A`, so the untracked Rive file in `public/background/` stays out. And wherever a move changes the site, switch one place at a time and approve each changed page from exact pixel diffs, as you did for Button.

### 20. Prompt J: inventory and classify

**Where:** Claude Code.

**Paste:**

```text
Create COMPONENTS.md at the repo root: an inventory of every component in src/components/, src/ui/ and src/pages/, plus every repeated pattern that isn't a component yet.
1. For each, give its file, where it's used, and one kind: Primitive (small, reused, has variants), Block (composed, fed by case study data), Chrome (frames every page), Experience (one-off or animated), Page, Behavior (no visuals), or Unused (in the repo, but nothing renders it, like WorkList.tsx and AboutJourney.tsx). Confirm each Unused one by searching for imports, and say what it was for.
2. Search CaseStudy.tsx and Hero.tsx for repeated style={{ blocks and list each repeat as a candidate component.
3. Add everything logged in GAPS.md (or in portfolio-2026-case-study/gaps.md if it hasn't moved into the repo yet). For the three buttons (the Tidy it up toggle, the collage open and Close buttons, the phone Menu button), say which Button variant and size each should use, or what new one it needs. For the ContextPanel scatter tags, say whether a Chip size or tone fits. For the "Next case study" label in NextCaseFooter and the .eyebrow in flowStrip, say whether each is an Eyebrow or a separate role.
4. Give each row a Storybook folder: UI, Case study, Site, Experiences or Pages. Behaviors and Unused get none.
5. Build a contact sheet so I can review this visually: run npm run dev, take a cropped screenshot of each component as it appears on the live site (desktop width, plus phone width where it changes), and lay them out in one HTML page grouped by proposed kind. Label each card with the component name, file, proposed kind and where it's used. Behaviors and Unused get a text-only card. Save it as portfolio-2026-case-study/step-20/contact-sheet.html, outside the repo, and open it in my browser.
Don't change any code yet. Show me the table and the contact sheet when you're done.
```

**You'll see:** a new `COMPONENTS.md` with a table of about 40 rows, and a contact sheet open in your browser with a screenshot of each component, grouped by kind.

**Done when:** you've gone through the contact sheet and agree with each kind. Look for two things: items that look alike but sit in different kinds (one component, not two), and items that look different but share a kind (maybe variants). Tell Claude Code which kinds to change, since that's your design call. For each Unused row, decide keep or delete; a delete goes on its own branch later. Then commit `COMPONENTS.md` with the message `Component inventory`. The contact sheet stays outside the repo for your case study.

**If not:** if it misses something you can see on the site, point to it and ask for a row.

### 21. Prompt K: the case study kit

**Where:** Claude Code.

**Paste:**

```text
Write stories in a "Case study" folder for ChapterHeading, StatBand, PersonaCard, DecisionLog, FlowStrip, PlaceholderFigure, ImageCollage, NextCaseFooter and ContextPanel.
- Use real data from src/data/caseStudies/ (PLMC first), never invented copy.
- One story per state that matters: DecisionLog with a row open, NextCaseFooter linked and in its "Brewing." state, StatBand after its count-up, ContextPanel scattered and tidied.
- A short description on each: when to use it and what data it needs.
- Then make the changes we agreed in COMPONENTS.md, adding a story for each new variant or size first so I can see it before anything switches: move the Tidy it up toggle in ContextPanel.tsx onto src/ui/Button with aria-pressed, move the open and Close buttons in ImageCollage.tsx onto Button and drop their JavaScript hover, and move the scatter tags, NextCaseFooter's label and flowStrip's .eyebrow onto Chip or Eyebrow where we agreed they fit.
- Swap any hex value you touch for a token.
- Switch one place at a time. After each, run the exact pixel diff plus the computed-style and layout checks against the state before it, and show me every page that changed, with before and after shots, so I can approve each difference.
- Don't touch anything COMPONENTS.md marks Unused.
Run npm run build, npm test and npm run lint. Check each story's Accessibility tab and log anything it flags in GAPS.md. Stage files by name when we commit.
```

**You'll see:** a Case study folder in Storybook's sidebar with nine components.

**Done when:** each story matches the same block on `/work/plmc`, you've approved every page that changed, and you commit with the message `Case study stories`.

**If not:** describe the difference, or ask Claude Code to compare the story with the live page.

### 22. Prompt L: site chrome and primitives

**Where:** Claude Code.

**Paste:**

```text
Write stories for SiteHeader, CaseStudyHeader, SiteFooter and ContactSection in a "Site" folder, and for Wordmark, EmailLink, MotionToggle, CompanyPopover and SkillIcon in "UI".
- Add a MemoryRouter decorator for anything with links, since the site uses React Router.
- Cover each variant: SiteFooter home and case, SiteHeader above and below 820px using Storybook's viewport settings, Wordmark at two sizes, EmailLink plain and as a button, before and after copying.
- Add a story for the phone Menu button first, then move it in SiteHeader.tsx onto src/ui/Button with the variant and size we agreed in COMPONENTS.md.
- Real copy, a description on each, tokens only.
- After the switch, run the exact pixel diff plus the computed-style and layout checks, and show me every page that changed, with before and after shots, so I can approve each difference.
- Don't touch anything COMPONENTS.md marks Unused.
Run the checks, check each Accessibility tab, and log anything flagged in GAPS.md. Stage files by name when we commit.
```

**You'll see:** a Site folder and a fuller UI folder.

**Done when:** the header collapses to Menu in its narrow story exactly as on your phone, you've approved every page that changed, and you commit with the message `Site and UI stories`.

**If not:** if a story crashes with a router error, ask Claude Code to add the MemoryRouter decorator to that story.

### 23. Prompt M: experiences

**Where:** Claude Code.

**Paste:**

```text
In an "Experiences" folder, add one story each for Hero, AboutRail, the avatar components, SkillsView, HealthspanSimulator, PixelCameo, ChassisReveal and Grain.
- Show each running, or in a still state where it needs Rive files or a live API.
- Start every description with "One-off: not a building block."
- Add a rule to CLAUDE.md: never reuse an Experience in a prototype or a new page.
- Skip anything COMPONENTS.md marks Unused, such as AboutJourney.
Don't change the components themselves.
```

**You'll see:** an Experiences folder in the sidebar.

**Done when:** each story loads without errors, even if it's a still. Commit with the message `Experience stories`.

**If not:** if one can't render outside the site, accept a still screenshot story and log it in GAPS.md.

### 24. Prompt N: pages and behaviors

**Where:** Claude Code.

**Paste:**

```text
1. In a "Pages" folder, add stories for Home and the PLMC case study, built from the components already in Storybook, with the MemoryRouter decorator.
2. In CLAUDE.md, add one line each for ScrollManager, PageTransition and Reveal: what they do and when to use them.
Run the checks.
```

**You'll see:** a Pages folder with two stories, and three new lines in `CLAUDE.md`.

**Done when:** the Home story looks like your baseline screenshot of the home page. Commit with the message `Page stories and behaviors`.

**If not:** if the page story is missing a section, ask Claude Code which component it couldn't render and why.

### 25. Prompt O: mirror the new batches in Figma

**Where:** Claude Code.

**Paste:** one folder per run, Case study first, with `/clear` between runs.

```text
Use the figma-generate-library skill. In the same Figma file: <paste your Figma link>
For every component in the Storybook folder [Case study], read it with the Storybook MCP and build a matching Figma component bound to the variables and text styles, as in Moves 17 and 18.
Compare screenshots and log any difference you couldn't fix in GAPS.md.
```

Repeat with `Site` and then `UI` in the brackets. For Experiences, ask for a screenshot frame on an Experiences page instead of a component. For Pages, ask for frames built from component instances.

**You'll see:** new components in the Figma file, grouped by folder.

**Done when:** each Figma component offers the same properties as its Storybook Controls. Commit `GAPS.md` with the message `Figma library: step 3`.

**If not:** rename and repair in place, never delete and recreate, as in Move 17.

### 26. Prompt P: keep it governed

**Where:** Claude Code.

**Paste:**

```text
Add a Vitest test that lists every .tsx file in src/components/ and src/ui/ with no matching .stories.tsx, and fails if it finds one, unless COMPONENTS.md lists that file as a Behavior or Unused.
Add a rule to CLAUDE.md: every new component ships with a story and a row in COMPONENTS.md.
Run npm test.
```

**You'll see:** a new test file, and all tests passing.

**Done when:** you prove the test works. Make an empty `src/ui/Test.tsx`, run `npm test` and see it fail, then delete the file and see it pass. Commit with the message `Governance check`. Step 3 is finished.

**If not:** if the test fails on a file you think is fine, decide its kind and add it to `COMPONENTS.md`.

## Confidence and what I guessed

- **High:** her flow as she describes it, and your repo's current state. I read all three of her articles and the repo's code.
- **High:** the Storybook add-on, its manifest setting and its tools, from Storybook's 10.6 docs. Storybook labels these AI features as preview, so names may change.
- **Medium:** the Cloudflare preview details. The docs say non-main branches get preview builds and pull request comments, but the preview command recently changed to `wrangler preview`, and I haven't run it on a static-assets Worker.
- **Medium:** the official Figma connection for building the library. You have it working in Claude Code, and it can now write variables and components, but I haven't tested how it handles aliased variables. Christine uses Southleft's Figma Console MCP for that part, which is the fallback in step 2.
- **High:** that the GitHub repo is your portfolio. The package.json and src folders you pasted from your local copy match it exactly.
- **Guess:** the evening-or-two estimate for step 1.

One correction to the outline I gave you before: Code Connect isn't central to her setup. She mentions it only as a link from a Figma component to its code, on larger Figma plans. Her parity check is two JSON manifests, Storybook's and Figma's, compared by a script.

## Sources

- [Building an AI-ready design system library: Code to Figma with MCP](https://christinevallaure.substack.com/p/building-an-ai-ready-design-system), Part 1, Oct 27, 2026
- [AI prototyping inside your design system](https://christinevallaure.substack.com/p/ai-prototyping-inside-your-design), Part 2, Nov 3, 2026
- [In-System Design: from code to Figma and back](https://christinevallaure.substack.com/p/in-system-design-from-code-prototype), Part 3, Nov 10, 2026
- [Storybook: AI and MCP overview](https://storybook.js.org/docs/ai/mcp/overview) and [Storybook AI docs](https://storybook.js.org/docs/ai)
- [Cloudflare Workers preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
- [Cloudflare Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration)
- Your repo, `DeadDuck83/portfolio-2026`, read on Nov 19
