---
description: Data table state and routing consistency audit. Ensures table search/filter/pagination state is URL-driven and consistent across all domains.
---

# POST-REFACTOR ENFORCEMENT PROMPT — URLS DON'T LIE (TABLE STATE & SEARCH PARAMS)

You are auditing data table state and routing consistency.

## Mission

Ensure table state is URL-driven and consistent across domains.

## Canonical rules to enforce

- Search/filter/pagination should be URL-driven
- `searchParams` parsed centrally
- Fetchers shape table rows
- Components remain dumb renderers

## Audit objectives

1. Find local state controlling table pagination/filter.
2. Find inconsistent query param usage.
3. Find table rows shaped in components.
4. Find duplicated filtering logic client-side.
5. Find missing deep-linking support.

## Correction rules

- Move state to URL.
- Centralize parsing.
- Shape rows in fetchers/features.
- Keep UI stateless where possible.

## Deliverables

- Apply table state normalization.
- Output grouped changes:
  - URL state fixes
  - Fetcher shaping fixes
  - Component simplifications

## Verification checklist

- Tables are linkable
- Filters persist in URL
- No duplicated logic
- Clean separation of concerns
