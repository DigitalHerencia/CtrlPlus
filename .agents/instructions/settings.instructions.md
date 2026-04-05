---
description: Settings domain interpretation for user and shop configuration workflows.
applyTo: "app/(tenant)/settings/**, components/settings/**, features/settings/**, lib/actions/settings*.ts, lib/fetchers/settings*.ts"
---

## Purpose

Interpret settings behavior for safe configuration mutation and predictable preference
reads.

## Interpretation guidance

- Keep setting ownership and scope checks server-side.
- Validate configuration payloads before persistence.
- Keep defaults explicit and stable.
- Preserve compatibility when introducing new setting keys.

## References

- `.agents/docs/ARCHITECTURE.md`
- `.agents/contracts/data-access.contract.yaml`
- `.agents/contracts/security.contract.yaml`
