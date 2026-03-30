# Contract Lifecycle Instructions

This repo uses a three-layer documentation model:

- markdown for thinking and rationale
- YAML for durable agent contracts
- JSON for execution state

## Derivation Process

1. Start from narrative source material.
2. Produce or update markdown docs that summarize goals, requirements, and gaps.
3. Encode repeatable rules in YAML contracts.
4. Track active work and decisions in JSON.

## Change Rules

- Update markdown when intent or rationale changes.
- Update YAML when deterministic rules, mappings, or acceptance gates change.
- Update JSON when task state, status, dependencies, or open decisions change.
- Avoid putting volatile execution status in markdown unless it is needed for human context.
