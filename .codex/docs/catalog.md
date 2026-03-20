# Catalog Domain Spec

## Goal

Refactor catalog browsing and wrap management into a professional, publish-ready catalog system aligned with current repo patterns and the visualizer handoff contract.

## Current repo anchors

- `app/(tenant)/catalog/**`
- `components/catalog/CatalogManager.tsx`
- `components/catalog/WrapImageManager.tsx`
- `components/catalog/WrapGrid.tsx`
- `components/catalog/WrapCard.tsx`
- `components/catalog/WrapDetail.tsx`
- `lib/catalog/actions/*`
- `lib/catalog/fetchers/*`
- `lib/catalog/assets.ts`
- `lib/catalog/validators/publish-wrap.ts`

## Main requirements

- unify manager workflow
- improve browsing UX
- make asset roles explicit in usage
- preserve publish validation with explicit publish/unpublish actions
- keep owner/admin actions safe and auditable
- keep visualizer-ready selection server-authoritative

## Key implementation points

- resolve hero/display assets intentionally
- stop relying on incidental image ordering
- centralize validation rules
- expose wrap DTOs specific to browse, detail, manager, and visualizer selection
- keep `hero` and `visualizer_texture` exclusive-active at mutation time
- reduce fragmented wrap management flows
- preserve category mapping and asset management boundaries
- keep wrap prompt metadata (`aiPromptTemplate`, `aiNegativePrompt`) at the wrap level

## UX requirements

- better filters/search/sort/pagination
- clearer wrap cards and detail presentation
- operational manager UI with status, readiness, and actions
- safer publish/hide/delete actions
- direct preview handoff from catalog to `/visualizer?wrapId=...`

## Security/performance focus

- validate mutations server-side
- enforce owner/admin authorization
- keep uploads validated and role-aware
- reduce over-fetching and broad invalidation
- public catalog should only surface customer-visible, visualizer-ready wraps

## Acceptance signals

- catalog looks and behaves like a real product surface
- manager supports end-to-end wrap administration cleanly
- publish workflow is clear and reliable
- asset role bugs are reduced or eliminated
- preview CTA only appears for wraps with an active hero and active visualizer texture
