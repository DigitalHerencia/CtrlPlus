# Copilot Delegation Prompt — Catalog

Goal: implement catalog.issue.md.

## Subagents

repo-research

Inspect:

- app/(tenant)/catalog
- components/catalog
- lib/catalog

asset-agent

Ensure deterministic asset role resolution.

ui-agent

Refactor browsing UI:

- WrapGrid
- WrapCard
- WrapFilter

manager-agent

Improve manager workflow:

- CatalogManager
- WrapImageManager

security-agent

Validate uploads and permissions.

## Skills

- refactor
- domain fetchers/actions
- security review

## Completion

- catalog manager workflow improved
- publish validation UX improved
- tests passing
