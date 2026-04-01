# CtrlPlus Copilot Scaffold

Note: Legacy `.copilot/*` path references map to `.github/copilot/*` in this repository. Do not scan or auto-load any drive-root `.copilot` archives (e.g., `D:\.copilot`).

This directory is optional reference material for bounded catalog and visualizer work. It is not intended to be preloaded wholesale.

## Default Intake

1. Start with `AGENTS.md`.
2. Load one matching file from `.github/copilot/instructions/` for the active domain.
3. Read `.github/copilot/docs/**`, `.github/copilot/contracts/**`, `.github/copilot/json/**`, or `.github/copilot/prompts/**` only when the task explicitly needs specs, contract edits, or prior execution state.
4. Do not auto-load external DevNotes or background research files.

## Domain Routing

- Catalog work: `.copilot/instructions/catalog.instructions.md`
- Visualizer work: `.copilot/instructions/visualizer.instructions.md`
- Cross-domain handoff work: load both domain instruction files first, then only the specific supporting artifact needed.

## Directory Roles

- `.github/copilot/instructions/`: scoped execution rules
- `.github/copilot/docs/`: human-readable specs and notes
- `.github/copilot/contracts/`: machine-readable constraints
- `.github/copilot/json/`: backlog, progress, decisions, validation, handoff
- `.github/copilot/prompts/`: bounded reuse prompts
- `.github/copilot/resource/` (arch): architecture and migration references

## External Sources

External notes under `C:\Users\scree\Documents\DevNotes\**` are archival source material. Use them only when the user explicitly asks for them or when a task cannot proceed without that source.
