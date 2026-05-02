# Extensions

This directory contains Pi extensions used by `not-not-dev`.

The repo is intentionally broader than any one provider, but some extensions may be provider-specific. Those integrations live here so the root setup can stay general.

---

## Included extensions

### `guardrails/index.ts`

Adds lightweight protection for risky actions such as:

- `rm -rf`
- `git reset --hard`
- `git clean -fd`
- writes to sensitive files like `.env`
- writes outside the current working directory

Install:

```sh
./scripts/install-extension-guardrails.sh
```

Commands:

```text
/guardrails
/guardrails on
/guardrails off
/guardrails status
```

Source:

- [`guardrails/index.ts`](./guardrails/index.ts)
- [`guardrails/README.md`](./guardrails/README.md)

### `openrouter/index.ts`

Adds a dynamic Pi footer showing:

- OpenRouter total usage
- OpenRouter remaining credits
- active model
- context usage and context window
- current working directory
- session name when available

Source:

- [`openrouter/index.ts`](./openrouter/index.ts)

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

## OpenRouter configuration

This extension is specifically for OpenRouter.

It reads credentials from either:

- `OPENROUTER_API_KEY`
- `~/.pi/agent/auth.json`

OpenRouter account data is fetched from:

- `https://openrouter.ai/api/v1/credits`
- `https://openrouter.ai/api/v1/auth/key`

If you are using a different provider, you can still use this repo — just skip this extension or add a different provider-specific one later.

Provider-specific extensions can live in directories like `extensions/openrouter/`, with matching documentation under `docs/providers/`.

---

## Install

From the repo root:

```sh
./scripts/install-extension-openrouter.sh
```

Then reload Pi:

```text
/reload
```

---

## Command

### `/openrouter-footer-refresh`

Manually refreshes OpenRouter usage and credit information in the footer.

---

## Refresh behavior

The footer refreshes:

- on Pi startup
- after each agent response
- every 5 minutes in the background
- when `/openrouter-footer-refresh` is run

---

## Testing checklist

- switch models with `/model`
- send a message and confirm usage updates
- resize the terminal and verify layout changes
- test with and without OpenRouter credentials configured
- confirm Pi still works normally when OpenRouter data is unavailable
