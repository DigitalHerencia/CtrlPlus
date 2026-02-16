# GitHub Workflow: Labels, Board, and Template Readiness

This document defines the canonical label taxonomy for the repository and explains how to bootstrap labels so project boards and issue/PR templates can reference labels that already exist.

## Canonical set decision

We are **keeping the existing canonical prefixed taxonomy** (`type:*`, `domain:*`, `scope:*`, `p*`) and aligning all templates and automation rules to it.

Rationale:

- It is already documented as repository source of truth.
- It is more scalable than flat labels (`bug`, `feature`, `infra`, `triage`) because each concern has a namespace.
- It supports matrix-based triage (type × domain × scope × priority) without introducing duplicate semantic labels.

## Label taxonomy

Use labels from each category below when creating or triaging issues and pull requests.

### 1) Type labels

These labels describe the nature of the work item.

- `type:feature` — new product functionality.
- `type:bug` — defect fixes and regressions.
- `type:infra` — infrastructure, platform, CI/CD, and environment changes.
- `type:refactor` — behavior-preserving code improvements.
- `type:docs` — documentation-only work.
- `type:test` — test coverage additions or test harness updates.
- `type:security` — security hardening, vulnerability remediation, and trust-boundary fixes.

### 2) Domain labels

These labels identify the product/domain area impacted.

- `domain:tenancy` — tenant resolution, tenant scoping, isolation checks.
- `domain:auth` — authentication and authorization/RBAC.
- `domain:billing` — Stripe, invoices, payments, subscriptions.
- `domain:scheduling` — slot calculation, booking, availability.
- `domain:visualizer` — wrap preview generation and related UX.
- `domain:notifications` — email, webhook notifications, messaging.
- `domain:platform` — cross-cutting platform capabilities and shared infrastructure.

### 3) Scope labels

These labels indicate the technical surface area of the change.

- `scope:backend` — server actions, fetchers, DB interactions, route handlers.
- `scope:frontend` — client UI, interactions, component behavior.
- `scope:rsc` — React Server Components and App Router server rendering flow.
- `scope:db` — schema/migrations/data model concerns.
- `scope:ci` — pipelines, quality gates, release automation.
- `scope:docs` — repository/process/architecture documentation.

### 4) Priority labels

Use one priority label per issue.

- `p0` — critical, production-impacting, immediate response.
- `p1` — high priority, should be addressed in the current cycle.
- `p2` — normal priority, can be planned in upcoming cycles.

### 5) Workflow labels

These labels track queue/triage state and are safe defaults for templates.

- `status:triage` — newly created item awaiting initial triage.

## Label application guidance

- Apply **at least one** label from: `type:*`.
- During triage, add **at least one** label from each of: `domain:*` and `scope:*`.
- Apply **exactly one** of: `p0`, `p1`, `p2`.
- Prefer smaller, specific label sets over broad tagging.
- Keep label names stable; templates and board automations depend on exact spelling.

## Initial label bootstrap

Before enabling project board automations or issue/PR templates that reference labels, create the labels first.

### Option A: GitHub CLI (recommended)

1. Authenticate and target the repository:

   ```bash
   gh auth login
   gh repo set-default <owner>/<repo>
   ```

