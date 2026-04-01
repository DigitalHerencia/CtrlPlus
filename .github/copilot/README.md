# CtrlPlus Copilot Scaffold

This directory is optional reference material for bounded catalog and visualizer work. It is not intended to be preloaded wholesale.

## Default Intake

1. Start with `AGENTS.md`.
2. Load one matching file from `.copilot/instructions/` for the active domain.
3. Read `.copilot/docs/**`, `.copilot/contracts/**`, `.copilot/execution/**`, or `.copilot/prompts/**` only when the task explicitly needs specs, contract edits, or prior execution state.
4. Do not auto-load external DevNotes or background research files.

## Domain Routing

- Catalog work: `.copilot/instructions/catalog.instructions.md`
- Visualizer work: `.copilot/instructions/visualizer.instructions.md`
- Cross-domain handoff work: load both domain instruction files first, then only the specific supporting artifact needed.

## Directory Roles

- `.copilot/instructions/`: scoped execution rules
- `.copilot/docs/`: human-readable specs and notes
- `.copilot/contracts/`: machine-readable constraints
- `.copilot/execution/`: backlog, progress, decisions, validation, handoff
- `.copilot/prompts/`: bounded reuse prompts
- `.copilot/arch/`: architecture and migration references

## External Sources

External notes under `C:\Users\scree\Documents\DevNotes\**` are archival source material. Use them only when the user explicitly asks for them or when a task cannot proceed without that source.
