---
goal: Replace the current visualizer preview generator with a mask-guided Hugging Face inpainting pipeline while keeping Cloudinary as the authenticated storage and delivery spine.
version: 1.0
date_created: 2026-04-06
last_updated: 2026-04-06
owner: visualizer
status: Planned
tags: [feature, visualizer, huggingface, cloudinary, preview-pipeline]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan replaces the current board-only `imageToImage` preview path with a
mask-guided inpainting workflow. The live repo state shows Cloudinary storage and
authenticated delivery are working, but preview generation is still failing or
dropping to deterministic fallback. Cloudinary account inspection shows live
`ctrlplus/visualizer/uploads/**` and `ctrlplus/visualizer/previews/**` folders,
and the only persisted preview asset currently reports
`generationMode=deterministic_fallback`. The latest preview record in the database
failed with `generationFallbackReason="Invalid URL"`. Hugging Face documentation
confirms that Gradio Spaces expose stable API endpoints callable from
`@gradio/client`, which is the intended execution path for the masked edit stage.

## 1. Requirements & Constraints

- **REQ-001**: The preview pipeline must preserve the uploaded vehicle scene and modify vehicle exterior surfaces only.
- **REQ-002**: The preview pipeline must continue to accept `wrapId + uploadId` as the server-authoritative preview contract.
- **REQ-003**: Catalog-to-visualizer reference input must remain `hero + active gallery` only.
- **REQ-004**: Preview lifecycle must remain explicit and traceable through `pending | processing | complete | failed`.
- **REQ-005**: The primary AI path must use a mask-aware Hugging Face inpainting/editing workflow rather than generic board-only `imageToImage`.
- **REQ-006**: The system must preserve a deterministic fallback path when Hugging Face is unavailable or returns unusable output.
- **REQ-007**: Operator debugging must surface enough evidence to distinguish URL/input failures, mask failures, Space queue failures, and model failures.
- **SEC-001**: Auth/authz, wrap ownership, and upload ownership validation must stay server-side in `lib/actions/visualizer.actions.ts` and existing signed asset routes.
- **SEC-002**: Uploads, masks, and generated previews must remain Cloudinary-backed authenticated assets delivered via signed application routes or signed URLs.
- **CON-001**: Do not move Prisma access into `app/**`, `features/**`, or `components/**`.
- **CON-002**: Prefer small, local changes inside `lib/visualizer/**`, `lib/integrations/**`, and `lib/actions/**` over new parallel abstractions.
- **CON-003**: Preserve compatibility with current visualizer UI surfaces and DTOs unless a field addition materially improves operator debugging.
- **CON-004**: The current repo already has two Hugging Face config surfaces (`lib/integrations/huggingface.ts` and `lib/visualizer/huggingface/client.ts`); the implementation must converge them instead of adding a third config path.
- **PAT-001**: Provider-specific execution belongs in `lib/visualizer/huggingface/**` and `lib/integrations/**` only.
- **PAT-002**: Board composition, mask generation, and fallback rendering belong in `lib/visualizer/preprocessing/**` or `lib/visualizer/fallback/**`.
- **PAT-003**: Cloudinary remains the asset spine; Hugging Face remains compute only.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Normalize the provider contract and eliminate current configuration drift before changing generation behavior.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add a single visualizer preview provider config surface in `lib/visualizer/huggingface/client.ts` that resolves `HF_API_KEY` or `HUGGINGFACE_API_TOKEN`, exposes `HF_SPACE_ID`, `HF_SPACE_API_NAME`, `HF_TIMEOUT_MS`, `HF_RETRIES`, and a strategy flag such as `HF_PREVIEW_STRATEGY=space_inpaint|image_to_image|fallback`, and deprecates duplicate preview-model settings from `lib/integrations/huggingface.ts`. |  |  |
| TASK-002 | Update `.env.example` to describe the new Space-driven preview variables without exposing any secret values. |  |  |
| TASK-003 | Add explicit failure classification helpers in `lib/visualizer/huggingface/map-hf-error.ts` for `config_missing`, `invalid_url`, `space_queue_timeout`, `space_response_invalid`, and `provider_unavailable`. |  |  |

### Implementation Phase 2

