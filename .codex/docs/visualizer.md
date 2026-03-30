---
title: CtrlPlus Visualizer Refactor Notes
status: Draft
owner: Codex
last_updated: 2026-03-29
---

# CtrlPlus Visualizer Refactor Notes

The visualizer domain remains a status-driven AI concept preview flow, not a manufacturing proofing system.

## Focus

- Keep visualizer routes thin in `app/(tenant)/visualizer/**`
- Preserve orchestration in `features/visualizer/**`
- Keep uploads, preview generation, fallback behavior, and preview ownership on the server

## Non-Negotiables

- Preview status remains explicit: `pending`, `processing`, `complete`, `failed`.
- Vehicle uploads and generated previews must remain durable storage references, not inline payloads.
- Provider logic stays behind integrations or upload boundaries.

## Use With

- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/instructions/visualizer.instructions.md`
- `.codex/prompts/visualizer.refactor.prompt.md`
