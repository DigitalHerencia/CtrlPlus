# Release Checklist

## Pre-Release
- [ ] `pnpm check` passes locally.
- [ ] CI fast-quality job green.
- [ ] CI domain-e2e job green.
- [ ] Neon migrations prepared, validated, and approved.

## Domain Readiness
- [ ] Owner/admin can manage wraps, categories, and asset roles.
- [ ] Customer catalog and visualizer flows function end-to-end.
- [ ] Visualizer ownership and safe-source checks enforced.
- [ ] Synthetic texture fallback only when no visualizer texture asset exists.

## UX/Quality
- [ ] Empty states provide correct owner/customer guidance.
- [ ] Skeleton/loading states present in interactive surfaces.
- [ ] Image handling reviewed for `next/image` compliance or documented exceptions.

## Rollback
- [ ] Migration rollback notes captured.
- [ ] Feature flags or safe fallback paths confirmed.
- [ ] Incident owner and validation checklist documented.
