# AGENTS.md

This file provides operating guidance for AI coding agents working in this repository.

It is written for Pi-style coding agents that can read files, edit code, write files, and run shell commands. It is also intended to be understandable to other coding agents that honor `AGENTS.md`.

---

## 1. Mission and repository purpose

This repository is a clean, version-controlled home for Pi customizations.

Primary goals:
- keep Pi customizations organized
- make setup repeatable on a new machine
- keep provider-specific integrations isolated and documented
- keep extensions small, readable, removable, and easy to maintain

This is not a generic application repo. It is primarily a **Pi package / customization repo** containing:
- Pi extensions
- install/bootstrap scripts
- provider notes and setup docs
- workflow guidance for future Pi customization work

When making changes, optimize for:
- clarity over cleverness
- maintainability over abstraction
- explicit docs over implicit behavior
- small, composable extensions over monolithic ones

---

## 2. Repository map

Current important paths:

- `README.md` — top-level project overview and quick start
- `docs/README.md` — docs index
- `docs/providers/` — provider-specific docs
- `extensions/README.md` — extension inventory and usage
- `extensions/guardrails/` — risky-command and sensitive-write protection
- `extensions/context-radar/` — context pressure UI/status extension
- `extensions/openrouter/` — OpenRouter-aware footer and status extension
- `scripts/README.md` — bootstrap/install script docs
- `scripts/install-extension-*.sh` — extension install helpers
- `package.json` — package metadata and Pi extension exposure

Treat the README files as the first source of truth for structure and intended usage.

---

## 3. Operating model for this repo

Use this lifecycle for most work:

1. **Orient**
   - Read the relevant README/docs before changing code.
   - Understand which extension, script, or doc owns the behavior.
   - Avoid changing multiple concerns at once unless the task truly requires it.

2. **Plan lightly**
   - For small tasks, keep the plan implicit.
   - For medium or large tasks, identify the files to change and the expected user-facing outcome.
   - Prefer narrow, reversible edits.

3. **Implement minimally**
   - Make the smallest change that solves the actual problem.
   - Reuse existing patterns from neighboring extensions and docs.
   - Do not introduce large frameworks or unnecessary dependencies.

4. **Verify**
   - Run focused checks when possible.
   - Read surrounding files after edits to confirm consistency.
   - If runtime verification is not possible, clearly state what was and was not validated.

5. **Document**
   - Update README/docs when behavior, commands, installation steps, or assumptions change.
   - If the change affects end users, docs should usually change in the same task.

---

## 4. Rules inspired by agent-skills style workflows

Adapt the spirit of structured agent workflows to this repo:

### A. Spec before broad implementation
For non-trivial work, first clarify:
- what is changing
- which file(s) own it
- how users install or invoke it
- how success will be verified

Do not jump into broad edits across multiple extensions without first grounding the change.

### B. Incremental implementation
Prefer:
- one extension at a time
- one command at a time
- one doc area at a time
- one installer script at a time

Avoid mixing unrelated refactors with feature work.

### C. Source-driven development
For Pi-specific behavior:
- consult Pi docs and examples before inventing APIs or extension patterns
- prefer local Pi docs and examples over memory
- verify command names, extension APIs, and TUI APIs against documentation

### D. Verification over confidence
Do not claim something works just because the code "looks right".
When verification is partial, say so explicitly.

### E. Documentation is part of the change
If a user-facing command, script, install flow, extension behavior, or configuration contract changes, update docs in the same task unless the user asks otherwise.

---

## 5. Documentation lookup policy

### Preferred order for documentation lookup
When documentation is needed, prefer sources in this order:

1. **Context7**, if a Context7 tool/integration is actually available in the current agent session
2. repository-local docs and source code
3. installed/local Pi documentation and examples
4. user-provided links or files
5. GitHub repository research via `gh` when the user specifically asks for external repo research

### Important rule
Do not pretend Context7 exists if it is not actually available as a tool.
If Context7 is unavailable:
- state that briefly
- fall back to the best available local or user-provided source

### For Pi-specific topics
When working on Pi topics such as:
- extensions
- skills
- prompt templates
- themes
- TUI components
- SDK integrations
- custom providers
- models
- packages

read the relevant Pi markdown docs and examples before implementing.
Follow cross-references when the docs imply another file is authoritative.

### For external repository research
If the user asks to research a GitHub repository and `gh` is available:
- prefer `gh` for repo metadata and file discovery
- inspect README and key instruction files such as `AGENTS.md`, `CLAUDE.md`, or similar agent guidance files
- summarize findings accurately and distinguish facts from interpretation

### No hallucinated APIs
Never invent:
- Pi extension APIs
- command names
- provider config keys
- OpenRouter response fields
- script behavior
- version-specific framework behavior

If uncertain, verify or state the uncertainty.

---

## 6. Repo-specific coding conventions

### General
- Keep code straightforward and readable.
- Prefer small helper functions over dense inline logic.
- Preserve the repo's current TypeScript style and naming patterns.
- Avoid unnecessary dependencies.
- Avoid broad rewrites unless clearly justified.

### For extensions
When editing or creating extensions:
- follow existing extension patterns in `extensions/*/index.ts`
- keep extension state explicit and easy to trace
- prefer simple command surfaces with clear user messaging
- keep TUI additions optional and non-disruptive
- degrade gracefully when external data is unavailable
- preserve interactive usability in Pi

Good extension traits in this repo:
- clear command names
- helpful UI notifications
- persisted lightweight state only when needed
- safe defaults
- failure modes that do not break the rest of Pi

### For scripts
When editing scripts:
- keep them directly runnable from the repo root
- favor portability and explicitness
- document user-facing behavior in `scripts/README.md` when relevant
- do not silently introduce destructive behavior