- GOAL-002: Introduce a first-class mask-building step aligned to the existing upload-plus-reference workflow.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Extract vehicle-mask generation into a dedicated preprocessing module such as `lib/visualizer/preprocessing/build-vehicle-edit-mask.ts` that reuses `createVehicleMask()` and `fallbackCenterMask()` from `lib/integrations/huggingface.ts`, normalizes mask dimensions, and applies edge cleanup (threshold, blur, and conservative dilation). |  |  |
| TASK-005 | Replace the current single-output `buildGenerationInputBoard()` with a paired board builder that returns both `boardBuffer` and `boardMaskBuffer`, keeping the vehicle region on the left panel and making the mask white only over editable vehicle pixels. |  |  |
| TASK-006 | Add a utility that validates reference image URLs before fetch, records which reference failed, and never emits a raw `Invalid URL` without wrap-image context. This should harden `readImageBufferFromUrl()` usage and report the offending wrap image ID. |  |  |

### Implementation Phase 3

- GOAL-003: Replace generic board-only `imageToImage` with Hugging Face Space-based masked editing.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add `@gradio/client` to `package.json` and implement `lib/visualizer/huggingface/space-client.ts` for authenticated Space calls using `Client.connect(...)`, `handle_file(...)`, queue-aware submission, and typed result parsing. |  |  |
| TASK-008 | Implement `lib/visualizer/huggingface/generate-wrap-preview.ts` so the default path calls a Gradio Space endpoint with `[board_image, mask_image, prompt, negative_prompt]` and returns a normalized image buffer plus provider metadata. |  |  |
| TASK-009 | Keep the existing `imageToImage` adapter only as an explicitly configured non-default fallback path for controlled experiments; do not leave it as the production default. |  |  |

### Implementation Phase 4

- GOAL-004: Wire the new masked edit path into visualizer actions while preserving Cloudinary storage and signed delivery.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Update `processVisualizerPreviewForOwner()` in `lib/actions/visualizer.actions.ts` to build the vehicle board and mask, call the Space-backed generator, persist the resulting preview asset to Cloudinary, and set `generationMode` to a distinct value such as `mask_guided_inpaint`. |  |  |
| TASK-011 | Persist debug evidence for each preview attempt. Minimum acceptable implementation: include mask strategy, reference asset IDs, and provider notes in the preview audit log payload. Preferred implementation: also upload the generated mask to a dedicated Cloudinary debug folder and persist the resulting public ID or URL in a preview-accessible record. |  |  |
| TASK-012 | Ensure preview failures still degrade cleanly to `buildSimpleWrapPreview()` or an updated deterministic composite path, but log the AI failure cause verbatim and distinguish `fallback_complete` from `hard_failed`. |  |  |

### Implementation Phase 5

- GOAL-005: Close the gap with targeted validation, not just broad happy-path mocks.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Add unit tests for the new mask builder, board+mask alignment, and Space response parsing under `tests/vitest/unit/lib/visualizer/**`. |  |  |
| TASK-014 | Update `tests/vitest/unit/lib/visualizer/actions/process-visualizer-preview.test.ts` and related action tests to assert the new `mask_guided_inpaint` primary path, classified fallback reasons, and reference URL validation details. |  |  |
| TASK-015 | Run `pnpm lint`, `pnpm typecheck`, `pnpm prisma:validate`, `pnpm test`, and if UI behavior changes materially, `pnpm test:e2e --project=chromium --reporter=line`, then refresh `.agents/json/validation.report.json` with the actual results. |  |  |

## 3. Alternatives

- **ALT-001**: Keep the current `Qwen/Qwen-Image-Edit` board-only `imageToImage` path and tune prompts. Rejected because it does not provide an explicit mask contract and has already produced fallback-only or failed runs in this repo.
- **ALT-002**: Use deterministic tint/composite rendering only. Rejected because it does not match the intended “reference-guided image editing” architecture and produces visibly limited results for complex wraps.
- **ALT-003**: Move preview storage away from Cloudinary. Rejected because storage and delivery are already working, authenticated, and contract-aligned.
- **ALT-004**: Use paid Inference Providers as the primary execution path immediately. Rejected for the first cut because the request is to keep the pipeline cost-conscious and the current repo intent already leans hosted-first with a provider boundary.

## 4. Dependencies

