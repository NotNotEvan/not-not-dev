# Skills

Reusable coding skills for `not-not-dev`.

These follow the Agent Skills-style `SKILL.md` structure so they stay readable, discoverable, and easy to extend.

## Included

### `coding-workflow`

A general coding workflow skill for non-trivial work.

Use when you want a repeatable flow for:
- clarifying scope
- researching APIs and libraries
- planning implementation
- using subagents deliberately
- validating changes honestly
- choosing the right execution shape for larger work

Source:
- [`coding-workflow/SKILL.md`](./coding-workflow/SKILL.md)

### `pi-extension-workflow`

A repo-specific workflow skill for building or updating Pi extensions, skills, prompts, and package wiring in this repository.

Use when the task affects:
- `extensions/`
- `skills/`
- `prompts/`
- `package.json`
- install/bootstrap docs or scripts
- project-local agents under `.pi/agents/`

Source:
- [`pi-extension-workflow/SKILL.md`](./pi-extension-workflow/SKILL.md)

### `frontend-uiux-workflow`

A framework-agnostic frontend workflow skill for UI/UX implementation and review work.

Use when the task needs:
- spec -> plan -> build -> review structure
- design-system reuse before inventing new primitives
- explicit state, responsive, and accessibility coverage
- Context7-first framework/library documentation lookup
- browser-first validation expectations, including Playwright when available

Source:
- [`frontend-uiux-workflow/SKILL.md`](./frontend-uiux-workflow/SKILL.md)

## Notes

- reload Pi with `/reload` after changing extensions, skills, prompts, or project agents
- use Context7 first when official library/framework docs are needed
- use local Pi docs/examples before inventing Pi APIs