### For docs
When editing docs:
- keep them practical and task-oriented
- prefer concise steps and examples
- link to concrete files and commands
- keep provider-specific material isolated under provider docs where appropriate

---

## 7. Extension-specific guidance

### `extensions/guardrails/`
This extension protects users from risky operations.

When changing it:
- preserve the safety-first intent
- avoid weakening confirmations without a strong reason
- treat destructive shell commands and sensitive file writes conservatively
- keep status and toggle behavior understandable from the TUI

### `extensions/context-radar/`
This extension communicates context pressure.

When changing it:
- keep output lightweight and readable
- avoid noisy or distracting UI
- preserve graceful behavior when context usage data is unavailable
- prefer useful, glanceable information over excessive detail

### `extensions/openrouter/`
This extension integrates OpenRouter account/session information into the footer.

When changing it:
- do not assume credentials always exist
- degrade gracefully when API calls fail
- preserve usefulness on narrow terminals
- avoid breaking the built-in footer/context information
- keep network behavior conservative and understandable

### New extensions
If adding a new extension:
- place it under `extensions/<name>/`
- include an `index.ts`
- add or update README documentation if it is user-facing
- add an install helper script if manual linking/install is part of the intended workflow
- keep scope focused
- align with the repo's "small, readable, removable" philosophy

---

## 8. Installation and packaging expectations

This repo is exposed to Pi via `package.json`.
Respect the existing package structure.

If adding a new extension that users should install easily:
- ensure it fits the repo's Pi package structure
- update install scripts when needed
- update the root README and/or `extensions/README.md`
- avoid breaking existing install flows

If a change affects bootstrap behavior, also review:
- `scripts/bootstrap.sh`
- `scripts/README.md`
- root `README.md`

---

## 9. Safety, secrets, and trust boundaries

### Never commit secrets
Do not commit:
- API keys
- auth tokens
- `.env` contents
- auth exports from `~/.pi/agent/auth.json`
- private credentials or copied secrets from local machine state

### Treat local auth/config as sensitive
Be careful around:
- `~/.pi/agent/auth.json`
- `.env*`
- SSH keys
- cloud credential files
- any shell history or tokens

### Shell safety
Before running shell commands:
- prefer read-only inspection first
- avoid destructive operations unless the user explicitly asked for them
- avoid changing global machine state unless the task clearly requires it
- explain higher-risk changes when appropriate

### Network safety
For extensions making external requests:
- use only what is needed
- fail clearly
- avoid storing sensitive remote data unnecessarily
- do not assume internet availability

---

## 10. Validation expectations

When possible, validate at the smallest useful scope.

Examples:
- read edited files back after changes
- run focused shell checks
- verify file paths and script names
- verify docs references point to real files
- for TypeScript changes, run the narrowest available sanity check if feasible

If no automated check exists, perform manual consistency checks and report that limitation.

Do not overclaim verification.
Use language like:
- "Updated X and verified the file references/command names are consistent"
- "Did not run Pi interactively here"
- "Runtime behavior should be tested with `/reload` in Pi"

---

## 11. Change sizing and refactoring policy

Prefer small, reviewable diffs.

Do:
- isolate behavior changes from doc cleanup when practical
- preserve existing public command names unless there is a good reason to change them
- keep refactors behavior-preserving unless the task requests behavioral change

Do not:
- reformat large files without need
- rename commands casually
- reorganize directory structure without updating docs and install flows
- add abstraction layers that make the repo harder to understand

---

## 12. Response behavior for the agent

When completing work in this repo, the agent should:
- name the files changed clearly
- summarize what changed in user terms
- mention verification performed
- mention any follow-up the user should do in Pi, such as `/reload`
- mention limitations if the work depends on unavailable tools or unverified runtime behavior

Good final responses are:
- concrete
- brief but sufficient
- honest about what was validated

---

## 13. Suggested intent-to-workflow mapping

Use these heuristics:

- **"add an extension"** → inspect neighboring extensions, implement minimally, update docs, provide install/reload guidance
- **"fix a Pi extension bug"** → reproduce from code context, localize, patch narrowly, verify references, update docs if behavior changes
- **"improve docs"** → read the affected README(s), keep structure aligned across root/docs/extensions/scripts
- **"research a repo"** → use `gh`, inspect README and agent-instruction files, summarize before implementing repo-local changes
- **"provider integration"** → isolate provider-specific logic and docs; do not make the whole repo provider-specific
- **"install/setup help"** → prefer the existing script and README flow rather than inventing new steps

---

## 14. Pi-specific implementation reminders

For Pi work, remember:
- extensions are TypeScript modules
- extensions can register commands, tools, UI, and event handlers
- extensions should be hot-reload friendly when placed in Pi extension locations
- examples and docs are valuable references and should be consulted before inventing patterns

If the task is specifically about Pi itself, its SDK, themes, skills, prompt templates, TUI, providers, or packages, consult the relevant Pi docs before implementing.

---

## 15. Default fallback behavior when uncertain

If a request is ambiguous:
1. inspect the relevant local files
2. infer from nearby patterns
3. verify against Pi docs if the change is Pi-specific
4. ask a focused question only if necessary

If tooling is unavailable:
- state the limitation briefly
- use the best available local source
- avoid bluffing

---

## 16. Practical completion checklist

Before finishing, quickly ask:
- Did I read the relevant README/docs first?
- Did I change the smallest responsible set of files?
- Did I preserve repo conventions?
- Did I update docs if user-facing behavior changed?
- Did I avoid inventing APIs or config?
- Did I clearly state what I verified?
- Should I remind the user to run `/reload` in Pi?

---

## 17. In one sentence

Treat this repo like a carefully organized Pi customization package: stay grounded in docs, make small safe changes, preserve readability, and document any user-visible behavior changes as part of the work.
