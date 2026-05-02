# Extensions

Pi extensions used by `not-not-dev`.

## Recommended extensions

### `guardrails/index.ts`

**Recommended default:** on

What it does:
- confirms risky shell commands
- confirms sensitive writes
- helps prevent accidental edits outside the current project

Install:

```sh
./scripts/install-extension-guardrails.sh
```

Runtime toggle:

```text
/guardrails on
/guardrails off
/guardrails status
```

Extra TUI controls:

```text
/guardrails tui
/guardrails tui on
/guardrails tui off
/guardrails tui status
```

Source:

- [`guardrails/index.ts`](./guardrails/index.ts)
- [`guardrails/README.md`](./guardrails/README.md)

### `context-radar/index.ts`

**Recommended default:** on

What it does:
- shows context pressure in Pi
- makes high context usage easier to notice before it becomes a problem

Install:

```sh
./scripts/install-extension-context-radar.sh
```

Runtime toggle:

```text
/context-radar on
/context-radar off
/context-radar status
```

Source:

- [`context-radar/index.ts`](./context-radar/index.ts)
- [`context-radar/README.md`](./context-radar/README.md)

### `openrouter/index.ts`

**Recommended default:** optional, off unless you use OpenRouter

What it does:
- adds footer/status info for OpenRouter users
- shows model/context/footer layout information
- exposes footer ordering and layout controls

Install:

```sh
./scripts/install-extension-openrouter.sh
```

Commands:

```text
/footer
/footer status
/footer edit
/footer layout inline
/footer layout stacked
/footer order guardrails,context-radar,openrouter,model,context
/footer order reset
/footer reset
/openrouter-footer-refresh
```

Source:

- [`openrouter/index.ts`](./openrouter/index.ts)

## Concise recommendation summary

If you want the simplest useful setup:
- enable **guardrails** for safety
- enable **context-radar** for context awareness
- enable **openrouter** only if you actually use OpenRouter

The recommended `bootstrap.sh` profile installs `guardrails` and `context-radar` by default, while leaving the OpenRouter footer optional.

## OpenRouter notes

This extension is specifically for OpenRouter.

It reads credentials from either:

- `OPENROUTER_API_KEY`
- `~/.pi/agent/auth.json`

OpenRouter account data is fetched from:

- `https://openrouter.ai/api/v1/credits`
- `https://openrouter.ai/api/v1/auth/key`

If you are not using OpenRouter, skip this extension.

## Reload

After installing any extension:

```text
/reload
```
