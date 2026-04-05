# Contributing

## Scope

- Keep changes bounded and production-oriented.
- Preserve server-first architecture and repo layer boundaries.
- Do not mix runtime code refactors with unrelated janitorial edits unless the hygiene work is the task.

## Branches and Commits

- Use a short-lived branch for each scoped change.
- Prefer conventional commits.
- Keep PRs reviewable and easy to validate.

## Before Opening a PR

Run the smallest relevant checks first, then broader checks when the change warrants them:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Documentation

- Put end-user and operational product docs in `docs/`.
- Put internal engineering workflow, contracts, prompts, and execution state in `.agents/`.
- Keep `AGENTS.md` and `.github/copilot-instructions.md` aligned when repo-wide rules change.

## Architecture Expectations

- `app/**` stays thin.
- `features/**` owns orchestration.
- `components/**` owns reusable UI.
- `components/ui/**` owns primitives only.
- `lib/**`, `schemas/**`, `types/**`, and `prisma/**` remain server-authoritative boundaries.

## Pull Requests

- Use the pull request template.
- Call out auth, billing, data, migration, or rollback risk explicitly.
- Note exactly which checks were run.
