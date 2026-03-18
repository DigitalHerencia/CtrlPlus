# CtrlPlus Technical Requirements

## Stack constraints

- Next.js App Router
- React 19
- TypeScript
- Clerk auth
- Prisma ORM
- Neon Postgres
- Stripe
- existing repo fetcher/action architecture
- existing shadcn/ui primitives in `components/ui/**`

## Required architectural rules

- no Prisma imports in `app/**`
- reads only through `lib/{domain}/fetchers/**`
- writes only through `lib/{domain}/actions/**`
- auth and ownership checks server-side
- input validation for all mutations
- Server Components first
- client components only for interactive UI

## Security requirements

- enforce capability and ownership checks server-side
- do not trust client scope identifiers
- validate uploads and external provider inputs
- keep webhook handling idempotent and auditable
- protect sensitive operational actions

## Performance requirements

- avoid duplicate queries and oversized payloads
- prefer targeted revalidation and cache-aware reads
- keep blocking long-running tasks out of critical UI paths when practical
- minimize client state duplication

## UI requirements

- professional, production-ready SaaS quality
- explicit loading, empty, error, success, and denied states
- accessible forms, tables, cards, badges, dialogs, and navigation
- strong information hierarchy

## Testing requirements

At minimum preserve or improve:

- lint
- typecheck
- prisma validate
- build
- unit/integration coverage for changed domain logic
- Playwright domain smoke coverage for affected flows

## Done criteria

Work is complete only when:

- implementation follows repo boundaries
- tests are updated where needed
- CI expectations remain satisfied
- security checklist items in existing PR template remain true
- behavior is documented where contracts or workflows changed
