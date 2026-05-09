---
name: coding-workflow
description: Runs a disciplined coding workflow for non-trivial changes. Use when a task needs clarification, research, planning, implementation, review, or validation, or when subagents would help.
---

# Coding Workflow

Use this skill to keep coding work grounded, incremental, and verifiable.

It is intentionally opinionated:
- clarify before broad implementation
- research before guessing
- one writer at a time
- validate what you actually changed
- document user-visible behavior changes

## When to Use

Use when:
- the request is bigger than a tiny one-file edit
- API behavior or library usage is uncertain
- you need a repeatable parent-agent workflow
- you want to use subagents without losing control of the main task

Do not use this skill for:
- trivial one-line fixes that need no planning or research
- purely mechanical formatting changes with no behavioral impact

## Workflow

### 1. Orient first

Before proposing or changing anything:
- read the relevant repo README/docs
- inspect the owning files, not just adjacent files
- identify the smallest surface that should change
- decide whether the task is:
  - direct implementation
  - research + recommendation
  - review only
  - staged follow-up work

For library/framework questions:
1. use Context7 first when available
2. then use local repo docs/source
3. then use local Pi docs/examples for Pi-specific behavior
4. then use web research only as needed

## 2. Choose the right execution shape

Pick the smallest workflow that fits:

### Small work
Use a direct parent-agent flow:
- inspect files
- make the narrow change
- validate narrowly
- summarize honestly

### Medium work
Use a light plan:
- clarify assumptions
- identify files to touch
- define success criteria
- implement in one writer thread
- review and validate

### Larger or higher-risk work
Use `pi-subagents` deliberately:
- use `scout` or `context-builder` for recon
- use `researcher` when external docs or recent ecosystem behavior matter
- use `planner` when a plan should be made explicit
- use one `worker` for implementation
- use fresh-context `reviewer` agents after implementation

Keep orchestration in the parent. Do not let child agents turn into open-ended orchestrators.

## 3. Use the right helper package or extension

Call out and use the installed tooling when it genuinely helps:

- **Context7**: first stop for current library/framework docs
- **`librarian` skill**: when you need source-backed answers about open-source libraries and implementation details
- **`pi-subagents`**: for recon, planning, review fanout, and controlled implementation handoffs
- **`context-mode`**: when analyzing large logs, large command output, snapshots, diffs, or test output
- **`guardrails` extension**: preserve it and respect it around risky shell/file actions
- **`context-radar` extension**: pay attention when context pressure is high; compress findings and avoid noisy output
- **`openrouter` footer extension**: useful operational context for model/provider/footer state, but do not depend on it for correctness

## 4. Implement minimally

When implementing:
- change the fewest files that can solve the real problem
- preserve existing command names and user-facing flows unless there is a reason to change them
- avoid broad refactors mixed with new behavior
- keep one writer thread by default
- prefer explicit docs and small helpers over abstraction layers

## 5. Review and validate

After implementation:
- read the changed files back
- run the narrowest useful verification
- confirm file references, commands, and paths are real
- if runtime behavior cannot be tested here, say so plainly

When using subagents for review:
- prefer fresh-context reviewers for adversarial checks
- synthesize findings before making follow-up edits
- separate blockers from optional polish


## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It is probably fine without checking docs." | If the API matters, verify it. Guessing creates rework. |
| "I can just edit a lot of files now and clean it up later." | Broad first edits create drift and make verification harder. |
| "A review pass is unnecessary for a medium-sized change." | Even a lightweight review catches regressions and doc drift. |
| "I do not need to mention limitations if I did not test interactively." | Honest limits are part of a trustworthy result. |

## Red Flags

- changing multiple concerns without saying why
- inventing APIs, commands, or config keys
- letting parallel children write to the same surface
- claiming runtime verification that did not happen
- forgetting docs after changing a user-visible workflow
- ignoring context pressure while producing long noisy summaries

## Verification

Before finishing, confirm:
- [ ] the owning files were read before editing
- [ ] the chosen workflow matched the task size and risk
- [ ] current docs or source were checked for uncertain APIs
- [ ] changes stayed narrow and reversible
- [ ] validation was run at the smallest useful scope
- [ ] limitations were stated honestly
