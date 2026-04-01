# Visualizer Phase 01 Prompt

## Objective

Harden wrap selection, upload persistence, and preview ownership around the existing live visualizer architecture.

## Read First

1. `.copilot/prompts/visualizer.refactor.prompt.md`
2. `.copilot/docs/visualizer.md`
3. `.copilot/contracts/catalog-visualizer.handoff.contract.yaml`
4. `.copilot/contracts/catalog-visualizer.pipeline.contract.yaml`
5. `.copilot/execution/catalog-visualizer.validation.json`

## In Scope

- `app/(tenant)/visualizer/page.tsx`
- `features/visualizer/**`
- `components/visualizer/**`
- `lib/fetchers/visualizer.fetchers.ts`
- `lib/actions/visualizer.actions.ts`
- `lib/uploads/storage.ts`
- `types/visualizer.types.ts`

## Deliverables

- Wrap preload remains catalog-authoritative.
- Customer uploads and generated previews remain durable URL-based assets.
- Ownership and source asset metadata remain server-enforced.

## Stop Conditions

- If the task requires broad provider rewrites or model migration, treat that as a separate visualizer phase.
