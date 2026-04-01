# `.copilot/contracts`

This directory is the YAML contract layer for the CtrlPlus refactor and catalog/visualizer delivery work.

## Purpose

- Define durable boundaries, workstreams, domains, phases, and execution rules.
- Make the architecture program machine-readable without turning markdown into implementation state.
- Give future agents deterministic inputs before they touch code.

## Active Contracts

- `artifact-pipeline.contract.yaml`
- `refactor-program.contract.yaml`
- `domains.contract.yaml`
- `layer-boundaries.contract.yaml`
- `workstreams.contract.yaml`
- `catalog-visualizer.contract.yaml`
- `catalog-visualizer.handoff.contract.yaml`
- `catalog-visualizer.pipeline.contract.yaml`
- `catalog-visualizer.readiness.contract.yaml`
- `phases/*.contract.yaml`

Keep the contracts aligned to markdown intent. Do not use these files as progress logs.
