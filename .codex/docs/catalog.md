# Catalog Domain Spec

## Goal

Refactor catalog browsing and wrap management into a professional, publish-ready catalog system aligned with the target server-first architecture and the visualizer handoff contract.

## Current repo anchors

- `app/(tenant)/catalog/**`
- `features/catalog/**`
- `components/catalog/CatalogManager.tsx`
- `components/catalog/WrapImageManager.tsx`
- `components/catalog/WrapGrid.tsx`
- `components/catalog/WrapCard.tsx`
- `components/catalog/WrapDetail.tsx`
- `lib/catalog/actions/**`
- `lib/catalog/fetchers/**`
- `lib/catalog/assets.ts`
- `lib/catalog/validators/publish-wrap.ts`
- `lib/authz/**`

## Main requirements

- unify the manager workflow
- improve browse, detail, and management UX
- make asset roles explicit in code and UI
- preserve publish validation with explicit publish and unpublish actions
- keep owner and platform-admin catalog actions safe and auditable
- keep visualizer-ready selection server-authoritative

## Key implementation points

- keep route entrypoints thin and move orchestration into `features/catalog/**`
- keep reads in `lib/catalog/fetchers/**` and writes in `lib/catalog/actions/**`
- resolve hero, gallery, and visualizer assets intentionally instead of relying on incidental ordering
- expose DTOs specific to browse, detail, manager, and visualizer selection flows
- keep `hero` and `visualizer_texture` exclusive-active at mutation time
- centralize validation, readiness checks, and asset-role rules
- preserve category mapping, prompt metadata, and asset-management boundaries
- account for audit follow-up work around persisted provider metadata and deterministic upload or delete handling

## UX requirements

- strong filters, search, sort, pagination, and empty states
- clearer wrap cards and detail presentation
- operational manager UI with status, readiness, and action grouping
- safer publish, hide, delete, and asset-management actions
- direct preview handoff from catalog to `/visualizer?wrapId=...`
- browsing and manager surfaces should feel related but not overloaded

## Security/performance focus

- validate mutations server-side
- enforce owner and platform-admin authorization server-side
- keep uploads validated, role-aware, and traceable
- reduce over-fetching and broad invalidation
- public catalog should only surface customer-visible, visualizer-ready wraps
- avoid reusing raw wrap shapes where smaller DTOs are more stable

## Acceptance signals

- catalog routes, features, and server helpers align with the target architecture
- manager supports end-to-end wrap administration cleanly
- publish workflow is clear and reliable
- asset role bugs are reduced or eliminated
- browse, detail, manager, and visualizer-selection DTOs are explicit
- preview CTA only appears for wraps with an active hero and active visualizer texture
