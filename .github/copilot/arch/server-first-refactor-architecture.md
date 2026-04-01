---
title: CtrlPlus Server-First Refactor Architecture Map
status: Draft
owner: Copilot
last_updated: 2026-03-29
source_documents:
  - C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md
---

# CtrlPlus Server-First Refactor Architecture Map

## Intent

This document adapts the architecture blueprint to the current CtrlPlus repo. It is not a replacement for the full blueprint; it is the repo-local architecture summary that future refactor passes should consult first.

## Target Layer Model

```text
app/        -> route shells only
features/   -> page and interaction orchestration
components/ -> reusable domain and shared UI blocks
components/ui/ -> shadcn primitives only
lib/        -> server truth for reads, writes, auth, integrations, cache, uploads
schemas/    -> runtime validation
types/      -> DTOs and client/server contracts
prisma/     -> canonical data model
```

## Repo-Local Domain Surface

- `auth`
- `admin`
- `billing`
- `catalog`
- `platform`
- `scheduling`
- `settings`
- `visualizer`

## Refactor Focus Areas

### `app/`

- Thin route shells
- Clear loading, error, and not-found boundaries
- No direct Prisma or heavy domain logic

### `features/`

- Consistent page entrypoints
- Consistent `*.client.tsx` naming for route-local interactivity
- Clear separation between server composition and client state

### `components/`

- Domain blocks accept shaped data and callbacks
- Shared blocks stay generic
- Primitive layer stays isolated in `components/ui/`

### `lib/`, `schemas/`, `types/`

- Preserve existing read/write boundaries
- Keep validation and DTO contracts explicit
- Avoid leaking provider or DB concerns into orchestration or UI layers

## Delivery Model

- Markdown carries intent and rationale.
- YAML carries durable execution contracts.
- JSON carries backlog and progress state.

## Program Sequence

1. Thin route shells and normalize page entrypoints.
2. Normalize feature orchestration and client module placement.
3. Clean component boundaries and primitive usage.
4. Harden server-side read/write, authz, validation, and integration boundaries.
5. Validate the new structure with repo checks and targeted end-to-end coverage.
