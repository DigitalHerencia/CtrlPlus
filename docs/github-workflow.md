# GitHub Workflow: Labels, Board, and Template Readiness

This document defines the canonical label taxonomy for the repository and explains how to bootstrap labels so project boards and issue/PR templates can reference labels that already exist.

## Label taxonomy

Use labels from each category below when creating or triaging issues and pull requests.

### 1) Type labels

- `type:feature`
- `type:infra`
- `type:refactor`
- `type:security`
- `type:test`
- `type:docs`
- `type:bug`

### 2) Domain labels

- `domain:tenancy`
- `domain:auth`
- `domain:catalog`
- `domain:visualizer`
- `domain:scheduling`
- `domain:billing`
- `domain:admin`
- `domain:ci`

### 3) Scope labels

- `scope:backend`
- `scope:frontend`
- `scope:db`
- `scope:rsc`
- `scope:webhook`
- `scope:e2e`
- `scope:security`
- `scope:ci`
- `scope:docs`

### 4) Priority labels

- `p0`
- `p1`
- `p2`

### 5) Workflow labels

- `status:triage`

## Label application guidance

- Apply **at least one** `type:*` label.
- Apply **at least one** `domain:*` label.
- Apply **at least one** `scope:*` label.
- Apply **exactly one** priority label (`p0`, `p1`, `p2`).


## Prerequisite: GitHub CLI installation

`pnpm bootstrap:github` shells out to the `gh` binary and **does not** install GitHub CLI for you. Keep `gh` as a machine/runtime prerequisite, not an npm dependency in `package.json`.

Why:

- `gh` is an OS-level authenticated CLI, not a Node package runtime dependency.
- Installing it via package manager scripts in project code introduces platform-specific drift and security/maintainability overhead.
- CI and local developer machines should provision `gh` in the environment image/setup step.

For Codex or ephemeral environments, install `gh` in the environment bootstrap/settings layer before running governance commands.

## Governance bootstrap

Before enabling project board automations or issue/PR templates that reference labels, bootstrap governance assets from the canonical manifest/config files.

Canonical sources:

- `.github/task-manifest.json` (milestones + roadmap tasks)
- `.github/project-v2.json` (project metadata + custom field definitions)
- `.github/labels.json` (label taxonomy and descriptions)

### Option A: Repository command (recommended)

1. Authenticate and target the repository:

   ```bash
   gh auth login
   gh repo set-default <owner>/<repo>
   ```

2. Run the bootstrap command:

   ```bash
   pnpm bootstrap:github
   ```

3. Verify:

   ```bash
   gh label list
   gh issue list --limit 50
   gh project list --owner <owner> --limit 20
   ```

Board metadata from `.github/project-v2.json` (field definitions and labels) is bootstrapped by script. Runtime status movement and Codex routing are handled by GitHub Actions workflows.

### Option B: Labels-only sync

```bash
pnpm bootstrap:labels
```

## Roadmap governance

- `.github/task-manifest.json` is the source of truth for roadmap structure, milestone ordering, dependencies, and file-touch maps.
- Update milestone/task definitions in `.github/task-manifest.json` first, then sync GitHub issues/projects.

## Automated project flow

The repository enforces issue/PR progression through these workflows:

- `.github/workflows/codex-routing.yml`
- `.github/workflows/project-board-automation.yml`
- `.github/workflows/pr-template-guard.yml`

If your board is a **user-owned** Project v2, set repository secret `PROJECT_AUTOMATION_TOKEN` (PAT with `repo` + `project` scopes) so workflow updates can write board fields.

### Status transitions (Project v2 `Status` field)

- Issue opened/reopened/labeled:
  - `status:triage` -> `Backlog`
  - otherwise with assignee or `codex` label -> `In Progress`
  - otherwise -> `Ready`
- PR opened/reopened/synchronized:
  - draft PR -> `In Progress`
  - ready PR -> `In Review`
- PR merged or Issue closed -> `Done`
- PR closed without merge -> `Ready`

### Codex routing behavior

- Issues and PRs receive the `codex` label.
- Items are assigned to the default human assignee (`DigitalHerencia`) to keep queue ownership explicit.
- Workflows tag `@codex` in comments when reviewer assignment cannot be requested.

Important: `@codex` is an organization account on GitHub, so reviewer assignment APIs can fail unless you configure a collaborator account as the reviewer target.

### PR template enforcement

`pr-template-guard.yml` requires every PR body to include:

- `## Summary`
- `## Architecture / Security Checklist`
- `## Testing`
- An issue-closing reference, for example `Closes #123`
