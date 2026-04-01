---
description: 'Domain instructions for auth routes, session resolution, capability policy, and Clerk identity sync'
applyTo: 'app/(auth)/**,components/auth/**,lib/auth/**,lib/authz/**,app/api/clerk/**,proxy.ts'
---

# Auth/Authz Domain Instructions

## Domain purpose

The auth/authz domain owns sign-in and sign-up surfaces, session resolution, identity mapping, capability and ownership policy, server-side guards, and Clerk identity-sync webhook behavior.

## Scope boundaries

This domain owns:

- auth route surfaces in `app/(auth)/**`
- auth UI in `components/auth/**`
- session and identity helpers in `lib/auth/**`
- policy and guard helpers in `lib/authz/**`
- Clerk webhook identity-sync implementation
- request-gating helpers that depend on session or policy

This domain does not own:

- billing business logic
- catalog business logic
- scheduling business logic
- platform-admin operational UI

## Required patterns

- Keep auth and authz authoritative on the server.
- Do not push capability rules into route pages or client components.
- Keep session resolution centralized in `lib/auth/**`.
- Keep role and capability policy centralized in `lib/authz/**`.
- Clerk webhook handling must remain a narrow integration boundary with replay-safe behavior.

## Security requirements

- Never trust the client to enforce permissions.
- Preserve strict capability and ownership checks at server boundaries.
- Do not expose provider secrets, signature internals, or raw webhook details unnecessarily.
- Keep Clerk webhook verification and idempotency intact.
- Permission-denied behavior should not leak protected record existence unnecessarily.

## Product requirements

- Sign-in and sign-up flows should remain resilient and understandable.
- Verification and retry states should be explicit.
- Role and capability semantics must remain consistent across the product.
- Shared auth behavior should be reusable by every domain without policy drift.

## UI requirements

- Auth UI should focus on user guidance, not policy implementation.
- Loading, verification, retry, and error states must be explicit.
- Permission-denied UX should be intentional and consistent.

## Performance requirements

- Keep session helpers cache-aware when safe.
- Avoid repeated policy lookups when one resolved session can drive the request.
- Keep webhook processing efficient and replay-safe under retries.

## Testing requirements

Add or update tests when changing:

- sign-in or sign-up flows
- session resolution
- role mapping
- capability policy
- authz guards
- Clerk webhook verification, idempotency, or identity sync behavior

## Refactor priorities

1. preserve auth/authz as a hard server boundary
2. centralize policy and guard semantics
3. keep auth UI clear without making it authoritative
4. preserve Clerk webhook correctness and replay safety
5. improve coverage for critical auth and authz flows
