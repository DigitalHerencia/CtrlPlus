---
description: Domain instructions for catalog refactor work
applyTo: app/(tenant)/catalog/**,features/catalog/**,components/catalog/**,lib/actions/catalog.actions.ts,lib/fetchers/catalog.fetchers.ts,lib/fetchers/catalog.mappers.ts
---

# Catalog Instructions

- Keep catalog routes thin and server-first.
- Preserve catalog as the source of truth for wrap discovery, detail presentation, publish readiness, and visualizer handoff.
- Keep asset resolution, publish readiness, and visualizer selection logic below UI layers.
- Update `.codex/execution/*.json` when catalog refactor tasks materially advance.
