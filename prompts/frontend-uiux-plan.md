---
description: Clarify and plan framework-agnostic frontend UI/UX work with explicit state, accessibility, and validation coverage
argument-hint: "<request>"
---
Use a disciplined frontend UI/UX planning workflow for this request:

$@

Workflow requirements:
- use the `frontend-uiux-workflow` skill
- treat this as framework-agnostic frontend work unless the target repo clearly establishes a stack
- use Context7 first when framework, UI library, CSS system, browser API, or testing docs matter
- reuse existing design-system components, tokens, and patterns before proposing new primitives
- include accessibility, responsive behavior, and state coverage in the plan
- be explicit about validation expectations, especially Playwright/browser validation when available
- be honest about tooling limits if browser tools are unavailable in the current session or target repo

Preferred flow:
1. Clarify user goals, target surface, constraints, non-goals, and open questions.
2. Use the `frontend-uiux-planner` agent to produce a concrete plan.
3. The plan must call out:
   - likely files or surfaces to change
   - required states and edge cases
   - responsive expectations
   - accessibility expectations
   - reuse opportunities from the existing design system/codebase
   - validation expectations and any manual checks still needed
4. Stop after planning unless the request is explicitly tiny and clearly approved for direct implementation.

If the work would be better queued for autonomous execution, say so and recommend a Taskplane staging workflow instead of implementing inline.
