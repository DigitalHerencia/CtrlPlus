# Refactor Phase 1: App Shell Thinning

Advance tasks in workstream `WS-001`.

## Goal

Thin route shell files in `app/**` so they delegate orchestration to `features/**` and keep Next.js boundary files focused.

## Requirements

- Read the layer boundary contract first.
- Inspect the target route, its feature entrypoint, and the related fetchers/actions before editing.
- Preserve route-level loading, error, and not-found behavior.
- Update JSON execution state when tasks move forward.
