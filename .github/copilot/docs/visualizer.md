---
title: CtrlPlus Visualizer Delivery Notes
status: Active
owner: Copilot
last_updated: 2026-03-30
---

# CtrlPlus Visualizer Delivery Notes

The visualizer domain is a status-driven AI concept preview flow, not a manufacturing proofing system.

## Source References

- `SRC-VISUALIZER-GEN-2026-03-30`
- `SRC-VISUALIZER-AUDIT-2026-03-30`
- `SRC-CATALOG-MIGRATION-2026-03-30`
- `SRC-REPO-STATE-2026-03-30`

## Focus

- Keep visualizer routes thin in `app/(tenant)/visualizer/**`
- Preserve orchestration in `features/visualizer/**`
- Keep uploads, preview generation, fallback behavior, and preview ownership on the server
- Align future agent work to the actual two-step create/process preview lifecycle already present in the repo

## Non-Negotiables

- Preview status remains explicit: `pending`, `processing`, `complete`, `failed`.
- Vehicle uploads and generated previews must remain durable storage references, not inline payloads.
- Provider logic stays behind integrations or upload boundaries.
- The selected wrap must be catalog-approved and resolved via the visualizer selection fetcher.
- Cache keys and source asset metadata must remain traceable through preview generation.

## Current Repo Reality

- `app/(tenant)/visualizer/page.tsx` already validates auth and capability, parses `wrapId`, and delegates into `features/visualizer/visualizer-page-feature.tsx`.
- `features/visualizer/visualizer-workspace-client.tsx` already orchestrates client interaction, preview creation, preview processing, regeneration, and polling.
- `lib/actions/visualizer.actions.ts` already implements a primary Hugging Face path plus deterministic fallback, tracks `sourceWrapImageId/sourceWrapImageVersion`, and writes audit logs.
- `lib/uploads/image-processing.ts` already owns upload normalization, prompt construction, conditioning-board generation, segmentation fallback, and deterministic compositing.
- `lib/uploads/storage.ts` already stores generated preview output in Cloudinary and still supports local fallback for catalog asset storage.

## Active File Map

- Route shell: `app/(tenant)/visualizer/page.tsx`
- Feature shell: `features/visualizer/visualizer-page-feature.tsx`, `features/visualizer/visualizer-workspace-client.tsx`, `features/visualizer/visualizer-preview-poller-client.tsx`
- Read boundary: `lib/fetchers/visualizer.fetchers.ts`, `lib/fetchers/visualizer.mappers.ts`
- Write boundary: `lib/actions/visualizer.actions.ts`
- Provider and storage boundaries: `lib/integrations/huggingface.ts`, `lib/integrations/cloudinary.ts`, `lib/uploads/image-processing.ts`, `lib/uploads/storage.ts`
- Shared types and validation: `types/visualizer/**`, `schemas/visualizer.schemas.ts`, `lib/cache/cache-keys.ts`
- High-value tests: visualizer action unit tests, route tests, and Playwright route smoke tests

## Planned Delivery Sequence

1. Keep the catalog handoff contract stable and explicit.
2. Harden upload, storage, and provider readiness so preview generation does not fail on setup drift.
3. Improve preview lifecycle and UI recovery states without pushing server logic into client components.
4. Add or expand integration and E2E coverage once the handoff path is stable.

## Known Gaps To Carry Forward

- `.env.example` previously omitted the live Cloudinary, Hugging Face, and visualizer tuning variables consumed by the implementation.
- The repo currently lacks a checked-in CI workflow, so preview quality gates must stay explicit in execution and prompts.
- Current code still uses broad helper files (`lib/uploads/image-processing.ts`, `lib/actions/visualizer.actions.ts`), so future extraction should be deliberate and phase-bounded.

## Use With

- `.copilot/arch/copilot_visualizer_huggingface_generation_spec.md`
- `.copilot/instructions/visualizer.instructions.md`
- `.copilot/contracts/catalog-visualizer.contract.yaml`
- `.copilot/prompts/visualizer.refactor.prompt.md`
