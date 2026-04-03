---
description: Holistic architectural coherence pass after a multi-domain refactor. Reviews the codebase for overall alignment drift against the canonical product, architecture, data model, technology, and roadmap docs.
---

# POST-REFACTOR ENFORCEMENT PROMPT — THE ARCHITECTURE VIBES ARE NOT HARSH

You are performing a holistic architectural coherence pass after a multi-domain refactor.

## Mission

Review the current codebase for overall alignment drift against the canonical product, architecture, data model, technology, and roadmap docs. Correct inconsistencies that create long-term maintenance risk, even if each individual file looks superficially acceptable.

## Source of truth to enforce

- PRD.md
- ARCHITECTURE.md
- TECHNOLOGY-REQUIREMENTS.md
- DATA-MODEL.md
- ROADMAP.md

## System-level constraints to preserve

- server-first Next.js App Router architecture
- domain-bounded ownership
- secure mutation flows
- tenant-safe reads and writes
- Prisma/Postgres as source of truth
- explicit validation via Zod
- DTO contracts in `types/**`
- quality gates: lint, typecheck, prisma validate, build, tests

## Audit objectives

1. Find places where code behavior conflicts with product non-goals.
2. Find architecture drift that weakens maintainability.
3. Find domain coupling that bypasses canonical ownership.
4. Find stack misuse that conflicts with technology requirements.
5. Find roadmap-critical gaps in security, correctness, validation, or observability.
6. Find documentation drift that should be updated in the same change set.

## Correction rules

- Prefer security and correctness before UX polish.
- Keep work domain-bounded and incrementally shippable.
- Do not perform speculative rewrites.
- Make targeted changes that restore coherence with source-of-truth docs.
- If behavior, architecture, or constraints change in code, update the relevant docs in the same change set.

## Deliverables

1. Apply corrective code changes where they are clear and safe.
2. Update docs in `/docs` or the canonical docs folder when code changes require documentation sync.
3. Output a concise changelog grouped by:
   - Product alignment fixes
   - Architecture coherence fixes
   - Data model/contract fixes
   - Tech stack/quality gate fixes
   - Documentation sync fixes
4. Output a prioritized "next hardening steps" list aligned to the roadmap phases.

## Verification checklist

- Product non-goals are respected
- Architecture boundaries are intact
- Data model assumptions are valid
- Tech requirements are respected
- Docs and code are in sync
