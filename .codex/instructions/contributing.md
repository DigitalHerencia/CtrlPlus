# Contributing

## Branching

- Use `codex/<topic>` for Codex-created branches.
- Keep changes scoped and validation-ready.

## Commit and Review

- Use conventional commits when possible.
- Review for regressions first: auth, ownership, soft deletes, DTO boundaries, tests.

## Validation

Run before handoff when relevant:

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm prisma:validate`
- `pnpm build`

## Pull Requests

Reference `.codex/templates/pull-request-template.md` for the current PR checklist.

## Documentation Rules

- Put end-user docs only in `/docs`.
- Put all internal developer and Codex docs in `.codex/`.
