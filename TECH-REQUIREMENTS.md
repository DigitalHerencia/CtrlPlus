# Technical Requirements

## Stack

- Next.js 16+ (App Router, RSC)
- React 19+
- TypeScript 5+ (strict)
- Prisma 7+
- Neon Serverless Postgres
- Clerk authentication (no organizations)
- Tailwind CSS 4

## Architecture

- Feature-first domains under `lib/{domain}`.
- Read path: `lib/{domain}/fetchers`.
- Write path: `lib/{domain}/actions`.
- API/UI layers import domain modules, not Prisma.

## Authorization

- Roles: `customer`, `owner`, `admin`.
- Role source: server-side env mapping + authenticated Clerk user ID.
- `STORE_OWNER_CLERK_USER_ID` and `PLATFORM_DEV_CLERK_USER_ID` are optional.
- No in-app role assignment UI.

## Security Pipeline

All actions must follow:

`auth -> authorize -> validate -> mutate -> audit`

## Data Rules

- Never accept ownership scope from client payloads.
- Customer-scoped data must enforce `customerId`/`clerkUserId` ownership checks.
- Shared data (catalog) is global; visibility can be controlled with `isHidden`.
- Soft delete filters (`deletedAt: null`) must be applied where relevant.

## Database Shape

- No tenant tables or tenant foreign keys.
- Single catalog for the whole store.
- Website settings are per user (`WebsiteSettings.clerkUserId`).
