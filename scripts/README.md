# Scripts

This directory contains helper scripts for installing and bootstrapping pieces of the `not-not-dev` Pi setup.

These scripts are meant to be run directly, so your interactive shell does not need to be Bash, Zsh, or anything specific.

---

## Available scripts

### `install-extension-openrouter-footer.sh`

Creates or updates a symlink from:

- `extensions/openrouter-footer.ts`

into Pi's local extensions directory:

- `~/.pi/agent/extensions/openrouter-footer.ts`

Run it from the repo root:

```sh
./scripts/install-extension-openrouter-footer.sh
```

After it completes, reload Pi:

```text
/reload
```

### `bootstrap.sh`

Runs the currently included bootstrap flow for this repo.

Right now it:

- verifies Pi is installed
- installs the OpenRouter footer extension symlink

Run:

```sh
./scripts/bootstrap.sh
```

---

## Notes

- these helpers install local development links, not published packages
- provider-specific configuration is separate from script execution
- if you are not using OpenRouter, you can skip the OpenRouter-specific installer
