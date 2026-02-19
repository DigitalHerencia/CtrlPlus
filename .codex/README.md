# `.codex` Folder

This directory is reserved for repository-local Codex configuration and temporary/generated artifacts.

## Canonical instruction files

- `AGENTS.md` (repo root)
- `PLANS.md` (repo root)

## Expected contents

- `.codex/config.toml`: repository-local Codex defaults.
- `.codex/artifacts/` and `.codex/tmp/`: optional local outputs (gitignored).

Keep long-lived engineering policy and project requirements in `docs/`, not in `.codex/`.
