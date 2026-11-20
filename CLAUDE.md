# CLAUDE.md

Rules for any agent working in this repo.

## Building UI

- Build UI only from components in `src/ui/` and tokens from `src/theme/`. Never invent
  a prop or a hex value.
- Before building UI, call the Storybook MCP tools `docs-list`, then `docs-show`, then
  `get-storybook-story-instructions`.
- If something has to be built by hand, add it to `GAPS.md` at the repo root (create it
  if it's missing) with the component that should replace it.
- Read `PRODUCT.md` for who the site is for.

## Build docs

The design-system build is documented in `docs/in-system-design/`:

- `GUIDE.md`: the moves, with the prompts as they were actually run.
- `DECISIONS.md`: why things are the way they are. Read it before changing anything
  the guide or a prompt says, so a choice made on purpose isn't undone.

After each move, update `GUIDE.md` and `DECISIONS.md` if anything changed (a revised
prompt or step, a new decision, a status that moved), and commit them with that move.
