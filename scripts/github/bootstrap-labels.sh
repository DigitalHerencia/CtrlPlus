#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to bootstrap labels." >&2
  exit 1
fi

node scripts/github/bootstrap-governance.mjs --labels-only "$@"
