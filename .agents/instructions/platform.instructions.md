---
description: Platform domain interpretation for diagnostics, integrations, and reliability.
applyTo: "app/(tenant)/platform/**, components/platform/**, features/platform/**, lib/integrations/**, lib/actions/platform*.ts, lib/fetchers/platform*.ts"
---

## Purpose

Interpret operational platform workflows, diagnostics, and integration health handling.

## Interpretation guidance

- Keep external integration boundaries explicit and adapter-driven.
- Isolate provider failures with graceful fallback behavior when possible.
- Prioritize observability and incident triage ergonomics for operators.

## Reliability interpretation

- Do not couple core domain operations directly to fragile external calls.
- Preserve recoverability and diagnostics metadata for failures.

## References

- `.agents/docs/ARCHITECTURE.md`
- `.agents/contracts/domain-boundaries.contract.yaml`
- `.agents/contracts/security.contract.yaml`
