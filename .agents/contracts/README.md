## Purpose

This folder is the **execution layer** for CtrlPlus governance.

Contracts are machine-readable constraints that define what must or must not happen
during implementation.

## Contract set

- `governance-layers.contract.yaml`
- `domain-boundaries.contract.yaml`
- `route-ownership.contract.yaml`
- `naming.contract.yaml`
- `data-access.contract.yaml`
- `mutation-pipeline.contract.yaml`
- `security.contract.yaml`
- `testing-quality.contract.yaml`
- `catalog-visualizer-handoff.contract.yaml`
- `catalog-asset-storage.contract.yaml`

## Enforcement intent

- Contracts are normative and testable.
- Instructions may interpret contracts but cannot weaken them.
- Docs provide rationale but do not override contracts.

## Precedence

`contracts > instructions > docs > prompts` (json is reporting only).
