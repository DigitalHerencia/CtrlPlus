---
title: CtrlPlus Catalog Refactor Notes
status: Draft
owner: Codex
last_updated: 2026-03-29
---

# CtrlPlus Catalog Refactor Notes

The catalog domain remains the storefront and wrap-management source of truth during the server-first refactor.

## Focus

- Keep catalog browse and detail routes thin in `app/(tenant)/catalog/**`
- Preserve orchestration in `features/catalog/**`
- Keep wrap DTO shaping, publish readiness, and visualizer handoff server-authoritative

## Non-Negotiables

- Never infer asset meaning from unordered image arrays.
- Keep catalog-to-visualizer handoff server-validated through wrap identity.
- Do not move publish-readiness rules into route files or presentational components.

## Use With

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/instructions/catalog.instructions.md`
- `.codex/prompts/catalog.refactor.prompt.md`
