# Visualizer Phase 01 Prompt

Use this prompt for the visualizer handoff and selection pass.

## Objective

Align the visualizer route, selection fetchers, and upload contract with the catalog handoff spec.

## Primary Files

- `app/(tenant)/visualizer/page.tsx`
- `features/visualizer/visualizer-page-feature.tsx`
- `features/visualizer/visualizer-workspace-client.tsx`
- `lib/fetchers/visualizer.fetchers.ts`
- `lib/actions/visualizer.actions.ts`
- `schemas/visualizer.schemas.ts`
- `types/visualizer.types.ts`

## Required Outcomes

1. `wrapId` handoff remains server-validated.
2. Upload input contracts are explicit and coherent.
3. Ownership and hidden-wrap rules remain server-authoritative.
4. The next pass can work on generation/storage without re-opening selection confusion.

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
