---
description: Admin domain interpretation for privileged operations and analytics.
applyTo: "app/(tenant)/admin/**, components/admin/**, features/admin/**, lib/actions/admin*.ts, lib/fetchers/admin*.ts"
---

## Purpose

Interpret how privileged admin flows should be implemented without weakening platform
safety.

## Interpretation guidance

- Prefer explicit capability checks for every privileged operation.
- Keep moderation/analytics actions auditable and reviewable.
- Separate read dashboards from sensitive write actions.
- Provide clear denial and failure states for insufficient privileges.

## Operational interpretation

- Treat admin tools as sensitive surfaces.
- Preserve traceability for bulk or high-impact actions.

## References

- `.agents/docs/ARCHITECTURE.md`
- `.agents/contracts/security.contract.yaml`
- `.agents/contracts/domain-boundaries.contract.yaml`
