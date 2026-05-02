# not-not-dev

<div align="center">

# not-not-dev

**Pi coding agent setup, extensions, and workflow tooling**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Pi package](https://img.shields.io/badge/Pi-package-blueviolet)](https://github.com/NotNotEvan/not-not-dev)

</div>

`not-not-dev` is a clean, version-controlled home for Pi customizations. It is designed to stay lightweight at the top level, while linking out to focused guides for setup, scripts, and provider-specific extensions.

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
./scripts/install-extension-guardrails.sh
./scripts/install-extension-context-radar.sh
./scripts/install-extension-openrouter.sh
```

Or run the default setup:

```sh
./scripts/bootstrap.sh
```

### 5. Reload Pi

Inside Pi:

```text
/reload
```

---

## Guides

- [Docs index](./docs/README.md)
- [Setup and install scripts](./scripts/README.md)
- [Extensions](./extensions/README.md)
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
├── scripts/
│   ├── README.md
│   ├── bootstrap.sh
│   ├── install-mcp-adapter.sh
│   ├── install-extension-context-radar.sh
│   ├── install-extension-guardrails.sh
│   └── install-extension-openrouter.sh
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

### Context7 MCP setup

This repo also includes a project-local Context7 MCP config for use with `pi-mcp-adapter`.

See:

- [Context7 notes](./docs/providers/context7/README.md)
- [`.mcp.json`](./.mcp.json)

---

## Development workflow

1. make changes in this repo
2. run the appropriate install helper if needed
3. reload Pi with `/reload`
4. test the behavior in a live session

More detail:

- [Script usage](./scripts/README.md)
- [Extension notes](./extensions/README.md)

---

## Security

- never commit API keys
- prefer Pi auth storage or environment variables
- keep integrations small, readable, and easy to remove

---

## Roadmap

Potential future additions:

- provider-specific docs under `docs/providers/`
- provider-specific extension groupings such as `extensions/openrouter/`
- more provider integrations
- more `extensions/`
- `skills/` for reusable workflows
- `prompts/` for repeatable prompt templates
- `themes/` for custom Pi appearance
- workstation bootstrap helpers

---

## License

MIT — see [LICENSE](./LICENSE).
