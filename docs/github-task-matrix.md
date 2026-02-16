# GitHub Task Matrix — WrapWorks Multi-Tenant Platform

This planning matrix is the canonical decomposition for milestones, project-board mapping, and issue creation.

## Milestones

1. Core Infrastructure & Tenancy
2. Wrap Catalog & RSC Foundation
3. Visualizer Engine
4. Scheduling Engine
5. Billing & Stripe
6. Admin Console
7. Testing & CI/CD Hardening
8. Security & Performance Hardening

## Labels

### Type

- `type:feature`
- `type:infra`
- `type:refactor`
- `type:security`
- `type:test`
- `type:docs`

### Domain

- `domain:tenancy`
- `domain:auth`
- `domain:catalog`
- `domain:visualizer`
- `domain:scheduling`
- `domain:billing`
- `domain:admin`
- `domain:ci`

### Scope

- `scope:backend`
- `scope:frontend`
- `scope:db`
- `scope:rsc`
- `scope:webhook`
- `scope:e2e`

### Priority

- `p0`
- `p1`
- `p2`

## Project Board

### Columns

- Backlog
- Ready
- In Progress
- In Review
- Blocked
- Done

### Custom Fields

- Domain
- Risk Level
- Requires Migration
- Requires E2E

## PR Checklist

- [ ] No Prisma usage inside `app/`
- [ ] Tenant isolation enforced
- [ ] Auth + permission validated server-side
- [ ] Zod validation added (if input)
- [ ] Unit tests added
- [ ] Integration tests added (if DB involved)
- [ ] E2E updated (if user flow affected)
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] No `console.log`s

## Execution Order

1. Milestone 1 — Infrastructure
2. Milestone 2 — Catalog
3. Milestone 3 — Visualizer (template first)
4. Milestone 4 — Scheduling
5. Milestone 5 — Billing
6. Milestone 7 — CI/Test hardening
7. Milestone 8 — Security polish
