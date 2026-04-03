---
description: Caching and revalidation audit. Ensures all read paths have explicit correct caching semantics and all mutations properly invalidate cache. Eliminates stale data risks in scheduling, billing, and visualizer flows.
---

# POST-REFACTOR ENFORCEMENT PROMPT — CACHE ME OUTSIDE HOW BOUT DAT

You are performing a caching and revalidation audit.

## Mission

Ensure all read paths have explicit, correct caching semantics and that all mutations properly invalidate cache. Eliminate stale data risks, especially in scheduling, billing, and visualizer flows.

## Canonical rules to enforce

- Caching ownership belongs on the read side (fetchers).
- Cache strategy must not live in UI or components.
- Actions must invalidate cache after successful mutations.
- Real-time sensitive domains (billing, scheduling, preview status) must not rely on stale data.

## Audit objectives

1. Find fetchers with no explicit caching strategy.
2. Find inconsistent TTL/tag usage across domains.
3. Find actions that mutate state but do not trigger revalidation.
4. Find stale UI patterns (e.g. preview status, booking slots, invoice status).
5. Find client-side assumptions masking stale server state.
6. Find duplicated fetch logic with conflicting cache semantics.

## Correction rules

- Define explicit cache strategy in each fetcher:
  - static / ISR / dynamic / no-store
- Add tag-based invalidation for domain entities.
- Ensure actions call `revalidateTag` or `revalidatePath` appropriately.
- Remove UI-driven freshness hacks.
- Prefer server truth over optimistic illusions when correctness matters.

## Deliverables

- Apply cache strategy normalization.
- Output changes grouped by:
  - Fetcher cache fixes
  - Revalidation fixes
  - Stale data risk fixes
- Output "high-risk stale zones" list.

## Verification checklist

- No stale booking slots
- No stale invoice/payment states
- Preview lifecycle reflects real status
- Cache invalidation always follows writes
