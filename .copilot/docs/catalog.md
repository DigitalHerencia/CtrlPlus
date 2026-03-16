# Catalog Domain Spec

## Goal

Refactor catalog browsing and wrap management into a professional, publish-ready catalog system aligned with current repo patterns.

## Current repo anchors

- `app/(tenant)/catalog/**`
- `components/catalog/CatalogManager.tsx`
- `components/catalog/WrapImageManager.tsx`
- `components/catalog/WrapGrid.tsx`
- `components/catalog/WrapCard.tsx`
- `lib/catalog/actions/*`
- `lib/catalog/fetchers/*`
- `lib/catalog/validators/publish-wrap.ts`

## Main requirements

- unify manager workflow
- improve browsing UX
- make asset roles explicit in usage
- preserve publish validation
- keep owner/admin actions safe and auditable

## Key implementation points

- resolve hero/display assets intentionally
- stop relying on incidental image ordering
- centralize validation rules
- reduce fragmented wrap management flows
- preserve category mapping and asset management boundaries

## UX requirements

- better filters/search/sort/pagination
- clearer wrap cards and detail presentation
- operational manager UI with status, readiness, and actions
- safer publish/hide/delete actions

## Security/performance focus

- validate mutations server-side
- enforce owner/admin authorization
- keep uploads validated and role-aware
- reduce over-fetching and broad invalidation

## Acceptance signals

- catalog looks and behaves like a real product surface
- manager supports end-to-end wrap administration cleanly
- publish workflow is clear and reliable
- asset role bugs are reduced or eliminated
