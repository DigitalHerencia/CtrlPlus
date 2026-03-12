# Project Model

CTRL+ is a multi-tenant vehicle wrap platform.

## Stack

- Next.js 16 App Router and React 19
- TypeScript strict
- Prisma 7 with Neon Postgres
- Clerk authentication
- Tailwind 4 and shadcn/ui
- Vercel deployment

## Roles

- `customer`: tenant-scoped browsing, visualizer, bookings, invoices, settings.
- `owner`: tenant-scoped catalog, scheduling, billing, and customer management.
- `admin`: owner capabilities plus tenant administration and platform diagnostics.

Role resolution and tenant scope must always be server-side.

## Domain Structure

- `app/`: UI, route handlers, server components, and server actions entry points.
- `components/`: reusable UI components.
- `lib/{domain}/fetchers`: read-path DTO fetchers.
- `lib/{domain}/actions`: write-path mutations.
- `prisma/`: schema and migrations.
- `docs/`: end-user documentation only.
- `.codex/docs/`: internal developer and Codex operation documentation.

## Delivery Rules

- Prefer RSC by default.
- Keep Prisma out of `app/**` except webhook handlers.
- Keep DTO boundaries at the data layer.
- Enforce tenant scoping on every domain query and mutation.
- Keep all non-end-user docs under `.codex/`.
- Avoid moving agent workflow material outside `.codex/`.
