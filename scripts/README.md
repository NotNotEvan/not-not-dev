# Scripts

Setup and install scripts for `not-not-dev`.

Run them from the repo root.

## Recommended defaults

The default bootstrap profile installs the recommended coding workflow stack:

- **`pi-mcp-adapter`** — direct MCP tool support; used here for Context7
- **`pi-subagents`** — builtin scout/planner/worker/reviewer/oracle delegation workflows
- **`taskplane`** — task packets plus `/orch` autonomous execution
- **`context-mode`** — better handling for large outputs, logs, and diffs
- **`pi-web-access`** — web search/fetch helpers and source-backed research workflows
- **`guardrails`** — safety checks for risky commands and sensitive writes
- **`context-radar`** — context pressure visibility and widget/status commands

Optional:

- **`openrouter` footer extension** — footer/status integration for OpenRouter users

## Bootstrap

### `bootstrap.sh`

Installs the recommended default stack unless you opt out.

```sh
./scripts/bootstrap.sh
```

Useful options:

```sh
./scripts/bootstrap.sh --with-openrouter
./scripts/bootstrap.sh --minimal
./scripts/bootstrap.sh --without-taskplane --without-context-mode
./scripts/bootstrap.sh --help
```

Install-time toggles let you keep the defaults but disable pieces you do not want.

## Individual scripts

### `install-mcp-adapter.sh`

Installs `pi-mcp-adapter`.

```sh
./scripts/install-mcp-adapter.sh
```

### `install-package-pi-subagents.sh`

Installs `pi-subagents`.

```sh
./scripts/install-package-pi-subagents.sh
```

### `install-package-taskplane.sh`

Installs `taskplane`.

```sh
./scripts/install-package-taskplane.sh
```

### `install-package-context-mode.sh`

Installs `context-mode`.

```sh
./scripts/install-package-context-mode.sh
```

### `install-package-pi-web-access.sh`

Installs `pi-web-access`.

```sh
./scripts/install-package-pi-web-access.sh
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

## Defaults vs runtime toggles

Two kinds of toggles exist:

### Install-time toggles

Choose what gets installed by passing flags to `bootstrap.sh`:

- `--minimal`
- `--with-openrouter`
- `--without-mcp-adapter`
- `--without-subagents`
- `--without-taskplane`
- `--without-context-mode`
- `--without-pi-web-access`
- `--without-guardrails`
- `--without-context-radar`
- `--without-openrouter`

### Runtime toggles inside Pi

Installed extensions can also be turned on/off at runtime:

```text
/guardrails on
/guardrails off
/guardrails status

/context-radar on
/context-radar off
/context-radar status

/footer status
/footer edit
/footer reset
```

For installed packages, use Pi package management to remove or re-add them later:

```sh
pi remove npm:pi-subagents
pi remove npm:taskplane
pi remove npm:context-mode
pi remove npm:pi-web-access
```

## Reload

After running a script, reload Pi:

```text
/reload
```
