# Guardrails

This extension adds lightweight safety checks for risky actions.

It is meant to increase trust in Pi without getting in the way of normal work.

---

## What it watches

### Risky shell commands

The extension asks for confirmation before commands such as:

- `rm -rf`
- `git reset --hard`
- `git clean -fd`
- commands using `sudo`

### Sensitive writes

The extension asks for confirmation before edits or writes targeting paths such as:

- `.env` and `.env.*`
- `~/.pi/agent/auth.json`
- `~/.ssh/*`
- `~/.aws/*`
- `~/.kube/*`
- common key/certificate files like `.pem` and `.key`

### Writes outside the current project

If a `write` or `edit` targets a file outside the current working directory, the extension asks for confirmation.

---

## Install

From the repo root:

```sh
./scripts/install-extension-guardrails.sh
```

Then reload Pi:

```text
/reload
```

---

## Command

### `/guardrails`

Toggles guardrails on and off.

### `/guardrails on`

Enables guardrails.

### `/guardrails off`

Disables guardrails.

### `/guardrails status`

Shows the current guardrails status and what is being checked.

---

## Notes

- in interactive mode, risky actions prompt for confirmation
- in non-UI contexts, risky actions are blocked instead of prompting
- the rules are intentionally small and readable so they can evolve over time
