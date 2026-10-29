#!/usr/bin/env bash
# Regenerate extension/content.js from the userscript (the source of truth).
# Remember to bump @version in the userscript and "version" in manifest.json together.
set -euo pipefail
cd "$(dirname "$0")"
src=../iitm-placement-enhancer.js
{
  echo '// IITM Placement Portal — Clean Dashboard (extension build)'
  echo '// Generated from iitm-placement-enhancer.js by build.sh — edit the userscript, not this file.'
  sed '1,/^\/\/ ==\/UserScript==/d' "$src"
} > content.js
v=$(grep -m1 '@version' "$src" | awk '{print $3}')
m=$(grep -m1 '"version"' manifest.json | sed -E 's/.*"version": *"([^"]+)".*/\1/')
[ "$v" = "$m" ] || echo "warning: userscript is v$v but manifest.json is v$m" >&2