2. Run the bootstrap commands (safe to run once for a new repo):

   ```bash
   # type labels
   gh label create "type:feature" --color "0E8A16" --description "New product functionality"
   gh label create "type:bug" --color "D73A4A" --description "Defect fix or regression"
   gh label create "type:infra" --color "5319E7" --description "Infrastructure or platform work"
   gh label create "type:refactor" --color "1D76DB" --description "Behavior-preserving code improvements"
   gh label create "type:docs" --color "0075CA" --description "Documentation-only changes"
   gh label create "type:test" --color "FBCA04" --description "Test additions or harness changes"
   gh label create "type:security" --color "B60205" --description "Security hardening or remediation"

   # domain labels
   gh label create "domain:tenancy" --color "C2E0C6" --description "Tenant resolution and data isolation"
   gh label create "domain:auth" --color "C5DEF5" --description "Authentication and authorization"
   gh label create "domain:billing" --color "F9D0C4" --description "Payments, invoices, subscriptions"
   gh label create "domain:scheduling" --color "D4C5F9" --description "Booking and slot availability"
   gh label create "domain:visualizer" --color "FEF2C0" --description "Wrap preview and visualizer"
   gh label create "domain:notifications" --color "BFDADC" --description "Email and notification flows"
   gh label create "domain:platform" --color "E4E669" --description "Shared platform concerns"

   # scope labels
   gh label create "scope:backend" --color "0366D6" --description "Server-side changes"
   gh label create "scope:frontend" --color "0052CC" --description "Client-side UI changes"
   gh label create "scope:rsc" --color "5319E7" --description "React Server Components surface"
   gh label create "scope:db" --color "006B75" --description "Data model and migrations"
   gh label create "scope:ci" --color "24292E" --description "CI/CD and automation"
   gh label create "scope:docs" --color "0E8A16" --description "Documentation scope"

   # priority labels
   gh label create "p0" --color "B60205" --description "Critical priority"
   gh label create "p1" --color "D93F0B" --description "High priority"
   gh label create "p2" --color "FBCA04" --description "Normal priority"

   # workflow labels
   gh label create "status:triage" --color "D4C5F9" --description "Awaiting triage"
   ```

3. If some labels already exist, update instead of create:

   ```bash
   gh label edit "type:feature" --color "0E8A16" --description "New product functionality"
   ```

4. Verify:

   ```bash
   gh label list
   ```

### Option B: GitHub UI

1. Navigate to **Repository → Issues → Labels**.
2. Click **New label** and create each label from this document.
3. Confirm exact names match (including prefix and casing).
4. After creation, verify templates and board rules map correctly.

## Board/template dependency check

After labels are created:

1. Create a test issue from each issue template.
2. Confirm default labels apply without errors.
3. Move the issue through board columns to confirm automation rules keyed by labels work.
4. Remove the test issue when done.

## Label migration map

Use this map when normalizing older issues/automation rules.

| Old label | New canonical label |
| --- | --- |
| `feature` | `type:feature` |
| `bug` | `type:bug` |
| `infra` | `type:infra` |
| `triage` | `status:triage` |

## Matrix coverage verification

Every issue can be represented with only canonical labels from this document.

Required matrix dimensions:

- Type: one of `type:*`.
- Domain: one of `domain:*`.
- Scope: one of `scope:*`.
- Priority: one of `p0`, `p1`, `p2`.

Example canonical matrix combinations:

- Bug in scheduling server logic: `type:bug`, `domain:scheduling`, `scope:backend`, `p1`.
- Visualizer UI enhancement: `type:feature`, `domain:visualizer`, `scope:frontend`, `p2`.
- CI hardening task: `type:infra`, `domain:platform`, `scope:ci`, `p2`.
- Security fix for tenancy checks: `type:security`, `domain:tenancy`, `scope:backend`, `p0`.

## Maintenance

- Treat this file as the source of truth for label names.
- If adding a new label, update this document and any issue/PR templates in the same PR.
- Avoid renaming labels unless all dependent board automations/templates are updated simultaneously.

## Roadmap governance (authoritative planning model)

- `task-manifest.json` is the single source of truth for roadmap structure, milestone ordering, dependencies, and file-touch maps.
- Edit roadmap data **only** in `task-manifest.json`; do not hand-edit milestone/task data directly in GitHub issues or project fields.
- Task IDs in GitHub must use canonical manifest IDs (for example, `TEN-001`), while `legacy_ids` can be kept in issue body context when migrating from older matrix numbering.

### Syncing GitHub issues and project fields from the manifest

1. For each task in `task-manifest.json`, create or update one GitHub issue with:
   - issue title from `title`
   - canonical ID prefix from `id`
   - dependency checklist from `depends_on`
   - implementation checklist from `file_map`
2. Set project fields from task metadata:
   - `Requires Migration` = `Yes` when `requires_migration` is `true`, otherwise `No`
   - `Requires E2E` = `Yes` when `requires_e2e` is `true`, otherwise `No`
   - `Domain` from the task ID prefix (`TEN`, `AUTH`, `VIS`, `BILL`, etc.)
3. Place each issue in the milestone declared by the manifest and preserve manifest `milestone_order` when sequencing delivery.
4. If a GitHub issue field conflicts with the manifest, update GitHub to match the manifest in the same change window.
