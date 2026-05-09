---
description: Plan, build, review, and validate framework-agnostic frontend UI/UX work with browser-first checks when available
argument-hint: "<request>"
---
Use a disciplined frontend UI/UX delivery workflow for this request:

$@

Workflow requirements:
- use the `frontend-uiux-workflow` skill
- stay framework-agnostic until the target repo establishes the stack and conventions
- use Context7 first when framework/library/testing docs are needed
- prefer reuse of existing components, tokens, and patterns over new UI primitives
- keep one writer at a time
- treat accessibility, responsive behavior, and relevant UI states as part of the implementation contract
- prefer Playwright/browser-based validation when available, but report limitations honestly when those tools are unavailable

Preferred flow:
1. Clarify and spec the work before implementation.
2. Use `frontend-uiux-planner` to create or confirm the plan when the work is more than trivial.
3. Use `frontend-uiux-builder` to implement the approved scope.
4. Run a review pass with `frontend-uiux-reviewer` and, when helpful, fresh-context reviewers for correctness and maintainability.
5. Apply only the review fixes worth doing now.
6. Summarize:
   - files changed
   - what changed in UX/user terms
   - validation performed
   - what still needs manual/browser verification
   - whether the user should run `/reload` when Pi resources changed

Validation expectations:
- Prefer browser/Playwright checks for key flows and states when those tools are available.
- Run the strongest repo-local tests/checks available.
- Never claim browser, screenshot, accessibility, or visual regression validation that did not actually happen.
- If the session lacks browser tooling, say so plainly and name the recommended follow-up checks.
