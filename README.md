# not-not-dev

<div align="center">

# not-not-dev

**Pi coding agent extensions, setup, and workflow tooling**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Pi package](https://img.shields.io/badge/Pi-package-blueviolet)](https://github.com/NotNotEvan/not-not-dev)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-footer-4b8bf4)](./extensions/openrouter-footer.ts)

</div>

`not-not-dev` is a clean, version-controlled home for Pi customizations — starting with a custom footer extension that surfaces OpenRouter usage, remaining credits, model details, and context information directly in the Pi UI.

---

## Highlights

- clean, focused Pi project structure
- custom OpenRouter-aware footer extension
- quick local install with a helper script
- easy to clone, reload, and iterate on
- ready to grow into a larger Pi toolkit

---

## Included today

### `extensions/openrouter-footer.ts`

A Pi extension that adds a dynamic footer showing:

- OpenRouter total usage
- OpenRouter remaining credits
- active model
- context usage and context window
- current working directory
- current session name when available

### Project layout

```text
not-not-dev/
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── scripts/
│   ├── bootstrap.sh
│   └── install-openrouter-footer.sh
└── extensions/
    └── openrouter-footer.ts
```

---

## Footer preview

Wide terminal:

```text
~/development/not-not-dev · my-session    OpenRouter used $1.24 left $8.76 · openrouter/anthropic/claude-sonnet-4 · ctx 18%/200k
```

Narrow terminal:

```text
~/development/not-not-dev · my-session          openrouter/anthropic/claude-sonnet-4
OpenRouter used $1.24 left $8.76                                ctx 18%/200k
```

---

## Quick start

### 1. Install Pi

```bash
npm install -g @mariozechner/pi-coding-agent
```

### 2. Configure OpenRouter

Use either:

- `OPENROUTER_API_KEY`
- `/login` inside Pi

### 3. Clone the repo

```bash
git clone https://github.com/NotNotEvan/not-not-dev.git
cd not-not-dev
```

### 4. Install the footer extension

```bash
npm run install:footer
```

### 5. Reload Pi

Inside Pi:

```text
/reload
```

### 6. Verify it works

You should now see footer details for:

- OpenRouter usage
- remaining credits
- active model
- context info

Manual refresh command:

```text
/openrouter-footer-refresh
```

---

## Install helpers

### Footer only

```bash
bash ./scripts/install-openrouter-footer.sh
```

### Bootstrap everything currently included

```bash
bash ./scripts/bootstrap.sh
```

---

## How the extension gets its data

OpenRouter account data is fetched from:

- `https://openrouter.ai/api/v1/credits`
- `https://openrouter.ai/api/v1/auth/key`

The API key is read from:

- `OPENROUTER_API_KEY`
- `~/.pi/agent/auth.json`

### Refresh behavior

The footer refreshes:

- on Pi startup
- after each agent response
- every 5 minutes in the background
- when `/openrouter-footer-refresh` is run

---

## Development workflow

Edit:

```text
extensions/openrouter-footer.ts
```

Then inside Pi:

```text
/reload
```

Useful checks:

- switch models with `/model`
- send a message and watch usage update
- resize the terminal
- test with and without OpenRouter credentials

---

## Security

- never commit API keys
- prefer environment variables or Pi auth storage
- keep extensions small and readable

---

## Roadmap ideas

Potential future additions:

- more `extensions/`
- `skills/` for reusable workflows
- `prompts/` for repeatable prompt templates
- `themes/` for custom Pi appearance
- setup scripts for full workstation bootstrapping

---

## License

MIT — see [LICENSE](./LICENSE).
