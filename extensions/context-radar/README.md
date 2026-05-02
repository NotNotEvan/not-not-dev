# Context Radar

This extension adds a context pressure indicator for Pi.

It is designed to be more informative than a raw context percentage alone.

---

## What it shows

- current context usage percentage
- token usage against the current context window
- warning levels as pressure grows
- a simple recent trend signal
- an optional widget with expanded details

## Pressure levels

- below 50%: healthy
- 50%+: building
- 70%+: high
- 85%+: critical

## Install

From the repo root:

```sh
./scripts/install-extension-context-radar.sh
```

Then reload Pi:

```text
/reload
```

---

## Commands

### `/context-radar`

Toggles the context radar widget.

### `/context-radar on`

Shows the widget above the editor.

### `/context-radar off`

Hides the widget.

### `/context-radar status`

Shows current context pressure details.

---

## Notes

- the radar appears as an optional widget above the editor
- the widget is optional and can be toggled independently
- the extension is provider-agnostic and uses Pi's current context usage data
