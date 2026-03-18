---
description: 'Domain instructions for catalog and wrap management'
applyTo: 'app/(tenant)/catalog/**,components/catalog/**,lib/catalog/**'
---

# Catalog Domain Instructions

## Domain purpose

The catalog domain manages wrap browsing, filtering, detail views, wrap CRUD, categories, asset roles, and publish readiness.

## Scope boundaries

This domain owns:

- catalog list/detail pages
- wrap management UI
- category management
- wrap asset management
- publish validation
- catalog filtering/search params

This domain does not own:

- visualizer preview generation
- scheduling capacity
- billing payment flows
- platform recovery operations

## Required patterns

- Keep route pages thin and server-first.
- Reads belong in `lib/catalog/fetchers/**`.
- Writes belong in `lib/catalog/actions/**`.
- Validation belongs in domain validators/types, not ad hoc page logic.
- Asset handling belongs in `lib/catalog/image-storage.ts` and related actions.

## Product requirements

- Public catalog must only show publishable, allowed wraps.
- Wrap cards must resolve the correct display asset intentionally.
- Do not rely on `images[0]` semantics.
- Publishing must be blocked if required asset roles are missing.
- Catalog management must support coherent owner workflows: create, edit, assign categories, manage assets, validate, publish/hide.

## UI requirements

- Browsing UI must support search, filters, sort, pagination, and clear empty states.
- Manager UI must feel operational and safe, not prototype-level.
- `CatalogManager` and `WrapImageManager` should behave like one coherent admin workflow.
- Use status badges, confirmations, validation summaries, and clear action labels.
- Distinguish display assets from visualizer assets clearly.

## Security requirements

- Enforce owner/admin catalog permissions server-side.
- Never trust client-provided wrap scope or category scope without validation.
- Validate uploads, asset roles, and mutation payloads.
- Keep delete/hide/publish actions explicit and auditable.

## Performance requirements

- Avoid duplicate catalog queries.
- Keep filter/search param handling deterministic.
- Use targeted revalidation instead of broad invalidation when practical.
- Prefer small card payloads and avoid over-fetching image metadata when not needed.

## Testing requirements

Add or update tests when changing:

- wrap CRUD
- category mappings
- publish validation
- asset role handling
- filter/search behavior
- pagination behavior
- manager workflows

## Refactor priorities

1. unify wrap manager workflow
2. make asset-role resolution deterministic everywhere
3. centralize validation rules
4. improve publish-readiness UX
5. tighten caching and revalidation behavior
