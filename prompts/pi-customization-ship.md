---
description: Plan, implement, review, and document a Pi customization change in this repo
argument-hint: "<request>"
---
Use a disciplined repo-local implementation workflow for this request:

$@

Workflow requirements:
- treat this as Pi package/customization work, not generic app work
- read repo docs and owning files first
- use Context7 for uncertain library/framework docs when available
- use local Pi docs/examples before inventing Pi behavior
- keep one writer at a time
- update docs and bootstrap/package wiring when user-visible behavior changes

Preferred flow:
1. If needed, gather context and clarify first.
2. Use `pi-customization-planner` to create a plan when the work is more than trivial.
3. Use `pi-customization-builder` to implement the approved change.
4. Run a review pass using:
   - the project-local `pi-customization-reviewer` agent
   - and/or fresh-context builtin reviewers for correctness, docs/install flow, and maintainability
5. Apply only the review fixes worth doing now.
6. Summarize:
   - files changed
   - recommended extensions/plugins affected
   - validation performed
   - any remaining limitations
   - whether the user should run `/reload`

When relevant, explicitly consider these installed packages/extensions:
- `pi-subagents` for orchestration
- `context-mode` for large output analysis
- `guardrails` for safety-sensitive operations
- `context-radar` for context pressure awareness
- `openrouter` only when provider-specific footer behavior matters
