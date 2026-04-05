---
description: Scheduling domain interpretation for availability and booking lifecycle.
applyTo: "app/(tenant)/scheduling/**, components/scheduling/**, features/scheduling/**, lib/actions/scheduling*.ts, lib/fetchers/scheduling*.ts"
---

## Purpose

Interpret booking and availability behavior for predictability and operational clarity.

## Interpretation guidance

- Keep availability constraints explicit and server-evaluated.
- Keep booking state transitions deterministic and auditable.
- Validate temporal input boundaries consistently.
- Make conflict outcomes explicit to users and operators.

## References

- `.agents/docs/PRD.md`
- `.agents/contracts/mutation-pipeline.contract.yaml`
- `.agents/contracts/domain-boundaries.contract.yaml`
