# Catalog + Visualizer Ship Readiness Roadmap

## Active Decisions
- Single-store canonical architecture.
- Cloudinary-first asset storage with local fallback only where explicitly allowed.
- Neon MCP workflow for all production DB changes.
- Notion sync deferred until Notion MCP connector is enabled.

## Milestones
1. QA baseline: ignore hygiene, CI split, Playwright bootstrap, E2E contract cleanup.
2. Catalog completion: management UI, capability gating, empty-state CTAs.
3. Asset contract + storage: role-aware wrap assets + Cloudinary pipeline.
4. Visualizer hardening: safe upload sources, ownership isolation, cache identity hardening.
5. Visualizer alignment: catalog texture source default, synthetic fallback only.
6. Release polish: test matrix pass, accessibility/perf checks, ship checklist completion.

## Tracking
- GitHub epic and issue IDs are source of truth.
- Mirror here when Notion is unavailable.
