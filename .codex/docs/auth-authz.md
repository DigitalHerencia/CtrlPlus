# Auth/Authz Domain Spec

## Goal

Refactor authentication and authorization into a clear server-boundary domain covering auth routes, session resolution, identity mapping, capability enforcement, and Clerk identity-sync workflows.

## Current repo anchors

- `app/(auth)/**`
- `components/auth/**`
- `lib/auth/**`
- `lib/authz/**`
- `app/api/clerk/webhook-handler/route.ts`
- `proxy.ts`
- `prisma/schema.prisma`

## Main requirements

- preserve secure sign-in and sign-up flows
- keep session resolution and role mapping server-side
- keep capability and ownership enforcement centralized
- preserve Clerk webhook verification, idempotency, and identity sync behavior
- make auth/authz a first-class refactor domain instead of an implicit cross-cutting concern

## Key implementation points

- auth UI may guide the user, but it must never be authoritative for permissions
- `lib/auth/**` owns session resolution, identity mapping, and redirect helpers
- `lib/authz/**` owns role, capability, and guard semantics
- Clerk webhook identity sync remains a narrow integration boundary with raw-body-safe verification and replay-safe handling
- future refactors should keep auth/authz reusable by every business domain without pushing policy into route files or client components

## UX requirements

- sign-in and sign-up flows should be clear and resilient
- verification, retry, and failure states should be explicit
- permission-denied behavior should be intentional and consistent across the product
- auth UI must not expose implementation details of policy or providers

## Security/performance focus

- client code must never be authoritative for authz decisions
- enforce capability and ownership checks at server boundaries
- preserve Clerk webhook verification, idempotency, and safe retries
- avoid leaking provider secrets, raw webhook payload details, or internal role mechanics

## Acceptance signals

- auth routes, session helpers, policy helpers, and webhook sync code have a clear ownership boundary
- auth/authz is documented as a first-class domain
- capability and ownership enforcement remains centralized and server-side
- tests cover critical auth, authz, and webhook identity-sync behavior
