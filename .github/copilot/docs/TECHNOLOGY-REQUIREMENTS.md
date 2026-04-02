## Technology stack matrix

| Area            | Requirement                                             |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js App Router (server-first)                       |
| Language        | TypeScript (strict typing, no implicit unsafe patterns) |
| Runtime         | Node.js-compatible runtime for Next.js and tooling      |
| UI              | React + Tailwind + shared `components/ui` primitives    |
| Auth            | Clerk                                                   |
| Database        | PostgreSQL via Prisma                                   |
| Billing         | Stripe                                                  |
| Media/AI        | Cloudinary + Hugging Face integration paths             |
| Testing         | Vitest + Playwright                                     |
| Package manager | pnpm                                                    |

## Compatibility and decision rules

### Framework and routing

- Use Next.js App Router patterns consistently.
- Keep page files orchestration-oriented and server-first.

### Type safety and validation

- Validate mutation input using Zod schemas from `schemas/**`.
- Keep DTO and API shapes in `types/**`.

### Data access

- Reads must run through `lib/fetchers/{domain}`.
- Writes must run through `lib/actions/{domain}`.
- Avoid Prisma usage in route UI or client components.

### Dependency choices

- Prefer existing libraries already used in the repo.
- Introduce new libraries only when they provide clear value and fit current architecture.
- Avoid duplicating capabilities already covered by existing stack.

## Upgrade requirements

When upgrading packages:

1. Verify compatibility with Next.js App Router and current React version.
2. Validate Prisma and migration safety before schema-affecting changes.
3. Re-run quality gates after upgrades.

## Required quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Troubleshooting version conflicts

- Resolve lockfile drift before broad dependency updates.
- Upgrade in small, reviewable batches by domain impact.
- Prefer official migration/codemod paths for major upgrades.
