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

## Initial label bootstrap

Before enabling project board automations or issue/PR templates that reference labels, create the labels first.

### Option A: GitHub CLI (recommended)

1. Authenticate and target the repository:

   ```bash
   gh auth login
   gh repo set-default <owner>/<repo>
   ```

2. Run the bootstrap commands:

   ```bash
   # type labels
   gh label create "type:feature" --color "0E8A16" --description "New product functionality"
   gh label create "type:infra" --color "5319E7" --description "Infrastructure or platform work"
   gh label create "type:refactor" --color "1D76DB" --description "Behavior-preserving code improvements"
   gh label create "type:security" --color "B60205" --description "Security hardening or remediation"
   gh label create "type:test" --color "FBCA04" --description "Test additions or harness changes"
   gh label create "type:docs" --color "0075CA" --description "Documentation-only changes"
   gh label create "type:bug" --color "D73A4A" --description "Defect fix or regression"

   # domain labels
   gh label create "domain:tenancy" --color "C2E0C6" --description "Tenant resolution and data isolation"
   gh label create "domain:auth" --color "C5DEF5" --description "Authentication and authorization"
   gh label create "domain:catalog" --color "E4E669" --description "Catalog and wrap inventory"
   gh label create "domain:visualizer" --color "FEF2C0" --description "Wrap preview and visualizer"
   gh label create "domain:scheduling" --color "D4C5F9" --description "Booking and slot availability"
   gh label create "domain:billing" --color "F9D0C4" --description "Payments, invoices, and Stripe"
   gh label create "domain:admin" --color "BFDADC" --description "Admin console and internal ops"
   gh label create "domain:ci" --color "24292E" --description "CI/CD and delivery automation"

   # scope labels
   gh label create "scope:backend" --color "0366D6" --description "Server-side changes"
   gh label create "scope:frontend" --color "0052CC" --description "Client-side UI changes"
   gh label create "scope:db" --color "006B75" --description "Data model and migrations"
   gh label create "scope:rsc" --color "5319E7" --description "React Server Components surface"
   gh label create "scope:webhook" --color "B60205" --description "Webhook endpoints and processors"
   gh label create "scope:e2e" --color "FBCA04" --description "End-to-end test coverage"
   gh label create "scope:security" --color "D93F0B" --description "Security boundary hardening"
   gh label create "scope:docs" --color "0E8A16" --description "Documentation scope"

   # priority labels
   gh label create "p0" --color "B60205" --description "Critical priority"
   gh label create "p1" --color "D93F0B" --description "High priority"
   gh label create "p2" --color "FBCA04" --description "Normal priority"

   # workflow labels
   gh label create "status:triage" --color "D4C5F9" --description "Awaiting triage"
   ```

3. Verify:

   ```bash
   gh label list
   ```

## Roadmap governance

- `task-manifest.json` is the source of truth for roadmap structure, milestone ordering, dependencies, and file-touch maps.
- Update milestone/task definitions in `task-manifest.json` first, then sync GitHub issues/projects.
