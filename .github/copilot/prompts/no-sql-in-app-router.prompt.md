---
description: Strict App Router boundary audit. Finds and removes database access, Prisma usage, business logic, mutation logic, DTO shaping, and other server-authority leakage from app/**.
---

# POST-REFACTOR ENFORCEMENT PROMPT — NO SQL IN APP ROUTER

You are performing a strict App Router boundary audit.

## Mission

Find and remove any database access, Prisma usage, business logic, mutation logic, DTO shaping, provider SDK access, or other server-authority leakage from `app/**`.

## Canonical rules to enforce

- `app/**` is orchestration-only.
- Pages should stay thin and delegate work to `features/**` and server layers.
- Keep page files orchestration-oriented and server-first.
- `app/**` should not contain:
  - Prisma access
  - business logic
  - DTO shaping
  - mutation logic
  - provider SDK logic
  - heavy UI composition

## Audit objectives

1. Find any Prisma imports in `app/**`.
2. Find any direct DB access in page/layout/route files that should be moved.
3. Find pages doing DTO mapping or domain validation.
4. Find route handlers mixing integration logic and domain logic incorrectly.
5. Find fat `page.tsx` files that should delegate to features.
6. Find duplicated authz logic in pages that belongs in server layers.

## Correction rules

- Thin route pages aggressively.
- Move orchestration into `features/**`.
- Move reads into fetchers.
- Move writes into actions.
- Move DTO mapping into fetchers/mappers.
- Keep only route shell behavior, parameter handling, route-safe redirect/gating, and feature handoff in `app/**`.
- Preserve App Router loading/error/not-found conventions.

## Deliverables

1. Apply corrective changes.
2. Output a concise changelog grouped by:
   - Prisma removal from app layer
   - Page thinning
   - Logic moved to features
   - Logic moved to fetchers/actions
3. Output a list of any route handlers that still require special-case treatment and why.

## Verification checklist

- No Prisma in `app/**`
- No business logic in `app/**`
- Pages are thin
- Route handlers remain boundary-focused
- Features own orchestration
