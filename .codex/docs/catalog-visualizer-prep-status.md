---
title: Catalog Visualizer Prep Status
status: Active
owner: Codex
last_updated: 2026-03-30
---

# Catalog Visualizer Prep Status

This document captures the final prep-pass status before resuming planned catalog and visualizer development.

## Source Documents Reviewed

- `C:\Users\scree\Documents\DevNotes\Codex Implementation Spec Catalog Wrap-Driven Visualizer Migration.md`
- `C:\Users\scree\Documents\DevNotes\Codex Implementation Spec Visualizer Generation Pipeline Catalog-Driven Hugging Face Cloudinary.md`
- `C:\Users\scree\Documents\DevNotes\Vehicle Wrap Visualizer Research and Implementation Audit.md`

## What Is Already True In The Live Repo

- Catalog already owns wrap asset roles, publish readiness, and visualizer selection through `lib/fetchers/catalog.fetchers.ts` and `lib/fetchers/catalog.mappers.ts`.
- Visualizer already owns preview lifecycle, generation fallback, and preview persistence through `lib/actions/visualizer.actions.ts`, `lib/uploads/image-processing.ts`, and `lib/uploads/storage.ts`.
- Prisma already includes `WrapImage.kind`, `Wrap.aiPromptTemplate`, `Wrap.aiNegativePrompt`, and `VisualizerPreview.sourceWrapImageId/sourceWrapImageVersion`.
- The repo already has catalog and visualizer component surfaces plus unit and Playwright tests that map to the intended product flow.

## Why This Prep Pass Was Needed

The implementation is ahead of the `.codex` scaffold. Before this pass, the agent-facing docs and prompts were still high-level and generic, which increased the risk that the next implementation run would:

- ignore the current file layout
- duplicate logic that already exists
- miss known repo blockers
- drift away from the external catalog and visualizer specs

## Readiness Assessment

The repo is not fully green, so development is not in a clean-signoff state.

Current readiness position:

- Catalog and visualizer domain direction is clear.
- The architecture boundaries are strong enough to continue work.
- The `.codex` guidance is now aligned to the external specs and the live codebase.
- Local quality gates are currently failing, so future implementation should treat the repo as conditionally ready rather than fully green.

## Verified Command Outcomes

See `.codex/execution/catalog-visualizer.validation.json` for machine-readable results.

Summary:

- `node -v`: passes on `24.14.0`
- `pnpm -v`: passes on `10.32.1`
- `pnpm prisma:validate`: passes
- `pnpm lint`: fails
- `pnpm typecheck`: fails
- `pnpm test`: fails

## Highest-Risk Current Blockers

1. Import and alias drift across multiple domains causes broad typecheck failures.
2. Vitest cannot currently resolve some `server-only` imports in the test environment.
3. Legacy test files still reference removed or renamed catalog and visualizer symbols.
4. Cloudinary and Hugging Face placeholders are now documented in `.env.example`, but the active local env still does not expose the populated secrets required for full preview generation.
5. There is no repo-local `.github/workflows` CI workflow committed, so local command execution is the actual validation source of truth for now.

## How The Next Implementation Pass Should Proceed

1. Read the current execution files under `.codex/execution/catalog-visualizer*.json`.
2. Pick one bounded prompt from `.codex/prompts/`.
3. Keep work inside one catalog or visualizer phase unless explicitly broadening to integration.
4. Repair shared blockers only when they directly block the selected phase.
5. Update the execution JSON artifacts after each meaningful pass so the next agent inherits current state.
