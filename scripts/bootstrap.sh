#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/install-mcp-adapter.sh"
"$SCRIPT_DIR/install-extension-openrouter.sh"

echo
echo "Bootstrap complete."
echo "If your chosen provider is not configured yet, use /login in Pi or your provider-specific environment/config setup."
