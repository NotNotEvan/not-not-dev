---
description: Clarify and plan a Pi customization change using repo-aware agents and workflows
argument-hint: "<request>"
---
Use a repo-aware planning workflow for this request:

$@

Requirements for the workflow:
- treat this as Pi customization work in `not-not-dev`
- read the relevant repo docs and owning files first
- use Context7 first if current library/framework docs matter
- use local Pi docs/examples before inventing Pi APIs or prompt/agent formats
- use `pi-subagents` where helpful, but keep orchestration in the parent session

Preferred flow:
1. If scope or constraints are unclear, use the `gather-context-and-clarify` style workflow.
2. Use the project-local `pi-customization-planner` agent to produce a concrete plan.
3. The plan must call out:
   - exact files likely to change
   - docs/install/bootstrap/package impacts
   - whether repo skills/prompts/agents should change too
   - validation and `/reload` expectations
4. Do not implement yet unless the request is explicitly tiny and clearly approved for direct execution.

If the request would be better staged for autonomous execution, say so and recommend using the `stage-taskplane-task` workflow.
