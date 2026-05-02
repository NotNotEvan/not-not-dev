# Extensions

Pi extensions used by `not-not-dev`.

## Included

### `guardrails/index.ts`

Confirms risky commands and sensitive writes.

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
/guardrails tui
/guardrails tui on
/guardrails tui off
/guardrails tui status
```

Source:

- [`guardrails/index.ts`](./guardrails/index.ts)
- [`guardrails/README.md`](./guardrails/README.md)

### `context-radar/index.ts`

Shows context pressure in Pi.

Install:

```sh
./scripts/install-extension-context-radar.sh
```

Commands:

```text
/context-radar
/context-radar on
/context-radar off
/context-radar status
```

Source:

- [`context-radar/index.ts`](./context-radar/index.ts)
- [`context-radar/README.md`](./context-radar/README.md)

### `openrouter/index.ts`

Adds a footer with OpenRouter, model, and context info.

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
