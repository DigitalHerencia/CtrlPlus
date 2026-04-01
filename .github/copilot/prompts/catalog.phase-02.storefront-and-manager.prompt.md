# Catalog Phase 02 Prompt

## Objective

Bring browse, detail, and manager surfaces into full alignment with the deterministic asset contract.

## Read First

1. `.copilot/prompts/catalog.refactor.prompt.md`
2. `.copilot/docs/catalog.md`
3. `.copilot/contracts/catalog-visualizer.handoff.contract.yaml`
4. `.copilot/execution/catalog-visualizer.validation.json`

## In Scope

- `app/(tenant)/catalog/page.tsx`
- `app/(tenant)/catalog/[id]/page.tsx`
- `app/(tenant)/catalog/manage/page.tsx`
- `features/catalog/**`
- `components/catalog/**`
- relevant catalog unit tests

## Deliverables

- Browse and detail UI consume resolved DTOs only.
- Manager UI distinguishes hero, gallery, visualizer texture, and mask-hint roles clearly.
- Publish-readiness messaging reflects current server rules.

## Stop Conditions

- If work expands into visualizer pipeline internals, switch to a visualizer or integration prompt.
