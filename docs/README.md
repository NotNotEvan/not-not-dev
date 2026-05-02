# Docs

This directory is the documentation index for `not-not-dev`.

The goal is to keep the root README concise, while linking deeper documentation from here as the project grows.

---

## Current docs

- [Scripts](../scripts/README.md)
- [Extensions](../extensions/README.md)

---

## Provider-specific docs

Provider-specific documentation can live under [`docs/providers/`](./providers/).

Suggested future structure:

```text
docs/
├── README.md
└── providers/
    ├── openrouter/
    │   └── README.md
    ├── anthropic/
    │   └── README.md
    └── openai/
        └── README.md
```

This keeps the top-level project docs provider-agnostic while still making it easy to document provider-specific setup and extension behavior.
