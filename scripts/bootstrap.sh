#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$SCRIPT_DIR/install-openrouter-footer.sh"

echo
echo "Bootstrap complete."
echo "If OpenRouter is not configured yet, set OPENROUTER_API_KEY or use /login in Pi."
