# Catalog Phase 01 Prompt

Use this prompt for the first bounded catalog implementation pass.

## Objective

Harden the wrap asset contract and the upload boundary without changing unrelated catalog behavior.

## Primary Files

- `lib/fetchers/catalog.fetchers.ts`
- `lib/fetchers/catalog.mappers.ts`
- `lib/actions/catalog.actions.ts`
- `types/catalog.types.ts`
- `schemas/catalog.schemas.ts`
- `lib/uploads/storage.ts`

## Required Outcomes

1. `WrapImageKind` semantics remain deterministic.
2. The upload contract is explicit and consistent across schemas, actions, and client callers.
3. Publish-readiness behavior remains server-authoritative.
4. No regression to implicit image ordering.

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
