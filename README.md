# not-not-dev

> A focused home for Pi customizations, extensions, and developer workflow experiments.

`not-not-dev` is a personal Pi coding agent project for collecting small, useful improvements in one clean repo — starting with a custom OpenRouter-aware footer extension.

---

## Why this repo exists

Pi is flexible, but the best customizations tend to be the ones you can:

- understand quickly
- install in a few minutes
- keep under version control
- move to a new machine without guesswork

This repository is meant to be that home.

## What’s included

### `extensions/openrouter-footer.ts`

A Pi extension that adds a smarter footer with useful session info, including:

- OpenRouter total usage
- OpenRouter remaining credits
- active model
- context usage / context window
- current working directory
- session name, when available

### Current project structure

```text
not-not-dev/
├── .gitignore
├── README.md
├── package.json
└── extensions/
    └── openrouter-footer.ts
```

---

## Footer preview

On wide terminals, the footer renders in a single line.
On smaller terminals, it gracefully wraps into two lines to keep the important information readable.

Example layout:

```text
~/development/not-not-dev · my-session    OpenRouter used $1.24 left $8.76 · openrouter/anthropic/claude-sonnet-4 · ctx 18%/200k
```

Compact layout on narrow terminals:

```text
~/development/not-not-dev · my-session          openrouter/anthropic/claude-sonnet-4
OpenRouter used $1.24 left $8.76                                ctx 18%/200k
```

---

## How it works

The extension fetches OpenRouter account data from:

- `https://openrouter.ai/api/v1/credits`
- `https://openrouter.ai/api/v1/auth/key`

It reads your OpenRouter API key from either:

- `OPENROUTER_API_KEY`
- `~/.pi/agent/auth.json`

### Refresh behavior

The footer refreshes:

- when Pi starts
- after each agent response finishes
- every 5 minutes in the background
- when you run `/openrouter-footer-refresh`

---

## Quick start

### 1. Install Pi

```bash
npm install -g @mariozechner/pi-coding-agent
```

### 2. Configure OpenRouter

Use one of the following:

- set `OPENROUTER_API_KEY`
- use `/login` inside Pi and store the key there

### 3. Clone this repo

```bash
git clone git@github.com:NotNotEvan/not-not-dev.git
cd not-not-dev
```

### 4. Symlink the extension into Pi

```bash
mkdir -p ~/.pi/agent/extensions
ln -sf "$PWD/extensions/openrouter-footer.ts" ~/.pi/agent/extensions/openrouter-footer.ts
```

### 5. Reload Pi

Inside Pi:

```text
/reload
```

### 6. Verify the footer

Confirm that Pi now shows:

- OpenRouter usage
- remaining credits
- active model
- context information

If needed, force a refresh:

```text
/openrouter-footer-refresh
```

---

## Local development workflow

### Edit the extension

Work in:

```text
extensions/openrouter-footer.ts
```

### Reload Pi after changes

```text
/reload
```

### Good test checks

- switch models with `/model`
- send a message and confirm usage updates
- resize the terminal and check the footer layout
- verify behavior with and without an OpenRouter API key configured

---

## Commands

### `/openrouter-footer-refresh`

Manually refreshes the footer’s OpenRouter usage and credits data.

---

## Repository goals

This repo is designed to grow into a tidy Pi toolkit. Likely future additions:

- `extensions/` for more UI and workflow helpers
- `skills/` for reusable task flows
- `prompts/` for prompt templates
- `themes/` for custom visual setups
- setup scripts for installing a full Pi environment quickly

---

## Security notes

- Do **not** commit API keys or secrets
- Prefer environment variables or Pi auth storage
- Keep extensions small, readable, and easy to debug

---

## Tech notes

This repo currently includes a minimal `package.json` so it can evolve into a reusable Pi package over time.

## Maintainer

Built for the `not-not-dev` Pi coding agent setup.
