# Prompts

Reusable prompt templates for coding workflows in `not-not-dev`.

These templates are designed to work well with `pi-subagents`, Taskplane, Context7, and the repo's project-local agents.

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

### `stage-taskplane-task`

Stage work into a Taskplane task packet instead of implementing it inline.

Good for:
- queued work
- autonomous execution handoffs
- larger multi-step tasks

Command:

```text
/stage-taskplane-task <request>
```

## Notes

- these prompts are workflow entrypoints, not implementation by themselves
- after changing prompts, reload Pi with `/reload`
- if the prompts are installed globally, they appear as slash commands in Pi
