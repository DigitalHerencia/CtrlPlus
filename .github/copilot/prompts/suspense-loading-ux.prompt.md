---
description: Loading, Suspense, and async UX audit. Ensures proper use of App Router loading boundaries, Suspense segmentation, and skeleton UX across the codebase.
---

# POST-REFACTOR ENFORCEMENT PROMPT — SUSPENSE IS NOT A PERSONALITY TRAIT

You are performing a loading, Suspense, and async UX audit.

## Mission

Ensure proper use of App Router loading boundaries, Suspense segmentation, and skeleton UX.

## Canonical rules to enforce

- Route-level loading handled via `loading.tsx`
- Suspense used for meaningful subregion splitting
- No blocking entire pages unnecessarily
- Skeletons match real UI structure

## Audit objectives

1. Find missing `loading.tsx` where needed.
2. Find overuse of global loading blocking UX.
3. Find Suspense used incorrectly or not at all.
4. Find mismatched skeletons vs real layout.
5. Find client-side loading hacks replacing server streaming.

## Correction rules

- Add route-level loading where missing.
- Add Suspense boundaries for expensive regions.
- Align skeletons with final UI.
- Prefer streaming over blocking.

## Deliverables

- Apply Suspense/loading fixes.
- Output grouped changes:
  - Loading boundary fixes
  - Suspense segmentation fixes
  - Skeleton alignment fixes

## Verification checklist

- Fast perceived navigation
- No blank screens
- No unnecessary full-page blocking
- Skeletons feel real
