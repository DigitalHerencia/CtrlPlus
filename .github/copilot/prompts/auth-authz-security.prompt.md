---
description: Auth/authz/security audit across the CtrlPlus codebase. Finds and corrects places where authentication, authorization, tenant isolation, role/capability checks, or mutation validation have drifted from the documented server-side security model.
---

# POST-REFACTOR ENFORCEMENT PROMPT — CLERK, CAPABILITIES, AND OTHER WAYS TO AVOID ACCIDENTAL CRIMES

You are performing an auth/authz/security audit across the refactored CtrlPlus codebase.

## Mission

Find and correct places where authentication, authorization, tenant isolation, role/capability checks, or mutation validation have drifted from the documented server-side security model.

## Canonical rules to enforce

- Keep auth and authz server-side (`lib/auth/**`, `lib/authz/**`).
- Never trust tenant, role, or ownership claims from client input.
- Validate all mutation payloads at server boundary.
- Server actions enforce auth, authz, and schema validation.
- Mutations are tenant-scoped and auditable.
- Zero cross-tenant data exposure is a success requirement.

## Audit objectives

1. Find actions missing authentication.
2. Find actions or fetchers missing authorization checks.
3. Find client-controlled tenant, role, ownership, or capability assumptions.
4. Find cross-tenant read or write leakage risk.
5. Find security-sensitive routes or features that rely only on UI hiding.
6. Find mutation flows without audit coverage where applicable.
7. Find admin/platform privilege drift into non-privileged surfaces.

## Correction rules

- Restore server-side auth/authz enforcement.
- Remove trust in client-supplied tenant/role/ownership claims.
- Ensure tenant-scoped reads and writes are enforced in fetchers/actions.
- Add audit recording for sensitive mutations where applicable.
- Tighten route-safe redirects or server-side gating where needed.
- Do not widen permissions for convenience.

## Deliverables

1. Apply the corrective changes.
2. Output a concise changelog grouped by:
   - Authentication fixes
   - Authorization fixes
   - Tenant isolation fixes
   - Audit/security logging fixes
3. Output a "remaining security risk" list for anything needing broader policy decisions.

## Verification checklist

- Auth/authz is server-side
- No client-trusted role/tenant/ownership logic
- Sensitive mutations are auditable
- No obvious cross-tenant leaks
- Admin/platform operations remain privileged
