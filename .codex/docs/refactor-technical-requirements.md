---
title: CtrlPlus Server-First Refactor Technical Requirements
status: Draft
owner: Codex
last_updated: 2026-03-29
source_documents:
  - C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md
---

# CtrlPlus Server-First Refactor Technical Requirements

## Objective

Translate the architecture blueprint into explicit technical requirements that can govern a staged refactor of `app/`, `features/`, and `components/` while preserving existing server-side authority.

## Current Repo Observations

- `app/` already uses route groups for `(auth)` and `(tenant)` plus `api/` boundaries.
- `features/` already contains domain page features and several client orchestration modules.
- `components/` already contains domain folders, shared UI blocks, and `components/ui/` primitives.
- The repo-level `AGENTS.md` already treats `app/**` as orchestration-only and keeps Prisma behind server boundaries.
- `.codex/` previously contained only profile artifacts and no program-level guidance.

## Technical Requirements

### TR-001 Route Layer

- `app/**` files must stay thin and route-focused.
- `page.tsx` files should primarily parse params, handle route-level gating, and delegate to feature entrypoints.
- `route.ts` files should remain HTTP or webhook boundaries and should not absorb domain orchestration.

### TR-002 Feature Layer

- `features/**` is the orchestration layer for page assembly, client interactivity, and view-level composition.
- Feature modules may depend on fetchers, types, schemas, and reusable components.
- Feature modules must not import Prisma directly.

### TR-003 Component Layer

- `components/<domain>/**` must be reusable UI blocks that accept already-shaped data.
- `components/shared/**` should hold cross-domain shells and common layout blocks.
- `components/ui/**` remains primitive-only and must not absorb domain semantics.

### TR-004 Server Authority

- All database reads remain behind fetcher boundaries.
- All database writes remain behind action boundaries.
- Auth, tenancy, ownership, capability checks, and external provider logic stay on the server.

### TR-005 Validation and Contracts

- Mutation inputs remain validated with Zod or equivalent existing schemas.
- DTOs remain explicit and transport-safe.
- Refactor decisions that change durable behavior must be reflected in markdown and YAML before code execution expands scope.

### TR-006 Refactor Program Control

- Work must be executed by stable task IDs and workstream IDs.
- JSON execution artifacts must record status, blockers, and percent complete.
- Future passes must not skip artifact maintenance when execution state changes.

## Migration Notes

- The blueprint uses some broader target names, including invoice-oriented examples. The current repo uses `billing` as the active domain name; this scaffold preserves current naming unless a future approved migration changes it.
- The refactor should favor incremental layer corrections over large speculative moves.

## Verification Requirements

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

## Deliverables

- `.codex` markdown docs for intent and architecture
- `.codex` YAML contracts for boundaries and workstreams
- `.codex` JSON execution files for backlog and progress
- Future refactor passes aligned to those artifacts
