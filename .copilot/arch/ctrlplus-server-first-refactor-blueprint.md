---
title: CtrlPlus Server-First Refactor Blueprint
version: 1.0
date_created: 2026-03-29
last_updated: 2026-03-29
owner: Copilot
tags:
  - architecture
  - refactor
  - server-first
---

# Purpose

This file normalizes the external architecture blueprint into a repo-local reference that agents can use during the `app`, `features`, and `components` refactor program.

## Non-Negotiable Layer Rules

- `app/**` owns route shells and Next.js conventions only.
- `features/**` own page orchestration and interaction containers.
- `components/**` own reusable presentational blocks.
- `components/ui/**` own shadcn primitives only.
- `lib/fetchers/**` own read authority.
- `lib/actions/**` own write authority.
- `schemas/**` own runtime validation.
- `types/**` own DTO and client/server boundary contracts.
- `prisma/**` remains the canonical data model.

## Current Repo Snapshot

The repo already has the required top-level directories, but the implementation is only partially normalized:

- `app/(tenant)` contains `admin`, `billing`, `catalog`, `platform`, `scheduling`, `settings`, and `visualizer`.
- `features/**` exists per domain, but naming is mixed and some features are still broad orchestration buckets.
- `components/**` exists per domain, but naming is mixed and some pieces still imply workflow ownership rather than pure presentation.
- `lib/**` already follows the intended fetcher/action/select/transaction split well.
- `.copilot/**` was effectively empty before this scaffold.

## Target Refactor Outcomes

- Thin every route page so it delegates to a single page feature.
- Standardize feature naming around `*-page-feature.tsx` and `*.client.tsx`.
- Move shared rendering out of features and into domain or shared components.
- Preserve server-only auth, authz, cache, upload, and provider boundaries.
- Use explicit docs, contracts, and execution state so the refactor can run in waves without losing context.

## Known Naming Tensions

- The live repo uses `billing` while the source blueprint sometimes speaks in `invoices` terms.
- The live repo uses route params like `[id]` in some areas while the blueprint prefers entity-specific names such as `[wrapId]` or `[bookingId]`.
- Existing component names use both PascalCase and kebab-case patterns.

These are migration decisions, not reasons to violate boundaries.

## Refactor Waves

1. Establish docs, contracts, prompts, and execution tracking.
2. Normalize route shells and route parameter naming plans without breaking runtime behavior.
3. Normalize `features/**` into thin page features and explicit client containers.
4. Normalize `components/**` into reusable presentational blocks and shared shells.
5. Align tests, loading states, error states, and validation coverage with the new structure.

## Acceptance Direction

The refactor is only complete when architectural decisions are represented in three places:

- markdown for durable explanation
- YAML for stable contracts
- JSON for active execution state
