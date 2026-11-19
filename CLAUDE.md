# CLAUDE.md

Rules for Claude Code in this repo. Move 11 of the In-System Design guide adds the rest.

## Build docs

The design-system build is documented in `docs/in-system-design/`:

- `GUIDE.md`: the moves, with the prompts as they were actually run.
- `DECISIONS.md`: why things are the way they are. Read it before changing anything
  the guide or a prompt says, so a choice made on purpose isn't undone.

After each move, update `GUIDE.md` and `DECISIONS.md` if anything changed (a revised
prompt or step, a new decision, a status that moved), and commit them with that move.
