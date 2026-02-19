# Security Best Practices Review — CtrlPlus

## Executive summary

The codebase has a good start on defense-in-depth (CSP/security headers, tenant-aware data access patterns, upload MIME checks), but it currently has **critical identity and tenant-boundary weaknesses** that make privilege escalation and cross-tenant access feasible.

Top risks to address first:

1. **Client-trusted auth/role headers** allow identity/privilege spoofing.
2. **Fail-open tenant fallback** defaults unresolved traffic to `tenant_acme`.
3. **Client-controlled `tenantId` in server actions** is not derived from trusted request context.
4. **Stripe webhook hardcoded default secret + non-standard verification** weakens payment event trust.

If these are fixed, the platform’s security posture improves significantly with relatively contained refactors.

## Scope and method

- Reviewed Next.js app, server actions/fetchers, tenancy/auth modules, webhook route, Prisma schema/migrations, and tests.
- Cross-checked secure defaults against the `security-best-practices` skill references for Next.js + React frontend/server guidance.
- Pulled MCP guidance from Vercel docs for header/signature verification patterns.

---

## Critical findings

### [SBP-001] Client-trusted authentication and authorization headers

**Severity:** Critical  
**Impact:** An attacker can forge request headers to impersonate privileged users and execute protected actions.

**Evidence**

- `lib/server/auth/require-auth.ts:35`
- `lib/server/auth/require-auth.ts:36`
- `lib/server/auth/require-permission.ts:27`
- `app/(tenant)/admin/page.tsx:24`

`requireAuth` accepts identity from request headers (`x-clerk-user-id` / `x-user-id` and email headers) without cryptographic/session verification. `requirePermission` then accepts role from `x-user-role`, also client-supplied.

**Secure-by-default improvement**

- Replace header-derived auth with server-verified identity (`@clerk/nextjs/server` or equivalent signed session/JWT verification).
- Remove `x-user-*` trust path for internet-facing requests.
- Resolve role server-side from tenant membership in DB (keyed by verified user + resolved tenant).
- Keep permission checks centralized, but source identity/role only from trusted server context.

---

## High findings

### [SBP-002] Fail-open tenant resolution defaults to `tenant_acme`

**Severity:** High

**Evidence**

- `lib/server/tenancy/get-request-tenant.ts:5`
- `lib/server/tenancy/get-request-tenant.ts:15`
- `app/(tenant)/wraps/page.tsx:8`
- `app/(tenant)/wraps/[id]/page.tsx:16`
- `app/(tenant)/admin/page.tsx:29`

When host resolution fails, `getRequestTenant()` returns a hardcoded fallback tenant. This is a fail-open behavior in a multi-tenant app.

**Secure-by-default improvement**

- Fail closed (throw 404/403) when tenant cannot be resolved.
- Allow fallback tenant only in explicit local-dev mode behind an opt-in flag.
- Centralize tenant resolution once per request and require it everywhere.

### [SBP-003] `tenantId` is accepted from caller across server actions

**Severity:** High

**Evidence**

- `lib/server/actions/create-booking.ts:17`
- `lib/server/actions/create-invoice.ts:16`
- `lib/server/actions/create-checkout-session.ts:8`
- `lib/server/actions/create-upload-preview.ts:12`
- `lib/server/actions/catalog/create-wrap-design.ts:16`
- `lib/server/actions/catalog/delete-wrap-design.ts:16`

Actions accept `tenantId` from input and do not enforce that it matches trusted host-derived tenant context.

**Secure-by-default improvement**

- Remove `tenantId` from external action payloads.
- Derive tenant from trusted request context (`requireTenant`/host resolution + verified membership).
- Add a single helper (e.g., `getAuthorizedTenantContext`) returning `{ userId, tenantId, role }` and require it in every mutating action.

### [SBP-004] Webhook secret fallback + non-standard signature verification

**Severity:** High

**Evidence**

- `app/api/stripe/webhook/route.ts:72`
- `app/api/stripe/webhook/route.ts:60`
- `app/api/stripe/webhook/route.ts:75`

Webhook verification falls back to `'stripe_test_secret'` when env is missing, and signature validation uses raw `HMAC(payload)` instead of Stripe’s expected timestamped signed payload validation.

