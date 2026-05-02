#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

echo "Installing pi-subagents via Pi package manager..."
pi install npm:pi-subagents

echo

echo "Installed: npm:pi-subagents"
echo "What it adds: builtin scout/planner/worker/reviewer/oracle style delegation workflows"
echo "Next step: open Pi and run /reload"
