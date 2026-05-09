# not-not-dev

<div align="center">

# not-not-dev

**Pi coding agent setup, extensions, and workflow tooling**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Pi package](https://img.shields.io/badge/Pi-package-blueviolet)](https://github.com/NotNotEvan/not-not-dev)

</div>

`not-not-dev` is a clean, version-controlled home for Pi customizations. It is designed to stay lightweight at the top level, while linking out to focused guides for setup, scripts, provider-specific extensions, and reusable coding workflows.

---

## Goals

- keep Pi customizations organized
- make setup easy to repeat on a new machine
- stay flexible across shells and model providers
- document provider-specific integrations without making the whole repo provider-specific

---

## Quick start

### 1. Install Pi

```sh
npm install -g @mariozechner/pi-coding-agent
```

### 2. Configure at least one provider

Use whichever provider fits your workflow.

That may mean:

- signing in with `/login` inside Pi
- setting provider-specific environment variables
- using local/provider-specific Pi configuration

For extension-specific notes, see the linked guides below.

### 3. Clone this repo

```sh
git clone https://github.com/NotNotEvan/not-not-dev.git
cd not-not-dev
```

### 4. Run the install script(s) you want

Examples:

```sh
./scripts/install-mcp-adapter.sh
./scripts/install-package-pi-subagents.sh
./scripts/install-package-taskplane.sh
./scripts/install-package-context-mode.sh
./scripts/install-package-pi-web-access.sh
./scripts/install-extension-guardrails.sh
./scripts/install-extension-context-radar.sh
./scripts/install-extension-openrouter.sh
```

Or run the recommended default setup:

```sh
./scripts/bootstrap.sh
```

Optional variants:

```sh
./scripts/bootstrap.sh --with-openrouter
./scripts/bootstrap.sh --minimal
./scripts/bootstrap.sh --without-taskplane --without-context-mode
```

### 5. Reload Pi

Inside Pi:

```text
/reload
```

### 6. Toggle optional runtime helpers to your preference

Inside Pi:

```text
/guardrails on
/guardrails off
/context-radar on
/context-radar off
/footer status
```

---

## Guides

- [Docs index](./docs/README.md)
- [Setup and install scripts](./scripts/README.md)
- [Extensions](./extensions/README.md)
- [Skills](./skills/README.md)
- [Prompts](./prompts/README.md)
- [Scripts](./scripts/README.md)
- [Frontend UI/UX workflow skill](./skills/frontend-uiux-workflow/SKILL.md)
- [Frontend UI/UX prompts](./prompts/frontend-uiux-plan.md) / [ship](./prompts/frontend-uiux-ship.md)
- [OpenRouter provider notes](./docs/providers/openrouter/README.md)
- [Context7 notes](./docs/providers/context7/README.md)

---

## Current project layout

```text
not-not-dev/
├── .gitignore
├── .mcp.json
├── LICENSE
├── README.md
├── docs/
│   ├── README.md
│   └── providers/
│       ├── README.md
│       ├── context7/
│       │   └── README.md
│       └── openrouter/
│           └── README.md
├── package.json
├── .pi/
│   └── agents/
│       ├── frontend-uiux-builder.md
│       ├── frontend-uiux-planner.md
│       ├── frontend-uiux-reviewer.md
│       ├── pi-customization-builder.md
│       ├── pi-customization-planner.md
│       ├── pi-customization-reviewer.md
│       └── supervisor.md
├── prompts/
│   ├── README.md
│   ├── frontend-uiux-plan.md
│   ├── frontend-uiux-ship.md
│   ├── pi-customization-plan.md
│   ├── pi-customization-ship.md
│   └── stage-taskplane-task.md
├── scripts/
│   ├── README.md
│   ├── bootstrap.sh
│   ├── install-mcp-adapter.sh
│   ├── install-package-context-mode.sh
│   ├── install-package-pi-subagents.sh
│   ├── install-package-pi-web-access.sh
│   ├── install-package-taskplane.sh
│   ├── install-extension-context-radar.sh
│   ├── install-extension-guardrails.sh
│   └── install-extension-openrouter.sh
├── skills/
│   ├── README.md
│   ├── coding-workflow/
│   │   └── SKILL.md
│   ├── frontend-uiux-workflow/
│   │   └── SKILL.md
│   └── pi-extension-workflow/
│       └── SKILL.md
└── extensions/
    ├── README.md
    ├── context-radar/
    │   ├── README.md
    │   └── index.ts
    ├── guardrails/
    │   ├── README.md
    │   └── index.ts
    └── openrouter/
        └── index.ts
```

---

## Included today

### Guardrails

A safety extension for confirming risky commands and sensitive writes.

See:

- [Extensions guide](./extensions/README.md)
- [`extensions/guardrails/index.ts`](./extensions/guardrails/index.ts)
- [`extensions/guardrails/README.md`](./extensions/guardrails/README.md)

### Context radar

A lightweight context pressure indicator for Pi.

See:

- [Extensions guide](./extensions/README.md)
- [`extensions/context-radar/index.ts`](./extensions/context-radar/index.ts)
- [`extensions/context-radar/README.md`](./extensions/context-radar/README.md)

### OpenRouter footer extension

A shared footer extension with OpenRouter account info, model info, context info, and footer layout controls.

See:

- [Extensions guide](./extensions/README.md)
- [OpenRouter provider notes](./docs/providers/openrouter/README.md)
- [`extensions/openrouter/index.ts`](./extensions/openrouter/index.ts)

### Recommended packages and plugins

Recommended defaults installed by `./scripts/bootstrap.sh`:

- **`pi-mcp-adapter`** — direct MCP tool support; used here for Context7 access
- **`pi-subagents`** — builtin scout/planner/worker/reviewer/oracle delegation workflows
- **`taskplane`** — queued task packets and `/orch` autonomous execution
- **`context-mode`** — better handling for large output, logs, diffs, and test results
- **`pi-web-access`** — web search, fetching, and source-backed research helpers like `librarian`
- **`guardrails`** — confirms risky commands and sensitive writes
- **`context-radar`** — shows context pressure and can be toggled on/off in Pi

Optional:

- **`openrouter` footer extension** — provider-specific footer/status UI for OpenRouter users

Recommended quick picks:
- **minimal:** `pi-mcp-adapter` + `guardrails`
- **recommended default:** minimal + `pi-subagents` + `taskplane` + `context-mode` + `pi-web-access` + `context-radar`
- **OpenRouter users:** recommended default + `openrouter`

These defaults are install-time toggles in `bootstrap.sh`, and the interactive extensions also expose runtime toggles inside Pi.

### Context7 MCP setup

This repo also includes a project-local Context7 MCP config for use with `pi-mcp-adapter`.

See:

- [Context7 notes](./docs/providers/context7/README.md)
- [`.mcp.json`](./.mcp.json)

### Frontend UI/UX workflow

This repo now includes a framework-agnostic frontend workflow for Pi covering spec -> plan -> build -> review.

It is designed for frontend implementation and design work that should:
- use Context7 first for framework/library docs
- prefer design-system reuse before inventing new primitives
- account for accessibility, responsive behavior, and meaningful UI states
- prefer Playwright/browser validation when available
- report tooling limits honestly when browser validation is unavailable

See:

- [Frontend workflow skill](./skills/frontend-uiux-workflow/SKILL.md)
- [Frontend planning prompt](./prompts/frontend-uiux-plan.md)
- [Frontend ship prompt](./prompts/frontend-uiux-ship.md)
- [Project agents](./.pi/agents/)

---

## Development workflow

1. make changes in this repo
2. run the appropriate install helper if needed
3. reload Pi with `/reload`
4. test the behavior in a live session

More detail:

- [Script usage](./scripts/README.md)
- [Extension notes](./extensions/README.md)
- [Skills](./skills/README.md)
- [Prompts](./prompts/README.md)

---

## Security

- never commit API keys
- prefer Pi auth storage or environment variables
- keep integrations small, readable, and easy to remove

---

## Roadmap

Near-term direction:

- expand repo-local agents and prompt workflows for coding work
- refine install defaults and optional profiles in `bootstrap.sh`
- add more provider-specific docs without making the whole repo provider-specific
- continue keeping extensions/skills/prompts small, explicit, and removable
- add themes or workstation bootstrap helpers only when they stay maintainable

---

## License

MIT — see [LICENSE](./LICENSE).
