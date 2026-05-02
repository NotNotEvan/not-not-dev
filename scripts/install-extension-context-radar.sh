#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/extensions/context-radar"
TARGET_DIR="${HOME}/.pi/agent/extensions"
TARGET_LINK="$TARGET_DIR/context-radar"

mkdir -p "$TARGET_DIR"
ln -sfn "$SOURCE_DIR" "$TARGET_LINK"

echo "Linked: $SOURCE_DIR"
echo "To:     $TARGET_LINK"
echo
echo "Next step: open Pi and run /reload"
