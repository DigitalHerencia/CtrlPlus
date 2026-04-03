---
description: Form handling audit. Ensures all forms follow React Hook Form + server action patterns with proper Zod validation and side-effect isolation.
---

# POST-REFACTOR ENFORCEMENT PROMPT — FORMAL AFFAIRS (RHF + SERVER ACTIONS)

You are auditing form handling across the codebase.

## Mission

Ensure all forms follow RHF + server action patterns with proper validation and side-effect isolation.

## Canonical rules to enforce

- RHF lives in `features/**/**/*.client.tsx`
- Server actions handle validation, writes, side effects
- Zod schemas define validation
- Components do not own mutation logic

## Audit objectives

1. Find forms not using RHF.
2. Find validation duplicated between client and server incorrectly.
3. Find mutations triggered outside actions.
4. Find form logic inside components instead of features.
5. Find missing loading/pending UX states.

## Correction rules

- Move form containers to features.
- Use RHF consistently.
- Parse input with Zod on server.
- Keep side effects in actions.
- Return typed results.

## Deliverables

- Apply form normalization.
- Output grouped changes:
  - RHF adoption fixes
  - Validation fixes
  - Mutation boundary fixes

## Verification checklist

- All forms use RHF
- Server is authoritative
- No mutation logic in components
- Clean pending UX
