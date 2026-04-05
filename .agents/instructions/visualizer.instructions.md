---
description: Visualizer domain interpretation for AI preview lifecycle and media handling.
applyTo: "app/(tenant)/visualizer/**, components/visualizer/**, features/visualizer/**, lib/actions/visualizer*.ts, lib/fetchers/visualizer*.ts, app/api/visualizer/**"
---

## Purpose

Interpret the visualizer as an AI-assisted concept preview flow with explicit lifecycle
states and storage-backed outputs.

## Interpretation guidance

- Treat visualizer as concept preview, not manufacturing proofing.
- Enforce preview status lifecycle: `pending`, `processing`, `complete`, `failed`.
- Keep wrap selection and preview ownership validated server-side.
- Persist source uploads and generated outputs via storage references (not inline blobs).
- Preserve fallback behavior when inference provider is unavailable.

## Reliability interpretation

- Keep generation async and traceable.
- Ensure status and failure details are operator-debuggable.

## References

- `.agents/docs/PRD.md`
- `.agents/docs/TECHNOLOGY-REQUIREMENTS.md`
- `.agents/contracts/data-access.contract.yaml`
- `.agents/contracts/security.contract.yaml`
