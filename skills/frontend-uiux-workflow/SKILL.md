---
name: frontend-uiux-workflow
description: Runs a disciplined, framework-agnostic frontend UI/UX workflow for design and implementation work. Use when building or refining components, pages, flows, design-system integrations, responsive behavior, accessibility, or browser-validated frontend changes.
---

# Frontend UI/UX Workflow

Use this skill for non-trivial frontend work where quality depends on more than “make the UI look right.”

This workflow is intentionally opinionated:
- spec before broad implementation
- framework-agnostic by default
- design-system reuse before inventing new primitives
- accessibility and responsive behavior are first-class requirements
- browser validation is preferred over confidence
- human judgment still owns UX intent, visual approval, and risky tradeoffs

## When to Use

Use when:
- creating or changing frontend components, pages, or user flows
- improving UI polish, usability, layout, or interaction behavior
- implementing design-system-driven work in any framework
- reviewing frontend changes for accessibility, responsiveness, or UX completeness
- the request needs a spec -> plan -> build -> review loop instead of a one-shot code edit

Do not use this skill for:
- tiny copy tweaks that do not change structure, states, or behavior
- purely backend or infrastructure changes
- framework-specific implementation guesses when the docs have not been checked

## Core Principles

1. **Stay framework-agnostic first**
   - Do not assume React, Vue, Next.js, Tailwind, or any specific stack unless the target repo says so.
   - Derive patterns from the target codebase and current docs.

2. **Reuse before inventing**
   - Look for existing components, tokens, utilities, spacing patterns, and interaction patterns before proposing new UI primitives.
   - Prefer consistency with the existing design system over novelty.

3. **Design for states, not just screenshots**
   - Every meaningful surface should consider the states that actually matter.
   - Common states include: default, hover, focus-visible, active, disabled, selected, loading, empty, error, success, validation, overflow/long-content, and responsive variants.

4. **Accessibility is part of the definition of done**
   - Use semantic structure first.
   - Treat keyboard access, visible focus, labels, error messaging, announcements, contrast, zoom/reflow, and reduced-motion concerns as implementation requirements, not optional follow-up.

5. **Validation must be honest**
   - Prefer real browser validation when tools are available.
   - Never claim Playwright, browser, screenshot, or accessibility validation happened unless it actually happened.

## Research Order

When frontend APIs, frameworks, UI libraries, or browser/testing tools matter, use this order:
1. **Context7 first** for current framework/library docs, if available in the session
2. target repo docs and source
3. local Pi docs/examples when Pi behavior itself matters
4. focused web research only when needed

Do not invent framework APIs, CSS utilities, component props, or testing commands.

## Workflow

### 1. Spec

Before implementation, define the real shape of the change.

Capture:
- user goal or task being supported
- target surface: component, page, flow, or interaction
- constraints and non-goals
- existing components/tokens/patterns to reuse
- required states and edge cases
- responsive expectations and important breakpoints
- accessibility acceptance criteria
- validation plan
- open questions that block safe implementation

If the request is ambiguous, clarify before building.

### 2. Plan

Turn the spec into a concrete implementation plan.

The plan should identify:
- exact files or surfaces likely to change
- which states must be represented and tested
- which design-system primitives should be reused
- any framework/library docs that must be checked with Context7
- validation expectations:
  - browser/Playwright checks when available
  - local tests/lint/type checks when available
  - manual checks still needed
- what needs explicit human approval:
  - new patterns or primitives
  - major layout or information-architecture changes
  - visual direction changes
  - accessibility exceptions or tradeoffs

### 3. Build

When implementing:
- keep one writer at a time
- preserve the target repo’s conventions
- keep logic and styling readable
- prefer semantic HTML and progressive enhancement where applicable
- implement all named states that are in scope
- do not silently skip responsive or accessibility requirements from the spec
- use Context7 or official docs before guessing at framework-specific details

### 4. Review

After implementation, review against the approved spec, not just the diff.

Check for:
- spec drift
- missing states
- broken or unclear responsive behavior
- accessibility gaps
- over-engineering or unnecessary new abstractions
- design-system drift
- missing docs or examples when user-facing behavior changed
- claimed validation that did not actually happen

Separate:
- **Blockers** — correctness, UX, a11y, or validation issues that should be fixed now
- **Fix now** — worthwhile improvements inside approved scope
- **Optional polish** — nice-to-have cleanup
- **Needs approval** — product/design decisions outside approved scope

## Validation Hierarchy

### Preferred validation
When available, prefer:
1. **Playwright or browser-based validation**
   - verify real user flows
   - inspect responsive behavior at key breakpoints
   - run accessibility checks if the toolchain supports them
   - use screenshots/visual comparisons only when the environment is stable enough for them to be meaningful
2. **Repo-local tests/checks**
   - unit/integration/e2e tests
   - lint/type checks
   - component/story checks if present
3. **Manual verification notes**
   - keyboard-only pass
   - focus visibility and tab order
   - zoom/reflow sanity check
   - concise visual/UX review notes

### If browser tools are unavailable
Say so clearly and fall back to the strongest available validation.
Do not imply that screenshots, Playwright, Storybook, or browser automation are built into the current repo unless they actually are.

## Helpful Agent Shapes

For frontend UI/UX work, these roles usually work well:
- **planner/spec agent** — turns ambiguous requests into a concrete frontend plan
- **builder agent** — implements the approved scope with design-system reuse and a11y/responsive discipline
- **reviewer agent** — checks spec alignment, UX completeness, and validation honesty

Keep those roles narrow. Do not collapse planning, implementation, and review into one fuzzy “do everything” agent.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The UI looks fine in code." | Frontend quality depends on states, behavior, and validation. |
| "I can just assume the framework patterns." | Framework-specific guessing creates rework fast. |
| "Accessibility can be reviewed later." | Late a11y fixes are slower and usually less complete. |
| "Responsive is fine if desktop looks right." | Real frontend quality includes smaller screens, overflow, and focus behavior. |
| "I mentioned Playwright so that counts as validation." | It only counts if you actually ran it. |

## Verification

Before finishing, confirm:
- [ ] the request was specified clearly enough to build safely
- [ ] existing UI primitives/patterns were considered before inventing new ones
- [ ] framework/library docs were checked with Context7 when needed
- [ ] required states and responsive behavior were accounted for
- [ ] accessibility expectations were included in the work
- [ ] validation was run at the strongest available level
- [ ] any unavailable browser/tooling checks were stated honestly
