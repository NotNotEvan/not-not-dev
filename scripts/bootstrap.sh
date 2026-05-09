#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "Pi does not appear to be installed."
  echo "Install it with: npm install -g @mariozechner/pi-coding-agent"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INSTALL_MCP_ADAPTER=1
INSTALL_PI_SUBAGENTS=1
INSTALL_CONTEXT_MODE=1
INSTALL_PI_WEB_ACCESS=1
INSTALL_GUARDRAILS=1
INSTALL_CONTEXT_RADAR=1
INSTALL_OPENROUTER=0

show_help() {
  cat <<'EOF'
Usage: ./scripts/bootstrap.sh [options]

Recommended defaults:
  - pi-mcp-adapter     direct MCP tool support (used here for Context7)
  - pi-subagents       focused scout/planner/worker/reviewer/oracle workflows
  - context-mode       better handling of large outputs, logs, and diffs
  - pi-web-access      web research, fetch helpers, and librarian-style research
  - guardrails         safety checks for risky commands and sensitive writes
  - context-radar      context pressure widget and status commands

Optional provider-specific add-on:
  - openrouter footer  footer/status integration for OpenRouter users

Options:
  --recommended            install the recommended default stack (default)
  --minimal                install only pi-mcp-adapter + guardrails
  --with-openrouter        also install the OpenRouter footer extension
  --without-mcp-adapter    skip pi-mcp-adapter
  --without-subagents      skip pi-subagents
  --without-context-mode   skip context-mode
  --without-pi-web-access  skip pi-web-access
  --without-guardrails     skip guardrails
  --without-context-radar  skip context-radar
  --without-openrouter     skip the OpenRouter footer extension
  -h, --help               show this help

Examples:
  ./scripts/bootstrap.sh
  ./scripts/bootstrap.sh --with-openrouter
  ./scripts/bootstrap.sh --minimal
  ./scripts/bootstrap.sh --without-context-mode
EOF
}

for arg in "$@"; do
  case "$arg" in
    --recommended)
      ;;
    --minimal)
      INSTALL_PI_SUBAGENTS=0
      INSTALL_CONTEXT_MODE=0
      INSTALL_PI_WEB_ACCESS=0
      INSTALL_CONTEXT_RADAR=0
      INSTALL_OPENROUTER=0
      ;;
    --with-openrouter)
      INSTALL_OPENROUTER=1
      ;;
    --without-mcp-adapter)
      INSTALL_MCP_ADAPTER=0
      ;;
    --without-subagents)
      INSTALL_PI_SUBAGENTS=0
      ;;
    --without-context-mode)
      INSTALL_CONTEXT_MODE=0
      ;;
    --without-pi-web-access)
      INSTALL_PI_WEB_ACCESS=0
      ;;
    --without-guardrails)
      INSTALL_GUARDRAILS=0
      ;;
    --without-context-radar)
      INSTALL_CONTEXT_RADAR=0
      ;;
    --without-openrouter)
      INSTALL_OPENROUTER=0
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo
      show_help
      exit 1
      ;;
  esac
done

echo "Installing not-not-dev Pi defaults..."
echo
printf '  %-18s %s\n' "mcp-adapter" "$([ "$INSTALL_MCP_ADAPTER" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "pi-subagents" "$([ "$INSTALL_PI_SUBAGENTS" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "context-mode" "$([ "$INSTALL_CONTEXT_MODE" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "pi-web-access" "$([ "$INSTALL_PI_WEB_ACCESS" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "guardrails" "$([ "$INSTALL_GUARDRAILS" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "context-radar" "$([ "$INSTALL_CONTEXT_RADAR" -eq 1 ] && echo on || echo off)"
printf '  %-18s %s\n' "openrouter-footer" "$([ "$INSTALL_OPENROUTER" -eq 1 ] && echo on || echo off)"
echo

if [ "$INSTALL_MCP_ADAPTER" -eq 1 ]; then
  "$SCRIPT_DIR/install-mcp-adapter.sh"
  echo
fi

if [ "$INSTALL_PI_SUBAGENTS" -eq 1 ]; then
  "$SCRIPT_DIR/install-package-pi-subagents.sh"
  echo
fi

if [ "$INSTALL_CONTEXT_MODE" -eq 1 ]; then
  "$SCRIPT_DIR/install-package-context-mode.sh"
  echo
fi

if [ "$INSTALL_PI_WEB_ACCESS" -eq 1 ]; then
  "$SCRIPT_DIR/install-package-pi-web-access.sh"
  echo
fi

if [ "$INSTALL_GUARDRAILS" -eq 1 ]; then
  "$SCRIPT_DIR/install-extension-guardrails.sh"
  echo
fi

if [ "$INSTALL_CONTEXT_RADAR" -eq 1 ]; then
  "$SCRIPT_DIR/install-extension-context-radar.sh"
  echo
fi

if [ "$INSTALL_OPENROUTER" -eq 1 ]; then
  "$SCRIPT_DIR/install-extension-openrouter.sh"
  echo
fi

echo "Bootstrap complete."
echo "Recommended next step: open Pi and run /reload"
echo
if [ "$INSTALL_GUARDRAILS" -eq 1 ]; then
  echo "Runtime toggles: /guardrails on|off|status"
fi
if [ "$INSTALL_CONTEXT_RADAR" -eq 1 ]; then
  echo "Runtime toggles: /context-radar on|off|status"
fi
if [ "$INSTALL_OPENROUTER" -eq 1 ]; then
  echo "Runtime toggles: /footer status, /footer edit, /footer reset"
fi
echo "Package toggles: rerun bootstrap with supported --without-* flags, or remove packages later with pi remove npm:<package>"
