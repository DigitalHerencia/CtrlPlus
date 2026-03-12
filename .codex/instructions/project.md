# Project Model

CTRL+ is a single-store vehicle wrap platform.

## Stack

- Next.js 16 App Router and React 19
- TypeScript strict
- Prisma 7 with Neon Postgres
- Clerk authentication
- Tailwind 4 and shadcn/ui
- Vercel deployment

## Roles

- `customer`: self-service browsing, visualizer, bookings, invoices, settings.
- `owner`: catalog, scheduling, billing, and global customer management.
- `admin`: owner capabilities plus platform maintenance and diagnostics.

Role mapping is server-side only:

- `STORE_OWNER_CLERK_USER_ID`
- `PLATFORM_DEV_CLERK_USER_ID`

## Domain Structure

- `app/`: UI, route handlers, server components, and server actions entry points.
- `components/`: reusable UI components.
- `lib/{domain}/fetchers`: read-path DTO fetchers.
- `lib/{domain}/actions`: write-path mutations.
- `prisma/`: schema and migrations.
- `docs/`: end-user and product-facing documentation only.

## Delivery Rules

- Prefer RSC by default.
- Keep Prisma out of `app/**` except webhook handlers.
- Keep DTO boundaries at the data layer.
- Avoid moving agent workflow material outside `.codex/`.
