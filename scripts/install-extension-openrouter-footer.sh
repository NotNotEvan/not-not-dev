#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_FILE="$ROOT_DIR/extensions/openrouter-footer.ts"
TARGET_DIR="${HOME}/.pi/agent/extensions"
TARGET_FILE="$TARGET_DIR/openrouter-footer.ts"

mkdir -p "$TARGET_DIR"
ln -sf "$SOURCE_FILE" "$TARGET_FILE"

echo "Linked: $SOURCE_FILE"
echo "To:     $TARGET_FILE"
echo
echo "Next step: open Pi and run /reload"
