#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

echo "Installing context-mode via Pi package manager..."
pi install npm:context-mode

echo

echo "Installed: npm:context-mode"
echo "What it adds: large-output analysis, context-saving workflows, and context-mode utility skills"
echo "Next step: open Pi and run /reload"
