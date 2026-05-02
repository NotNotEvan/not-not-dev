# Scripts

This directory contains helper scripts for installing and bootstrapping pieces of the `not-not-dev` Pi setup.

These scripts are meant to be run directly, so your interactive shell does not need to be Bash, Zsh, or anything specific.

---

## Available scripts

### `install-extension-openrouter.sh`

Creates or updates a symlink from:

- `extensions/openrouter/`

into Pi's local extensions directory:

- `~/.pi/agent/extensions/openrouter`

Run it from the repo root:

```sh
./scripts/install-extension-openrouter.sh
```

After it completes, reload Pi:

```text
/reload
```

### `install-extension-guardrails.sh`

Creates or updates a symlink from:

- `extensions/guardrails/`

into Pi's local extensions directory:

- `~/.pi/agent/extensions/guardrails`

Run it from the repo root:

```sh
./scripts/install-extension-guardrails.sh
```

After it completes, reload Pi:

```text
/reload
```

### `install-extension-context-radar.sh`

Creates or updates a symlink from:

- `extensions/context-radar/`

into Pi's local extensions directory:

- `~/.pi/agent/extensions/context-radar`

Run it from the repo root:

```sh
./scripts/install-extension-context-radar.sh
```

After it completes, reload Pi:

```text
/reload
```

### `bootstrap.sh`

Runs the currently included bootstrap flow for this repo.

Right now it:

- verifies Pi is installed
- installs the OpenRouter-powered shared footer extension symlink

You can also install extensions individually with the dedicated helper scripts above.

Run:

```sh
./scripts/bootstrap.sh
```

---

## Notes

- these helpers install local development links, not published packages
- provider-specific configuration is separate from script execution
- if you are not using OpenRouter, you can skip the OpenRouter-specific installer
