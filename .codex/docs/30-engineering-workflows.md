# Engineering Workflows

This document consolidates GitHub governance flow and multi-agent execution flow.

## GitHub Governance

Canonical machine-readable sources:

- `.codex/manifests/github/labels.json`
- `.codex/manifests/github/project-v2.json`
- `.codex/manifests/github/task-manifest.json`

### Label taxonomy

Type labels:

- `type:feature`
- `type:infra`
- `type:refactor`
- `type:security`
- `type:test`
- `type:docs`
- `type:bug`

Domain labels:

- `domain:tenancy`
- `domain:auth`
- `domain:catalog`
- `domain:visualizer`
- `domain:scheduling`
- `domain:billing`
- `domain:admin`
- `domain:ci`

Scope labels:

- `scope:backend`
- `scope:frontend`
- `scope:db`
- `scope:rsc`
- `scope:webhook`
- `scope:e2e`
- `scope:security`
- `scope:ci`
- `scope:docs`

Priority labels:

- `p0`
- `p1`
- `p2`

Workflow labels:

- `status:triage`

### Label usage minimums

- At least one `type:*` label.
- At least one `domain:*` label.
- At least one `scope:*` label.
- Exactly one priority label.

### Bootstrap commands

1. `gh auth login`
2. `gh repo set-default <owner>/<repo>`
3. `pnpm bootstrap:github`

## Project Automation

Expected workflow files:

- `.github/workflows/codex-routing.yml`
- `.github/workflows/codex-review-gate.yml`
- `.github/workflows/project-board-automation.yml`
- `.github/workflows/pr-template-guard.yml`

If using a user-owned project board, configure `PROJECT_AUTOMATION_TOKEN` with `repo` + `project` scopes.

## Multi-Agent Workflow

Agent definitions are in `.codex/config.toml` and `.codex/agents/*.toml`.

Recommended sequence for substantial tasks:

1. `scout` for impact mapping and risk identification.
2. `implement` for code changes.
3. `security` for tenancy/authz/webhook review.
4. `qa` for lint/typecheck/tests.
5. `review` for final regression and test-gap check.

Fast-path for small bugs:

1. `scout`
2. `implement`
3. `review`

Prompt template:

`agent {"role":"<role>","prompt":"Task: <goal>. Constraints: no Prisma in app/, tenant resolved server-side, reads in fetchers, writes in actions, add tests."}`
