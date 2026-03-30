# CtrlPlus Codex Scaffold

This directory is the durable agent context for the upcoming catalog and visualizer delivery program.

## Active Program

- Program ID: `CTRLPLUS-CATALOG-VISUALIZER-001`
- Status: prep complete, ready for bounded implementation passes
- Scope: catalog storefront correctness, visualizer generation pipeline hardening, and catalog-to-visualizer handoff stability

## Model

- Markdown is the thinking layer.
- YAML is the contract layer.
- JSON is the execution layer.

## Active Source Documents

- `SRC-CATALOG-MIGRATION-2026-03-30`: `C:\Users\scree\Documents\DevNotes\Codex Implementation Spec Catalog Wrap-Driven Visualizer Migration.md`
- `SRC-VISUALIZER-GEN-2026-03-30`: `C:\Users\scree\Documents\DevNotes\Codex Implementation Spec Visualizer Generation Pipeline Catalog-Driven Hugging Face Cloudinary.md`
- `SRC-VISUALIZER-AUDIT-2026-03-30`: `C:\Users\scree\Documents\DevNotes\Vehicle Wrap Visualizer Research and Implementation Audit.md`
- `SRC-REPO-GUIDE-2026-03-30`: [AGENTS.md](D:\CtrlPlus\AGENTS.md)
- `SRC-REPO-STATE-2026-03-30`: [package.json](D:\CtrlPlus\package.json), [prisma/schema.prisma](D:\CtrlPlus\prisma\schema.prisma), [lib/fetchers/catalog.fetchers.ts](D:\CtrlPlus\lib\fetchers\catalog.fetchers.ts), [lib/actions/visualizer.actions.ts](D:\CtrlPlus\lib\actions\visualizer.actions.ts), [lib/uploads/storage.ts](D:\CtrlPlus\lib\uploads\storage.ts), [lib/integrations/huggingface.ts](D:\CtrlPlus\lib\integrations\huggingface.ts)
- Background only: `C:\Users\scree\Documents\DevNotes\Thinking vs Execution vs Machines.md`
- Background only: `C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md`

## Read Order

1. This file
2. `.codex/instructions/catalog.instructions.md`
3. `.codex/instructions/visualizer.instructions.md`
4. `.codex/docs/catalog.md`
5. `.codex/docs/visualizer.md`
6. `.codex/arch/codex_catalog_visualizer_migration_spec.md`
7. `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
8. `.codex/contracts/catalog-visualizer.contract.yaml`
9. `.codex/contracts/domain-map.yaml`
10. `.codex/contracts/route-layer-contract.yaml`
11. `.codex/execution/context-map.json`
12. `.codex/execution/backlog.json`
13. `.codex/execution/progress.json`
14. `.codex/execution/decisions.json`
15. `.codex/execution/validation.json`
16. `.codex/execution/handoff.json`
17. relevant `.codex/prompts/*.md`

Generic refactor docs remain valid background context but are no longer the primary intake path for catalog or visualizer work.

## Directory Roles

- `.codex/arch/`: normalized architecture and migration specs
- `.codex/docs/`: domain notes, current-state summaries, and acceptance framing
- `.codex/instructions/`: execution rules for catalog and visualizer changes
- `.codex/contracts/`: machine-readable domain contracts and cross-domain invariants
- `.codex/execution/`: machine-readable backlog, context map, readiness state, and handoff guidance
- `.codex/prompts/`: bounded prompts for repeated delivery passes

## Operating Rules

- Treat the three external source specs as authoritative intent and the live repo files as authoritative implementation reality.
- Keep markdown, YAML, and JSON aligned when domain boundaries, task sequencing, or validation expectations change.
- Prefer updating existing catalog and visualizer artifacts over adding parallel generic notes.
- Do not let stale refactor-program state override the catalog or visualizer delivery program.
