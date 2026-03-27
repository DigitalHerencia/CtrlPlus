# Catalog Phase 2 Prompt: Public Storefront

## Mission

Refactor the customer-facing catalog browse and detail experience to consume the new catalog DTOs and behave like a wrap storefront.

## Authoritative specs

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/docs/catalog.md`
- `.codex/instructions/catalog.instructions.md`

## Upstream prerequisites

- `catalog.phase-1.asset-resolution-and-dtos.prompt.md` is complete and verified

## Scope anchors

- `app/(tenant)/catalog/**`
- `features/catalog/**`
- `components/catalog/**`
- supporting catalog fetchers and tests

## Exact implementation slice

- keep catalog route files thin and server-first
- refactor browse and detail fetchers to consume the resolved DTOs
- update public catalog list UI to show resolved hero imagery, product metadata, filters, sort, pagination, and clear empty states
- update wrap detail UI to show hero image, gallery, pricing, install duration, categories, description, and direct next actions
- gate preview CTA visibility using server-authoritative visualizer availability

## Non-goals

- do not refactor manager workflows
- do not implement visualizer runtime changes beyond consuming the existing handoff URL contract

## Required contracts to preserve

- no public surface relies on unordered image arrays
- public catalog only shows server-approved wraps
- browse and detail pages consume explicit catalog DTOs
- `/visualizer?wrapId=...` remains the preview entry contract

## Validation and tests

- add or update tests proving wrap cards use the resolved hero image
- add or update tests for detail gallery rendering
- add or update tests for hidden or non-ready wrap exclusion
- add or update catalog browse/detail smoke coverage if affected

## Completion criteria

- public catalog feels like a storefront rather than a gallery
- detail pages consume deterministic asset groupings
- preview CTA logic is correct and server-authoritative
- the next phase can build manager UX on the same DTO and readiness foundation
