---
description: Authentication and authorization interpretation guidance for CtrlPlus.
applyTo: "lib/auth/**, lib/authz/**, app/(auth)/**, app/api/clerk/**, features/auth/**"
---

## Purpose

Interpret identity/session/access decisions for Clerk-based auth in a server-first
model.

## Interpretation guidance

- Use Clerk server helpers for authoritative identity checks.
- Re-check auth/authz in every server action and route handler entry point.
- Keep capability and ownership checks server-side.
- Treat page-level gating as insufficient for server action security by itself.

## Session and access semantics

- Authentication answers "who is this caller?"
- Authorization answers "what may this caller do to this resource?"
- Both must be evaluated for sensitive reads and all writes.

## Forbidden interpretation

- No client-authoritative role or ownership assertions.
- No mutation path without explicit authn/authz validation.

## References

- `.agents/docs/PRD.md`
- `.agents/contracts/security.contract.yaml`
- `.agents/contracts/mutation-pipeline.contract.yaml`
