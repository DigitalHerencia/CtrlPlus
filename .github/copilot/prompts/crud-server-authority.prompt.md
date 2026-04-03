---
description: Server-authority audit focused on lib/actions and lib/fetchers. Finds and corrects weak, inconsistent, or non-canonical action/fetcher patterns so reads and writes match the documented mutation pipeline.
---

# POST-REFACTOR ENFORCEMENT PROMPT — YOU GIVE CRUD A BAD NAME

You are performing a server-authority audit focused on `lib/actions/**` and `lib/fetchers/**`.

## Mission

Find and correct weak, inconsistent, or non-canonical action/fetcher patterns so that reads and writes match the documented mutation pipeline and server authority model.

## Canonical rules to enforce

### Reads
- Reads must run through `lib/fetchers/{domain}`.
- Fetchers perform tenant-safe reads and shape DTOs.
- Fetchers are read authority.

### Writes
All sensitive write flows should follow:
1. Authenticate user session.
2. Authorize capability/role/ownership.
3. Validate input with Zod schema.
4. Execute mutation in domain action/transaction boundary.
5. Record audit data where applicable.
6. Revalidate cache tags/paths.

### Additional rules
- Never trust tenant, role, or ownership claims from client input.
- Keep freshness policies explicit for billing/payment and other real-time flows.
- Mutations should be tenant-scoped and auditable.

## Audit objectives

1. Find fetchers that do not enforce tenant-safe reads.
2. Find actions missing auth, authz, schema validation, audit logging, or revalidation.
3. Find fetchers returning raw Prisma records instead of shaped DTOs.
4. Find actions containing validation logic that should live in schemas.
5. Find writes happening outside canonical action boundaries.
6. Find client components or route files calling persistence directly.
7. Find duplicated, overlapping, or contradictory read/write paths.

## Correction rules

- Normalize fetchers to be read-only, tenant-safe, and DTO-shaped.
- Normalize actions to follow the documented mutation pipeline.
- Add or tighten schema parsing where missing.
- Add or restore audit logging where applicable.
- Add or restore revalidation where missing after successful mutations.
- Remove unsafe direct persistence access outside action boundaries.
- Do not change domain behavior unless needed to restore correctness and safety.

## Deliverables

1. Apply the code changes needed to normalize actions and fetchers.
2. Output a concise changelog grouped by:
   - Fetcher authority fixes
   - Action pipeline fixes
   - Schema integration fixes
   - Audit/revalidation fixes
3. Output a list of any remaining ambiguous flows that need product or domain-level decisions.

## Verification checklist

- Every critical mutation passes through auth → authz → schema parse → write/transaction → audit → revalidate
- Every read-heavy path routes through fetchers
- No raw Prisma records leaking to UI contracts
- No client-trusted ownership or tenant logic
- No direct write calls from UI layers
