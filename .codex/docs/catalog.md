# Catalog Domain Spec

## Goal

Refactor catalog browsing and wrap management into a storefront-grade wrap product system where the catalog is the authoritative source for customer merchandising, publish-readiness, and deterministic visualizer handoff.

## Authoritative references

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/arch/codex_visualizer_huggingface_generation_spec.md` for downstream handoff expectations

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

## Product framing

- Treat the catalog as a vehicle wrap storefront, not a generic back-office image gallery.
- Each `Wrap` is a selectable product concept that must support both customer-facing presentation and visualizer-facing rendering.
- Public catalog surfaces should only represent wraps that are safe to merchandise and safe to hand off into the visualizer funnel.

## Source-of-truth responsibilities

The catalog owns:

- wrap CRUD and visibility
- wrap categories
- asset uploads and asset-role resolution
- publish-readiness validation
- customer browse and detail presentation
- manager workflows for owner and admin users
- visualizer selection payload construction

The catalog does not own:

- preview generation
- vehicle upload ingestion
- preview lifecycle or storage
- fallback rendering implementation

## Required contracts

### Asset role contract

The catalog must standardize `WrapImage.kind` around a shared `WrapImageKind` contract with these role values:

- `hero`
- `gallery`
- `visualizer_texture`
- `visualizer_mask_hint`

Public and manager surfaces must resolve image meaning by role, never by `images[0]` or incidental ordering.

### DTO contract

The catalog should expose explicit DTOs for each surface instead of reusing raw wrap payloads:

- `WrapCatalogCardDTO`
- `WrapDetailViewDTO`
- `WrapManagerRowDTO`
- `WrapPublishReadinessDTO`
- `VisualizerWrapSelectionDTO`

### Fetcher and action contract

The primary catalog contracts to preserve or introduce are:

- `searchWrapsForCatalog`
- `getWrapDetailView`
- `getWrapManagerRows`
- `getVisualizerSelectableWrapById`
- `publishWrap`
- `unpublishWrap`

## Core requirements

- catalog browse must feel like a modern product catalog with search, filters, sort, pagination, counts, and strong empty states
- wrap detail must present hero image, gallery, product metadata, pricing, install duration, categories, and direct next actions
- manager workflows must clearly distinguish display assets from visualizer assets
- hero and visualizer texture roles must be exclusive-active for MVP
- publish-readiness must be deterministic and explainable to operators
- catalog handoff to the visualizer must use `/visualizer?wrapId=...` and server-side validation

## Publish-readiness baseline

A wrap should only be treated as publishable when the catalog can prove, at minimum:

- the wrap is not soft-deleted
- the wrap has a non-empty name
- the wrap has a valid price
- there is one active hero image
- there is enough public imagery for detail presentation
- there is exactly one active visualizer texture
- referenced assets are active and not deleted

Publish-readiness should expose both issues and warnings so the manager can support safe operator decisions.

## UX requirements

- wrap cards must show the resolved hero image and must not derive their image from raw array order
- detail pages must render grouped asset roles, not a generic unordered image collection
- preview CTA visibility should be driven by server-authoritative visualizer availability
- manager UI should show readiness state, missing-asset warnings, active-role badges, and safe actions for replace/remove flows
- browse and manager surfaces should feel related, but should not collapse storefront UX into operator tooling

## Security/performance focus

- validate all catalog mutations server-side
- enforce owner and platform-admin authorization server-side
- keep upload validation, asset-role enforcement, and scope decisions on the server boundary
- keep card payloads small and explicit
- avoid duplicate fetches and broad invalidation
- preserve traceability for asset versioning and provider metadata where catalog data feeds the visualizer

## Acceptance signals

- catalog routes, features, and server helpers align with the target architecture
- the catalog behaves like a wrap storefront rather than a generic image list
- asset-role bugs caused by unordered image arrays are removed
- publish-readiness is explainable and deterministic
- manager workflows support end-to-end wrap administration cleanly
- visualizer handoff uses an explicit catalog-owned DTO and only exposes server-approved wraps
