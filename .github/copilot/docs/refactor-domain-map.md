---
title: CtrlPlus Refactor Domain Map
status: Draft
owner: Copilot
last_updated: 2026-03-29
source_documents:
  - C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md
---

# CtrlPlus Refactor Domain Map

This document translates the architecture blueprint into the repo's current domain surface so future refactor passes can stay aligned to the actual codebase.

## Active Domains

### `auth`

- Scope: sign-in, sign-up, session resolution, identity context, and route gating
- Refactor goal: keep auth flows thin in `app/(auth)/**` and preserve server-side session authority in `lib/auth/**`

### `admin`

- Scope: owner or admin operational dashboards and cross-domain tools
- Refactor goal: keep dashboards thin and route operational composition through `features/admin/**`

### `billing`

- Scope: invoices, checkout, payment confirmation, and billing detail screens
- Refactor goal: preserve current `billing` naming while normalizing invoice-oriented flows into stable feature and component boundaries

### `catalog`

- Scope: wrap storefront browsing, wrap detail, wrap management, categories, assets, and publish readiness
- Refactor goal: keep catalog as the source of truth for wrap discovery and visualizer handoff

### `platform`

- Scope: webhook diagnostics, recovery actions, and platform-level operational visibility
- Refactor goal: keep platform logic server-authoritative and isolate operational tools from domain UI

### `scheduling`

- Scope: bookings, calendars, time slots, booking detail, and booking management
- Refactor goal: maintain thin route shells and keep booking workflows composed through features and server actions

### `settings`

- Scope: website settings and tenant-scoped configuration surfaces
- Refactor goal: keep settings forms aligned to explicit schemas and server-validated mutations

### `visualizer`

- Scope: wrap selection, vehicle upload, preview generation, preview polling, and generated preview review
- Refactor goal: preserve status-driven preview flows and keep generation logic behind server adapters

## Layer Cross-Cut

- `app/**` remains the route shell layer.
- `features/**` remains the orchestration layer.
- `components/**` remains the reusable UI layer.
- `components/ui/**` remains the primitive layer.
- `lib/**`, `schemas/**`, `types/**`, and `prisma/**` remain the server-authoritative contract layers.

## Domain Naming Rule

The blueprint contains invoice-oriented examples, but the current repo uses `billing` as the active domain. Until an explicit migration task exists, agents must preserve current repo naming and map invoice concepts into the `billing` domain.
