---
name: CtrlPlus Workspace Configuration
description: "Workspace-level instructions for CtrlPlus single-store vehicle wrap platform. Covers Next.js 16 RSC patterns, Prisma boundaries, and Clerk-based customer/owner/admin authorization."
applyTo: "**"
---

# CtrlPlus: Copilot Workspace Configuration

## Project Model

CTRL+ is a **single-store** platform (not multi-tenant).

Roles:

- `customer` (default)
- `owner` (env-mapped)
- `admin` (env-mapped)

Role mapping is server-side only:

- `STORE_OWNER_CLERK_USER_ID`
- `PLATFORM_DEV_CLERK_USER_ID`

No Clerk organizations and no in-app role assignment.

## Stack

- Next.js 16 App Router + React 19
- TypeScript strict
- Prisma 7 + Neon Postgres
- Clerk auth
- Tailwind 4 + shadcn/ui

## Critical Rules

1. Never import Prisma in `app/**` except webhook handlers.
2. Reads live in `lib/*/fetchers` and return DTOs.
3. Writes live in `lib/*/actions` and follow:
   - `auth -> authorize -> validate -> mutate -> audit`
4. Never accept ownership/role scope from client payloads.
5. Customer data access must be enforced with server-side `customerId`/`clerkUserId` checks.

## Authorization Expectations

- Customers can access only their own appointments/invoices/settings.
- Owner/admin can manage catalog and all appointments/invoices.
- Admin can additionally access platform/database maintenance features.

## App Areas

- `catalog`: shared read experience for customers; managed by owner/admin.
- `visualizer`: customer usage; admin has management capability.
- `scheduling`: customer self-service + owner/admin management.
- `billing`: customer self-service + owner/admin management.
- `settings`: per-user preferences.
- `admin` and `platform`: management surfaces.

## Quality Gate

Before merge:

- `pnpm tsc --noEmit`
- `pnpm lint`
- relevant tests
- migration applied and Prisma client generated when schema changed
