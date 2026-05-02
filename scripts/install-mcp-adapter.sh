#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

echo "Installing pi-mcp-adapter via Pi package manager..."
pi install npm:pi-mcp-adapter

echo

echo "Installed: npm:pi-mcp-adapter"
echo "Next step: open Pi and run /reload"
