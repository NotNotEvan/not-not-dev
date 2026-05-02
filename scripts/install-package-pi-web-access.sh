#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

echo "Installing pi-web-access via Pi package manager..."
pi install npm:pi-web-access

echo

echo "Installed: npm:pi-web-access"
echo "What it adds: web search, content fetching, and source-backed research helpers like librarian"
echo "Next step: open Pi and run /reload"
