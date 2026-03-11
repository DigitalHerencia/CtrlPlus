# CTRL+

Single-store vehicle wrap platform built with Next.js 16, React 19, TypeScript 5, Clerk auth, Neon Postgres, and Prisma 7.

## Authorization Model

- `customer` (default): can browse catalog, use visualizer, manage their own bookings/invoices, manage their own website settings.
- `owner` (single store owner): can manage catalog, view/manage all bookings and invoices, manage own website settings.
- `admin` (single platform developer): owner capabilities plus visualizer management and platform/database operations.

Role resolution is server-side only:

- `PLATFORM_DEV_CLERK_USER_ID` => `admin`
- `STORE_OWNER_CLERK_USER_ID` => `owner`
- everyone else => `customer`

These env vars are optional and are only changed by editing `.env*` files.

## Security Rules

- Never import Prisma in `app/**` (except webhook handlers).
- All reads go through `lib/*/fetchers` and return DTOs.
- All writes go through `lib/*/actions` and follow: `auth -> authorize -> validate -> mutate -> audit`.
- Never accept role or ownership scope from client payloads.
- Customer-scoped data access must be enforced with server-side `customerId` checks.

## Domains

- `catalog` - single shared catalog for all users.
- `visualizer` - customer use + admin management.
- `scheduling` - customer self-service + owner/admin global management.
- `billing` - customer self-service + owner/admin global management.
- `settings` - per-user website preferences.
- `platform` - admin console for webhooks and DB status/maintenance.

## Development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm prisma migrate deploy
pnpm prisma generate
```

## Notes

- App route-group name `app/(tenant)` is legacy naming only; runtime behavior is single-store, not multi-tenant.
- Clerk organizations are not used.
