---
title: Visualizer Hugging Face Generation Spec
status: Active
owner: Copilot
last_updated: 2026-03-30
---

# Visualizer Hugging Face Generation Spec

This spec captures the provider-specific constraints that matter during the next visualizer delivery passes.

## Source Provenance

- `SRC-VISUALIZER-GEN-2026-03-30`
- `SRC-VISUALIZER-AUDIT-2026-03-30`
- `SRC-REPO-STATE-2026-03-30`

## Provider Boundary

- Hugging Face generation remains behind a dedicated adapter boundary.
- The client must not own model selection, provider credentials, or fallback logic.
- Storage persistence remains durable and traceable through server-managed metadata.
- Cloudinary is the intended durable image store for catalog-backed preview generation.

## Preview Rules

- The visualizer texture selected from catalog assets is the authoritative design reference.
- The uploaded vehicle image is the structural base for generation.
- Fallback preview generation remains required when external inference is unavailable or unstable.
- Prompt construction, conditioning-board generation, and provider timeouts stay server-side.

## Refactor Guidance

- Preserve preview lifecycle state through DTOs and fetchers.
- Keep provider requests, timeouts, and retries inside server-side integration layers.
- Keep UI optimistic behavior bounded to status display rather than fake synchronous completion.
- Do not let missing environment documentation become the reason the pipeline fails to start.

## Delivery Readiness Notes

- The repo already has a functioning primary Hugging Face path and deterministic fallback path.
- The biggest remaining readiness gap before implementation was environment and prompt scaffolding, not provider code absence.