- **DEP-001**: `@gradio/client` for JavaScript Space invocation.
- **DEP-002**: A Hugging Face Space exposing a stable masked-edit endpoint such as `/predict` and returning a resolvable image output.
- **DEP-003**: Existing Cloudinary authenticated upload/delivery helpers in `lib/uploads/storage.ts`, `lib/integrations/cloudinary.ts`, and `lib/visualizer/asset-delivery.ts`.
- **DEP-004**: Existing segmentation helpers in `lib/integrations/huggingface.ts`.
- **DEP-005**: Existing deterministic fallback modules in `lib/visualizer/fallback/**`.

## 5. Files

- **FILE-001**: `d:/CtrlPlus/lib/actions/visualizer.actions.ts` — primary orchestration cutover.
- **FILE-002**: `d:/CtrlPlus/lib/visualizer/huggingface/generate-wrap-preview.ts` — replace generic image-to-image primary path.
- **FILE-003**: `d:/CtrlPlus/lib/visualizer/huggingface/client.ts` — unify Hugging Face preview configuration.
- **FILE-004**: `d:/CtrlPlus/lib/visualizer/huggingface/map-hf-error.ts` — add actionable failure classification.
- **FILE-005**: `d:/CtrlPlus/lib/visualizer/preprocessing/build-generation-input-board.ts` — evolve into paired board + mask generation or split into dedicated modules.
- **FILE-006**: `d:/CtrlPlus/lib/integrations/huggingface.ts` — keep segmentation config and possibly export shared preview config helpers.
- **FILE-007**: `d:/CtrlPlus/lib/uploads/image-processing.ts` — harden reference URL validation and diagnostics.
- **FILE-008**: `d:/CtrlPlus/.env.example` — document Space-based configuration.
- **FILE-009**: `d:/CtrlPlus/package.json` — add `@gradio/client` if adopted.
- **FILE-010**: `d:/CtrlPlus/tests/vitest/unit/lib/visualizer/actions/process-visualizer-preview.test.ts` — assert the new primary path and fallback behavior.
- **FILE-011**: `d:/CtrlPlus/tests/vitest/unit/lib/visualizer/preview-pipeline.test.ts` — add mask/board pipeline coverage.

## 6. Testing

- **TEST-001**: Verify mask normalization produces a binary or near-binary editable region aligned to the board vehicle panel.
- **TEST-002**: Verify no mutation is requested outside the board mask in the Space request payload.
- **TEST-003**: Verify invalid or missing wrap reference URLs produce classified failures that include wrap image identity.
- **TEST-004**: Verify successful Space generation persists a Cloudinary preview asset with `generationMode=mask_guided_inpaint` and `generationProvider=huggingface-space` (or the chosen canonical value).
- **TEST-005**: Verify Space failure degrades to deterministic fallback and preserves audit visibility.
- **TEST-006**: Verify signed preview delivery routes continue to serve authenticated Cloudinary preview outputs unchanged.

## 7. Risks & Assumptions

- **RISK-001**: General segmentation will produce a vehicle silhouette, not true body-panel segmentation. Edge cleanup must stay conservative to avoid painting glass, wheels, or background.
- **RISK-002**: ZeroGPU or public Spaces can queue or throttle. The action layer must treat queue latency as normal and timeouts as degraded output, not silent failure.
- **RISK-003**: Some catalog rows still have mixed Cloudinary authority completeness. Reference URL hardening must tolerate valid legacy `url` values while rejecting malformed values loudly.
- **RISK-004**: If the chosen Space response format changes, the current parser can break. The Space client should validate outputs defensively.
- **ASSUMPTION-001**: Cloudinary remains the only storage system for upload and preview assets.
- **ASSUMPTION-002**: The selected Hugging Face Space can accept one base board image, one mask image, prompt text, and negative prompt text.
- **ASSUMPTION-003**: Existing UI surfaces do not require a new visualizer route contract to consume the improved preview asset.

## 8. Related Specifications / Further Reading

- `.agents/docs/ARCHITECTURE.md`
- `.agents/docs/PRD.md`
- `.agents/instructions/visualizer.instructions.md`
- `.agents/contracts/catalog-visualizer-handoff.contract.yaml`
- `d:/CtrlPlus/lib/actions/visualizer.actions.ts`
- `https://huggingface.co/docs/hub/spaces-api-endpoints`
