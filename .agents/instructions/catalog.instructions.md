---
description: Catalog domain interpretation for wrap storefront, assets, and publish readiness.
applyTo: "app/(tenant)/catalog/**, components/catalog/**, features/catalog/**, lib/actions/catalog*.ts, lib/fetchers/catalog*.ts"
---

## Purpose

Interpret catalog behavior as the system of record for wrap discovery and visualizer
handoff.

## Interpretation guidance

- Use explicit asset role semantics (`hero`, `gallery`) and never infer role from
  array position.
- Keep publish-readiness checks deterministic and server-authoritative.
- Keep browse/detail DTOs explicit by use-case.
- Preserve `/visualizer?wrapId=...` handoff as a validated server-side contract.
- Treat the catalog-to-visualizer handoff as `hero` plus active `gallery`
  references only; do not reintroduce `visualizer_texture` or
  `visualizer_mask_hint` into the canonical contract unless a new contract revision
  explicitly permits it.

## Quality interpretation

- Prefer stable rendering DTOs over leaking raw persistence models to UI.
- Keep read and write paths domain-bounded.

## References

- `.agents/docs/PRD.md`
- `.agents/docs/DATA-MODEL.md`
- `.agents/contracts/domain-boundaries.contract.yaml`
- `.agents/contracts/data-access.contract.yaml`
