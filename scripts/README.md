# Scripts

Simple setup scripts for `not-not-dev`.

Run them from the repo root.

## Available scripts

### `install-mcp-adapter.sh`

Installs `pi-mcp-adapter`.

```sh
./scripts/install-mcp-adapter.sh
```

### `install-extension-openrouter.sh`

Links `extensions/openrouter/` into `~/.pi/agent/extensions/openrouter`.

```sh
./scripts/install-extension-openrouter.sh
```

### `install-extension-guardrails.sh`

Links `extensions/guardrails/` into `~/.pi/agent/extensions/guardrails`.

```sh
./scripts/install-extension-guardrails.sh
```

### `install-extension-context-radar.sh`

Links `extensions/context-radar/` into `~/.pi/agent/extensions/context-radar`.

```sh
./scripts/install-extension-context-radar.sh
```

### `bootstrap.sh`

Runs the default setup:

- checks that Pi is installed
- installs `pi-mcp-adapter`
- installs the OpenRouter extension symlink

```sh
./scripts/bootstrap.sh
```

## Reload

After running a script, reload Pi:

```text
/reload
```
