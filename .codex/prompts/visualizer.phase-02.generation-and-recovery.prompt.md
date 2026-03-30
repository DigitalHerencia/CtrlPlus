# Visualizer Phase 02 Prompt

## Objective

Improve generation behavior, fallback safety, and recovery UX without weakening server authority.

## Read First

1. `.codex/prompts/visualizer.refactor.prompt.md`
2. `.codex/docs/visualizer.md`
3. `.codex/contracts/catalog-visualizer.pipeline.contract.yaml`
4. `.codex/contracts/catalog-visualizer.readiness.contract.yaml`
5. `.codex/execution/catalog-visualizer.validation.json`

## In Scope

- `lib/integrations/huggingface.ts`
- `lib/uploads/image-processing.ts`
- `lib/actions/visualizer.actions.ts`
- `components/visualizer/PreviewCanvas.tsx`
- `features/visualizer/visualizer-preview-poller-client.tsx`
- relevant visualizer unit tests

## Deliverables

- Hugging Face generation remains optional behind deterministic fallback.
- Preview status transitions and retry paths remain explicit and testable.
- UI reflects server-driven status rather than inventing client-side completion.

## Stop Conditions

- If work expands into broader catalog eligibility or route-structure migration, switch to a catalog or integration prompt.
