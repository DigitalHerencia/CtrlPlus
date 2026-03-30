# Visualizer Phase 02 Prompt

Use this prompt for the generation, storage, and fallback hardening pass.

## Objective

Preserve the current preview lifecycle while making generation, fallback, and storage boundaries
more explicit and resilient.

## Primary Files

- `lib/actions/visualizer.actions.ts`
- `lib/uploads/image-processing.ts`
- `lib/uploads/storage.ts`
- `lib/integrations/huggingface.ts`
- `lib/cache/cache-keys.ts`

## Required Outcomes

1. Preview status transitions remain explicit and tested.
2. Hugging Face remains behind a server-side adapter boundary.
3. Deterministic fallback remains available when provider generation fails.
4. Storage remains durable and traceable through preview metadata.

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
