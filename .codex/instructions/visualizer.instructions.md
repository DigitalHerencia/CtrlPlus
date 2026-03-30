---
description: Domain instructions for visualizer refactor work
applyTo: app/(tenant)/visualizer/**,features/visualizer/**,components/visualizer/**,lib/actions/visualizer.actions.ts,lib/fetchers/visualizer.fetchers.ts,lib/fetchers/visualizer.mappers.ts,lib/uploads/**,lib/integrations/**
---

# Visualizer Instructions

- Keep visualizer routes thin and status-driven.
- Preserve preview generation, uploads, provider access, and fallback behavior on the server.
- Do not move storage or provider semantics into client modules or presentational components.
- Update `.codex/execution/*.json` when visualizer refactor tasks materially advance.
