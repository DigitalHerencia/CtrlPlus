## Purpose

This folder is the **interpretation layer** for CtrlPlus governance.

Instructions explain how to apply intent (`.agents/docs`) and contracts
(`.agents/contracts`) during implementation and refactoring.

## Instruction set

- `server-first.instructions.md`: foundational interpretation for all domains.
- `authentication.instructions.md`: identity, session, and authorization patterns.
- `admin.instructions.md`: privileged admin operations and governance surfaces.
- `billing.instructions.md`: invoice/payment interpretation and Stripe boundaries.
- `catalog.instructions.md`: wrap storefront, assets, and publish-readiness behavior.
- `platform.instructions.md`: health, diagnostics, integration orchestration.
- `scheduling.instructions.md`: booking/availability lifecycle interpretation.
- `settings.instructions.md`: preference/config interpretation.
- `visualizer.instructions.md`: preview pipeline interpretation.

## Boundary rules

- If a statement is normative and testable, move it to contracts.
- If a statement explains reasoning and outcomes, keep it in docs.
- If a statement tracks progress or blockers, move it to json reports.

## Usage order

1. Read `server-first.instructions.md`.
2. Read the relevant domain instruction file.
3. Enforce contract IDs referenced by those instructions.
4. Update reporting artifacts for execution changes.

## Maintenance standard

- Keep guidance actionable and non-duplicative.
- Reference contracts by file and rule ID instead of pasting rule text.
