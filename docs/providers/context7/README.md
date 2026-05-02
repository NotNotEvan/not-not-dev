# Context7

This directory contains Context7-specific setup notes for `not-not-dev`.

The repo root stays general, while this guide documents how Context7 is wired into Pi through the installed MCP adapter.

---

## What this setup uses

This repo does **not** implement MCP natively in Pi.
It relies on the installed [`pi-mcp-adapter`](https://www.npmjs.com/package/pi-mcp-adapter) package, which exposes a single `mcp` tool inside Pi and reads standard MCP config files such as:

- `.mcp.json` (project-local shared config)
- `~/.config/mcp/mcp.json` (user-global shared config)
- `~/.pi/agent/mcp.json` (Pi-specific global override)
- `.pi/mcp.json` (Pi-specific project override)

For this repo, Context7 was added in the project-local shared file:

- [`.mcp.json`](../../../.mcp.json)

---

## Configured server

Current project config:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "lifecycle": "lazy",
      "directTools": true
    }
  }
}
```

Notes:

- `url` uses Context7's remote MCP endpoint
- `lifecycle: "lazy"` means the adapter only connects when needed
- `directTools: true` asks the adapter to expose Context7 tools directly in Pi once metadata is cached

Context7 supports API-key authentication via the `CONTEXT7_API_KEY` header or OAuth on the `/mcp/oauth` endpoint for MCP clients that support MCP OAuth. This repo does not store any key in source control.

---

## Optional authentication

Context7 can work without an API key, but official docs say authenticated usage gives higher rate limits and access to private repositories when supported.

If you want that, configure authentication outside this repo, for example in a Pi-specific override file instead of committing secrets into `.mcp.json`.

Example user-global Pi override:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

A safer pattern is to export the environment variable in your shell and reference it from an override file you do not commit.

---

## Using it in Pi

1. Install the MCP adapter if needed:

```sh
./scripts/install-mcp-adapter.sh
```

2. Start or reload Pi
3. Run:

```text
/reload
```

Then you can:

- inspect adapter state with the `mcp` tool
- use `/mcp` if the adapter command UI is available
- search for Context7 tools through the adapter

If `directTools` have not appeared yet, reconnect the server once so the adapter can cache metadata.

---

## Verification notes

At the time this was added:

- `pi-mcp-adapter` was already installed globally
- no existing MCP config files were present in this repo or user config locations checked here
- this repo now contains a project-local `.mcp.json` with a Context7 server entry

Interactive Pi validation still requires opening Pi and reloading the runtime.

---

## Sources

- Context7 MCP client docs: https://context7.com/docs/resources/all-clients
- Context7 npm package docs: https://www.npmjs.com/package/@upstash/context7-mcp
- Pi MCP adapter README: local install at `~/.npm-global/lib/node_modules/pi-mcp-adapter/README.md`
