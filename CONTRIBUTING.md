# Contributing

## Branch & Commit Conventions

- Branch names: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`
- Conventional commit scopes: `admin`, `auth`, `billing`, `catalog`, `docs`, `platform`, `scheduling`, `settings`, `visualizer`, `ci`

## Architecture Expectations

- Keep Prisma access in `lib/*` domain modules.
- Use DTO return types from fetchers.
- Keep actions in security pipeline order: `auth -> authorize -> validate -> mutate -> audit`.
- Prefer RSC by default; use client components only when needed.

## Authorization Rules

- Roles are `customer`, `owner`, `admin`.
- Do not accept role/ownership scope from client input.
- Owner/admin IDs are env-configured, not configured through UI.

## Pull Request Checklist

- [ ] Typecheck passes (`pnpm tsc --noEmit`)
- [ ] Lint/test pass for changed areas
- [ ] No Prisma imports in `app/**` except webhook handlers
- [ ] Ownership checks are server-enforced for customer data
- [ ] Mutations include audit logging where required