**Secure-by-default improvement**

- Require `STRIPE_WEBHOOK_SECRET` in production startup; do not provide default secret.
- Use Stripe’s official verification (`stripe.webhooks.constructEvent`) against the raw request body.
- Enforce timestamp tolerance and reject stale/replayed signatures.

---

## Medium findings

### [SBP-005] Webhook idempotency is in-memory, not durable

**Severity:** Medium

**Evidence**

- `app/api/stripe/webhook/route.ts:22`
- `app/api/stripe/webhook/route.ts:39`
- `app/api/stripe/webhook/route.ts:88`
- `prisma/schema.prisma:82`

Idempotency is tracked in a process-local `Set`, which resets on restart and does not protect multi-instance deployments.

**Secure-by-default improvement**

- Persist event IDs in `PaymentEvent` with unique `stripeEventId`.
- Perform dedupe + invoice mutation in one DB transaction.

### [SBP-006] Checkout return URLs are not allowlisted

**Severity:** Medium

**Evidence**

- `lib/server/actions/create-checkout-session.ts:10`
- `lib/server/actions/create-checkout-session.ts:11`
- `lib/server/actions/create-checkout-session.ts:35`

`successUrl`/`cancelUrl` are accepted from caller and reflected into checkout URL parameters without origin allowlisting.

**Secure-by-default improvement**

- Enforce per-tenant allowlist of callback origins/paths.
- Prefer server-side canonical URL builders instead of taking full URLs from callers.

### [SBP-007] Upload rate limiting can be bypassed and is single-instance only

**Severity:** Medium

**Evidence**

- `lib/server/actions/create-upload-preview.ts:35`
- `lib/server/actions/create-upload-preview.ts:47`
- `lib/server/rate-limit/fixed-window-limiter.ts:30`

Rate limit key uses spoofable user headers and in-memory counters.

**Secure-by-default improvement**

- Use verified user ID + network/IP signal from trusted edge headers.
- Move limiter state to shared storage (Redis/Upstash) for horizontally scaled environments.

### [SBP-008] Missing runtime schema validation on action payloads

**Severity:** Medium

**Evidence**

- `lib/server/actions/create-template-preview.ts:21`
- `features/visualizer/template-preview.ts:56`
- `lib/server/actions/create-booking.ts:26`
- `lib/server/actions/create-invoice.ts:26`

TypeScript types are used as if they were runtime validation, but untrusted inputs are not uniformly validated with strict schemas.

**Secure-by-default improvement**

- Add runtime validation (e.g., Zod) for every public action/route input.
- Validate lengths, formats, ranges, and URL origins before business logic.
- Normalize errors into safe, bounded API responses.

---

## Low findings

### [SBP-009] Dependency advisory in current lockfile

**Severity:** Low (current scope)

**Evidence**

- `pnpm audit --json` reports `GHSA-2g4f-4pwh-qvx6` (`ajv` ReDoS) through path `.>eslint>ajv`.

This appears in lint/tooling dependency chain; exploitability is lower than runtime-facing packages, but still worth patching.

**Secure-by-default improvement**

- Upgrade dependency chain to `ajv >= 8.18.0` (likely via eslint ecosystem upgrade).
- Keep automated dependency scanning in CI and patch cadence defined.

---

## Positive controls observed

- CSP/security headers are applied in middleware/proxy and config (`proxy.ts`, `next.config.ts`).
- Upload pipeline validates type, extension, and magic bytes (`lib/server/storage/upload-store.ts`).
- React output paths avoid direct dangerous DOM sinks in reviewed components.
- Prisma schema is tenant-aware with tenant indexes and unique constraints (`prisma/schema.prisma`).

---

## Suggested remediation order (secure-by-default)

1. **Identity hardening:** replace header-trust auth/role with verified server auth and DB-backed membership/role lookup.
2. **Tenant boundary hardening:** remove fallback tenant and derive tenant server-side only.
3. **Payment integrity:** webhook secret enforcement, Stripe-native verification, DB idempotency.
4. **Input governance:** runtime validation schemas + centralized URL allowlist checks.
5. **Abuse controls:** shared rate limiting, monitoring, and alerting.

