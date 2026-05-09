# Prompts

Reusable prompt templates for coding workflows in `not-not-dev`.

These templates are designed to work well with `pi-subagents`, Context7, Playwright/browser validation when available, and the repo's project-local agents.

## Included

### `pi-customization-plan`

Clarify and plan a Pi customization change before implementation.

Good for:
- extension changes
- new skills or prompts
- package wiring changes
- doc/install flow changes

Command:

```text
/pi-customization-plan <request>
```

### `pi-customization-ship`

Run a fuller implementation workflow for repo-local Pi customization work.

Good for:
- approved implementation work
- changes that should also update docs/bootstrap/package wiring
- changes that should be reviewed before wrapping up

Command:

```text
/pi-customization-ship <request>
```

### `frontend-uiux-plan`

Clarify and plan framework-agnostic frontend UI/UX work before implementation.

Good for:
- component or page work that needs explicit state coverage
- design-system reuse planning
- accessibility and responsive planning
- frontend tasks where Context7-backed framework/library docs may matter

Command:

```text
/frontend-uiux-plan <request>
```

### `frontend-uiux-ship`

Run a fuller frontend UI/UX workflow with planning, implementation, review, and honest validation reporting.

Good for:
- approved frontend implementation work
- UI/UX tasks that should follow spec -> plan -> build -> review
- changes that should prefer Playwright/browser validation when available
- framework-agnostic frontend work across different stacks

Command:

```text
/frontend-uiux-ship <request>
```

## Notes

- these prompts are workflow entrypoints, not implementation by themselves
- after changing prompts, reload Pi with `/reload`
- if the prompts are installed globally, they appear as slash commands in Pi
