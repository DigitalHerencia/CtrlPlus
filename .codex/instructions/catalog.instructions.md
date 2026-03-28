---
description: 'Domain instructions for catalog and wrap management'
applyTo: 'app/(tenant)/catalog/**,components/catalog/**,lib/actions/catalog.actions.ts,lib/fetchers/catalog.fetchers.ts,lib/utils/catalog-assets.ts,lib/utils/search-params.ts,lib/uploads/**,schema/catalog.ts'
---

# Catalog Domain Instructions

## Domain purpose

The catalog domain manages wrap storefront browsing, filtering, detail views, wrap CRUD, categories, asset roles, publish-readiness, and deterministic handoff into the visualizer.

## Scope boundaries

This domain owns:

- catalog list/detail pages
- wrap management UI
- category management
- wrap asset management
- publish-readiness evaluation
- catalog filtering/search params
- visualizer selection payload construction

This domain does not own:

- visualizer preview generation
- vehicle image upload ingestion
- scheduling capacity
- billing payment flows
- platform recovery operations

## Required patterns

- Keep route pages thin and server-first.
- Reads belong in `lib/fetchers/catalog.fetchers.ts`.
- Writes belong in `lib/actions/catalog.actions.ts`.
- Future refactors should move route composition into `features/catalog/**`.
- Validation belongs in domain validators/types, not ad hoc page logic.
- Asset handling belongs in catalog-domain helpers and actions, not route files.
- Resolve display and visualizer image roles in domain helpers or DTO builders, never in page components.

## Hard product requirements

- Treat the catalog as a wrap storefront, not a generic image gallery.
- Public catalog must only show publishable, allowed wraps.
- Public catalog browse and preview CTAs must only surface server-approved wraps.
- Wrap cards must resolve the correct display asset intentionally.
- Do not rely on `images[0]` semantics.
- Publishing must be blocked if required asset roles are missing.
- Publishing must go through explicit `publishWrap` / `unpublishWrap` actions.
- Catalog-to-visualizer routing must use `/visualizer?wrapId=...` and server-side wrap validation.

## Asset-role contract

Standardize `WrapImage.kind` semantics around a shared `WrapImageKind` contract with these values:

- `hero`
- `gallery`
- `visualizer_texture`
- `visualizer_mask_hint`

Required role behavior:

- `hero`: exactly one active hero per wrap for MVP
- `gallery`: zero or more active images, ordered intentionally
- `visualizer_texture`: exactly one active texture per wrap for MVP
- `visualizer_mask_hint`: optional helper asset, not required for MVP publishability unless future rules say otherwise

Required resolution behavior:

- hero resolution must filter by role and active state
- gallery resolution must filter by role and active state, then order deterministically
- visualizer texture resolution must filter by role and active state and fail readiness if multiple active textures exist
- conflicting active assets should surface readiness issues, not hidden behavior

## DTO and fetcher boundaries

- Use catalog-owned DTOs for browse, detail, manager, publish-readiness, and visualizer selection flows.
- Preserve or introduce explicit DTOs such as `WrapCatalogCardDTO`, `WrapDetailViewDTO`, `WrapManagerRowDTO`, `WrapPublishReadinessDTO`, and `VisualizerWrapSelectionDTO`.
- Preserve or introduce explicit fetchers such as `searchWrapsForCatalog`, `getWrapDetailView`, `getWrapManagerRows`, and `getVisualizerSelectableWrapById`.
- Do not expose raw unordered image arrays to components that need resolved role-specific assets.

## UI requirements

- Catalog management must support coherent owner workflows: create, edit, assign categories, manage assets, validate, publish, hide, and delete.
- `CatalogManager` and `WrapImageManager` should behave like one coherent admin workflow.
- Distinguish display assets from visualizer assets clearly.
- Show readiness badges, missing asset warnings, active-role badges, and safe remove or replace actions.
- Make hero and visualizer texture exclusivity obvious in UI and enforced in mutations.

## Security requirements

- Enforce owner/admin catalog permissions server-side.
- Never trust client-provided wrap scope or category scope without validation.
- Validate uploads, asset roles, and mutation payloads server-side.
- Keep delete/hide/publish actions explicit and auditable.
- Keep wrap-level prompt metadata server-side and typed with the rest of catalog DTOs.

## Performance requirements

- Avoid duplicate catalog queries.
- Keep filter/search param handling deterministic.
- Use targeted revalidation instead of broad invalidation when practical.
- Prefer small card payloads and avoid over-fetching image metadata when not needed.
- Use catalog-specific DTOs for browse/detail/manager/visualizer selection instead of reusing raw `WrapDTO` everywhere.
- Preserve traceability for provider metadata and asset versioning where catalog data feeds the visualizer.

## Testing requirements

Add or update tests when changing:

- wrap CRUD
- category mappings
- publish-readiness validation
- hero, gallery, and visualizer texture resolution
- filter/search behavior
- pagination behavior
- manager workflows
- catalog-to-visualizer handoff

## Refactor priorities

1. make asset-role resolution deterministic everywhere
2. centralize publish-readiness rules and DTO shaping
3. unify wrap manager workflow
4. improve public storefront correctness
5. preserve clean, server-authoritative visualizer handoff
