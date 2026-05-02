#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

echo "Installing taskplane via Pi package manager..."
pi install npm:taskplane

echo

echo "Installed: npm:taskplane"
echo "What it adds: Taskplane task packets, /orch batch execution, and supervisor/worker orchestration tooling"
echo "Next step: open Pi and run /reload"
