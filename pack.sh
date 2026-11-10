#!/usr/bin/env bash
# Zip the YouTrack app package (manifest at zip root). Not a long-running process.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="${ROOT}/../feedback1-youtrack-app.zip"
cd "$ROOT"
rm -f "$OUT"
zip -q -r "$OUT" manifest.json settings.json icon.svg entity-extensions.json backend.js push-state.js widgets
echo "Wrote $OUT"
