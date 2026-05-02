# OpenRouter

This directory contains OpenRouter-specific notes for `not-not-dev`.

The root of the repo stays provider-agnostic, while this section documents OpenRouter-specific setup and behavior.

---

## Included integration

- [OpenRouter footer extension](../../../extensions/openrouter/index.ts)

---

## Authentication

The current OpenRouter extension reads credentials from either:

- `OPENROUTER_API_KEY`
- `~/.pi/agent/auth.json`

You can also authenticate through Pi using `/login` when appropriate for your setup.

---

## API endpoints used by the footer

- `https://openrouter.ai/api/v1/credits`
- `https://openrouter.ai/api/v1/auth/key`

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

## Notes

As this repo grows, additional OpenRouter-specific docs can live here without making the rest of the project OpenRouter-specific.
