## Purpose

This folder is the **intent layer** for CtrlPlus governance artifacts.

These files explain:

- why the system exists,
- what outcomes it must provide,
- how it is expected to evolve.

They do **not** define executable constraints or progress state.

## Intent files

- `PRD.md`: product outcomes, personas, and core stories.
- `ARCHITECTURE.md`: layer intent and system decomposition.
- `TECHNOLOGY-REQUIREMENTS.md`: stack and tooling intent.
- `DATA-MODEL.md`: persistence and evolution intent.
- `ROADMAP.md`: phased delivery intent.

## Boundary rules

- Put enforceable rules in `.agents/contracts/*`.
- Put interpretation guidance in `.agents/instructions/*`.
- Put progress/decisions/reports in `.agents/json/*`.
- Put task accountability flows in `.agents/prompts/*`.

## Suggested read order

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `TECHNOLOGY-REQUIREMENTS.md`
4. `DATA-MODEL.md`
5. `ROADMAP.md`

## Maintenance expectations

- Keep documents concise, unambiguous, and non-overlapping.
- When intent changes, update impacted instruction/contract/reporting artifacts in the
	same pass.
