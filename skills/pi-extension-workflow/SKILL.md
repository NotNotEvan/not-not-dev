---
name: pi-extension-workflow
description: Builds or updates Pi extensions, skills, prompt templates, project agents, and package wiring in this repository. Use when changing `extensions/`, `skills/`, `prompts/`, `.pi/agents/`, install scripts, or `package.json`, especially when repo docs and Pi docs need to stay aligned.
---

# Pi Extension Workflow

Use this skill for changes that shape how Pi behaves in this repository.

This repo is not a generic app. It is a Pi customization package and workspace. That means implementation, docs, install flow, and reload guidance all matter together.

## When to Use

Use when:
- adding or fixing a Pi extension
- creating a reusable skill
- creating a prompt template workflow
- adding or refining project-local agents under `.pi/agents/`
- updating `package.json` Pi package wiring
- changing install/bootstrap docs or commands

Do not use this skill for:
- unrelated application feature work outside this repo's Pi customization scope
- generic library coding tasks that do not affect Pi workflows or package structure

## Core Process

### 1. Identify the right surface

Decide where the behavior belongs before writing code.

Use:
- **`extensions/`** for runtime behavior, commands, tool interception, UI widgets, footer/status integrations, or custom tools
- **`skills/`** for reusable procedural knowledge that the agent should load on demand
- **`prompts/`** for repeatable slash-command workflows that expand into structured instructions
- **`.pi/agents/`** for project-specific subagent roles used with `pi-subagents`

If a request touches more than one surface, say why.

### 2. Verify Pi behavior before inventing it

For Pi-specific work:
- read the relevant local Pi docs/examples first
- use Context7 when it helps with library/framework documentation
- follow cross-references from Pi docs rather than relying on memory

Relevant local Pi topics often include:
- `docs/extensions.md`
- `docs/skills.md`
- `docs/prompt-templates.md`
- `docs/packages.md`
- examples under `examples/`

### 3. Reuse repo patterns

Stay aligned with this repo:
- keep extensions small, readable, and removable
- preserve safety-first behavior in `guardrails`
- keep `context-radar` lightweight and glanceable
- keep `openrouter` useful without assuming credentials or network availability
- update README/docs when user-facing behavior changes
- keep installer expectations explicit

### 4. Call out useful installed tools and packages

When relevant, build workflows around the available tooling instead of ignoring it:

- **`pi-subagents`** for structured recon, planning, implementation handoff, and review workflows
- **`librarian`** for source-backed open-source library research
- **`context-mode`** for large outputs, logs, diffs, or test reports
- **Context7** for current library/framework docs
- **repo extensions** such as `guardrails`, `context-radar`, and `openrouter` when the workflow or UX should reference them

Do not force every workflow to use every package. Mention only what actually improves the task.

### 5. Wire packaging and docs together

When adding skills or prompts that should ship with the repo package:
- update `package.json` `files` and `pi` manifest entries as needed
- update the relevant README indexes
- keep the root README's project layout and feature lists honest

When changing install or reload behavior:
- review `scripts/README.md`
- review `README.md`
- mention `/reload` where appropriate

### 6. Validate at the right level

For code changes:
- read changed files back
- run narrow sanity checks when practical
- verify command names and file paths
- verify manifest paths actually exist

For extension behavior:
- do not claim live Pi runtime validation unless it happened
- explicitly note when the user should test with `/reload`

## Recommended Workflow Shapes

### Add a new extension
1. inspect neighboring extensions and Pi docs
2. decide command/UI/state shape
3. implement minimally
4. update install/docs/package wiring if user-facing
5. tell the user to `/reload`

### Add a new skill
1. use Agent Skills-style structure
2. make the description precise about both what and when
3. keep the workflow in `SKILL.md`, with supporting files only when they materially help
4. call out repo-specific packages/extensions only when relevant

### Add a new prompt template
1. make it a reusable workflow entrypoint, not a vague prose blob
2. reference the project agents or skills it should trigger
3. keep it aligned with `pi-subagents` patterns when orchestration is involved

### Add a project agent
1. give it a narrow role
2. make success criteria and stop rules explicit
3. do not create "do everything" agents
4. keep orchestration authority in the parent session

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It is just a small extension tweak; docs can wait." | In this repo, docs are part of the feature surface. |
| "I can invent the prompt/agent format from memory." | Pi-specific structures should be verified from docs/examples first. |
| "One giant agent will be more powerful." | Narrow agents are easier to trust, reuse, and debug. |
| "Prompt templates do not need structure." | Good templates are reusable workflow entrypoints, not generic reminders. |
| "I do not need package wiring yet." | If the feature should ship with the package, wire it now while the change is fresh. |

## Red Flags

- adding a new extension without updating documentation
- creating a skill with a vague description that will not trigger reliably
- writing agents that blur planning, implementation, and review into one role
- changing `package.json` paths without checking the files exist
- forgetting to mention `/reload` after extension/skill/prompt changes

## Verification

Before finishing, confirm:
- [ ] the change was placed in the right surface (`extensions`, `skills`, `prompts`, `.pi/agents`)
- [ ] relevant Pi docs/examples were read before implementation
- [ ] repo conventions from `README.md` / `AGENTS.md` were preserved
- [ ] user-facing docs were updated with the change
- [ ] `package.json` wiring matches real files, if packaging changed
- [ ] the final response names changed files, validation performed, and any `/reload` follow-up
