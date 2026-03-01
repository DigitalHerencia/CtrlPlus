# `.codex` Developer Workspace

This directory is the repository home for developer-facing documentation, manifests, scripts, and Codex-local artifacts.

## Structure

- `.codex/config.toml`: project-scoped Codex overrides (including multi-agent roles).
- `.codex/agents/`: role-specific agent configuration files.
- `.codex/docs/`: flattened internal engineering docs optimized for Codex load order.
- `.codex/manifests/`: machine-readable manifests and governance config.
- `.codex/scripts/`: setup/bootstrap/maintenance scripts.
- `.codex/rules/`: Codex execution-policy rules (`*.rules`) for out-of-sandbox command control.
- `.codex/TODO.md`: non-canonical execution tracker.

## Canonical policy sources

- `AGENTS.md` (repo root)
- `PLANS.md` (repo root)
- `.codex/docs/00-index.md`
- `.codex/docs/20-architecture.md`
- `.codex/docs/40-quality-gates.md`
