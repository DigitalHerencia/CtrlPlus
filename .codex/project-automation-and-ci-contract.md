# Project Automation and CI Contract

_Generated: 2026-03-13 (America/Los_Angeles)_

## Program Baseline
- Program: `PS1` Ship-readiness Program (`#219`), status `OPEN`.
- Project item linkage is not accessible with current token scope.
- Guardrail: keep existing `.toml` deletions untouched; do not create new `.toml` files.

## CI Workflow Contract ([ci.yml](D:/CtrlPlus/.github/workflows/ci.yml))
- Triggers: `pull_request`, `push` on `main` and `develop`.
- Concurrency: `ci-${{ github.ref }}`, cancel in progress = `true`.
- Job 1 `fast-quality`: `pnpm ci:quality`.
- Job 2 `domain-e2e` depends on `fast-quality`.
- E2E preflight: `pnpm exec playwright install --with-deps chromium`.
- E2E run: `pnpm test:e2e --project=chromium --reporter=line`.

## PR Template Contract ([PULL_REQUEST_TEMPLATE.md](D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md))
- Required closure marker: `Closes #<issue>`.
- Required sections: Description, Related Issues, Type of Change, Changes Made, Testing, Screenshots, Security Checklist, Code Quality Checklist, Additional Context.
- Security checklist requires: no Prisma in `app/**`, fetchers/actions separation, server-side ownership/authz, Zod validation, no client-supplied scope trust.
- Code quality checklist requires explicit pass for: `pnpm typecheck`, `pnpm prisma:validate`, `pnpm build`, `pnpm lint`, `pnpm format:check`, `pnpm test`.

## Issue Template and Label Automation Contract
- [bug_report.md](D:/CtrlPlus/.github/ISSUE_TEMPLATE/bug_report.md): defaults `labels: bug`.
- [feature_request.md](D:/CtrlPlus/.github/ISSUE_TEMPLATE/feature_request.md): defaults `labels: enhancement`.
- [config.yml](D:/CtrlPlus/.github/ISSUE_TEMPLATE/config.yml): `blank_issues_enabled: true`; includes discussion/security contact links.
- [labeler.yml](D:/CtrlPlus/.github/labeler.yml): auto-applies `domain:*` labels based on changed paths (catalog, visualizer, scheduling, billing, admin, auth, settings, platform, ci).
- Existing label taxonomy to use: `type:*`, `domain:*`, `scope:*`, `codex`, `documentation`, plus default GitHub labels.

## Validation Checklist
- Inventory parity: `gh issue list --repo DigitalHerencia/CtrlPlus --state open --limit 200` contains #219-#249.
- Prompt parity: 31 prompts exist, one per issue #219-#249.
- Contract parity: doc values match `ci.yml`, PR template, issue templates, and labeler config.

