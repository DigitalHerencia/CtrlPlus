# CtrlPlus Codex Workspace

This directory is the single source of truth for agent-facing workflow, environment bootstrap, and editor/tooling setup.

## Layout

- `config.toml`: project-scoped Codex runtime configuration.
- `instructions/project.md`: architecture, domain layout, and delivery expectations.
- `instructions/security.md`: security boundaries and action/query rules.
- `instructions/contributing.md`: branch, commit, validation, and review expectations.
- `instructions/operations.md`: local setup and operational runbooks for developers.
- `instructions/product.md`: concise product and authorization model.
- `instructions/visualizer.md`: visualizer-domain guardrails and asset direction.
- `templates/pull-request-template.md`: PR checklist mirror for agent workflows.
- `setup/bootstrap-windows.ps1`: local bootstrap for Windows/Codex/VS Code/CLI setup.
- `setup/doctor.ps1`: repeatable health check for repo, env, auth, and toolchain state.
- `setup/vscode-global-settings.jsonc`: safe global VS Code defaults for this stack.
- `setup/mcp.json`: VS Code MCP server definitions aligned with the Codex project config.

## Principles

- Keep agent workflow material in `.codex/`, not `.github/` or `docs/`.
- Keep end-user documentation in `docs/` only.
- Keep all internal developer docs, runbooks, implementation notes, and Codex instructions in `.codex/` only.
- Keep secrets in local environment files or OS/user environment variables only.
