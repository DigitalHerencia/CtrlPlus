# Auth/Authz Refactor Prompt

## Mission

Refactor only the `auth/authz` domain to the target CtrlPlus server-first architecture. Preserve authentication correctness, capability enforcement, and Clerk identity-sync safety.

## Scope anchors

- `app/(auth)/**`
- `components/auth/**`
- `lib/auth/**`
- `lib/authz/**`
- `app/api/clerk/**`
- `proxy.ts`
- affected tests under `e2e/**` and `tests/**`

## Non-goals

- do not refactor billing, catalog, scheduling, settings, admin, or platform business logic
- do not replace Clerk or redesign the role model
- do not push authz decisions into client components

## Target architecture

- keep auth route files thin
- keep auth UI focused on user guidance
- keep session resolution and identity mapping in `lib/auth/**`
- keep role, capability, and guard semantics in `lib/authz/**`
- keep Clerk webhook identity sync as a narrow integration boundary

## Required implementation rules

- refactor only the named domain unless a shared boundary file is explicitly listed
- do not refactor adjacent domains in the same pass
- do not move Prisma into `app/**` or React components
- keep feature orchestration outside `app/**`
- keep client components free of authz, business rules, and cache invalidation
- preserve server-side enforcement everywhere

## Domain behaviors to preserve

- sign-in and sign-up flows
- session resolution and role mapping
- centralized capability and ownership policy
- server-side guards
- Clerk webhook verification, raw-body-safe handling, idempotency, and retries

## Refactor checklist

- thin the auth route entrypoints
- isolate auth UI from policy logic
- centralize session and redirect helpers cleanly
- centralize policy and guard helpers cleanly
- preserve Clerk webhook replay safety and identity sync behavior
- update unit, integration, and end-to-end coverage

## Validation and tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when auth flows are affected

## Completion criteria

- auth/authz remains a hard server boundary
- client code is not authoritative for permissions
- Clerk webhook identity sync remains correct and replay-safe
- auth routes are thin and policy is centralized
- quality gates pass
