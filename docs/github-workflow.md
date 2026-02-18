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

Note: GitHub does not currently expose full CLI automation for project views and rules, so board views/automation from `.github/project-v2.json` should be mirrored manually in the project UI.

### Option B: Labels-only sync

```bash
pnpm bootstrap:labels
```

## Roadmap governance

- `.github/task-manifest.json` is the source of truth for roadmap structure, milestone ordering, dependencies, and file-touch maps.
- Update milestone/task definitions in `.github/task-manifest.json` first, then sync GitHub issues/projects.
