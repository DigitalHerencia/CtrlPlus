# Issue: Visualizer Refactor and Production Hardening

## Labels

feature, visualizer, refactor

## References

- PRD.md
- TECH-REQUIREMENTS.md
- visualizer.domain.md

## Summary

Refactor the vehicle visualizer to be production‑ready while preserving current architecture (`app → components → lib/actions/fetchers`). Improve upload validation, preview generation reliability, and UX states.

## Scope

Paths primarily affected:

- app/(tenant)/visualizer/page.tsx
- components/visualizer/\*\*
- lib/visualizer/\*\*

## Implementation tasks

### 1. Upload hardening

- validate mime, size, dimensions server-side
- ensure uploads stored via storage layer (`lib/visualizer/storage.ts`)
- prevent inline large payloads

### 2. Preview pipeline stability

- refactor preview pipeline to status model: pending | processing | ready | failed
- prevent duplicate generation using deterministic cache key

### 3. UI flow improvements

- clean wrap selection UX
- explicit upload → generate → preview states
- retry path for failures

### 4. Security

- verify wrap ownership
- verify preview ownership
- validate uploaded sources

### 5. Performance

- reuse preview cache
- avoid synchronous blocking generation

## QA / CI

- pnpm lint
- pnpm typecheck
- pnpm build
- pnpm test

Playwright

- visualizer flow: select wrap → upload → preview

## Completion criteria

- preview generation reliable
- UI states complete
- security checks enforced
- tests passing
