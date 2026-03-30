# Catalog Visualizer Phase 03 Prompt

Use this prompt for integrated validation once catalog and visualizer implementation passes are in
place.

## Objective

Verify the storefront funnel from catalog browse through preview generation without weakening domain
boundaries.

## Scope

- catalog browse
- catalog detail
- preview CTA handoff
- visualizer preload
- preview creation, processing, and polling
- manager-facing fixes only when directly required to unblock the funnel

## Required Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e --project=chromium --reporter=line`
