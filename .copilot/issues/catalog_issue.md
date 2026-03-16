# Issue: Catalog UX and Manager Refactor

## Labels

feature, catalog, refactor

## References

PRD.md
TECH-REQUIREMENTS.md
catalog.domain.md

## Summary

Refactor catalog browsing and wrap management to be production ready with deterministic asset usage and improved management workflow.

## Scope

- app/(tenant)/catalog/\*\*
- components/catalog/\*\*
- lib/catalog/\*\*

## Implementation tasks

### 1. Catalog browsing

Improve:

- search
- filters
- pagination
- sort

Ensure deterministic display asset resolution.

### 2. Wrap manager workflow

Unify:

- Wrap metadata editing
- category management
- asset management
- publish readiness

### 3. Publish validation

Use existing validator but improve UX:

- show readiness state
- show missing asset roles

### 4. Asset handling

Explicit roles:

- thumbnail
- display
- visualizer texture

### 5. Security

- enforce owner permissions
- validate upload types

## QA / CI

- lint
- typecheck
- prisma validate
- build

Playwright

catalog browse → detail → manager flow

## Completion criteria

- professional catalog UI
- deterministic asset resolution
- publish workflow clear
- manager workflow usable
