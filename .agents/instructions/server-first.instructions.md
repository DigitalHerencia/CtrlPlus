---
description: Foundational server-first interpretation guidance for CtrlPlus.
applyTo: "app/**, features/**, components/**, lib/**, types/**, schemas/**"
---

## Purpose

Interpretation guide for implementing CtrlPlus as a server-first Next.js App Router
system while respecting domain boundaries and security posture.

## Core interpretation

- Keep `app/**` as route orchestration.
- Keep business flows in `features/**` + `lib/**`.
- Keep UI rendering in `components/**`.
- Keep read/write authority in `lib/fetchers/**` and `lib/actions/**`.

## Server/client interpretation

- Prefer Server Components by default.
- Use Client Components only where interaction/state requires them.
- Never treat client-provided role/ownership/scope as trusted input.

## Mutation interpretation flow

Use the mutation lifecycle defined in
`.agents/contracts/mutation-pipeline.contract.yaml`.

Interpretation intent:

- authenticate first,
- authorize explicitly,
- validate inputs before persistence,
- execute atomic writes where needed,
- record audit context for sensitive actions,
- trigger cache invalidation semantics aligned to write scope.

## Caching interpretation

- Cache semantics belong to server read flows.
- Use tag/path invalidation strategy that matches mutation blast radius.
- Prefer deterministic freshness strategy over ad hoc cache bypasses.

## References

- `.agents/docs/ARCHITECTURE.md`
- `.agents/contracts/governance-layers.contract.yaml`
- `.agents/contracts/data-access.contract.yaml`
- `.agents/contracts/security.contract.yaml`
