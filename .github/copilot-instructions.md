---
description: "Lean repo-wide Copilot instructions for CtrlPlus"
applyTo: "**/*"
---

# CtrlPlus Copilot Instructions

- Use `AGENTS.md` as the primary repo-wide contract.
- Keep prompt context lean. Do not preload the full `.copilot` tree by default.
- Do not auto-load `.copilot/README.md`, `.copilot/docs/**`, `.copilot/contracts/**`, `.copilot/execution/**`, or `.copilot/prompts/**` unless the current task clearly needs them.
- Do not auto-load external notes under `C:\Users\scree\Documents\DevNotes\**`. Treat them as manual reference only.
- Load at most one matching scoped instruction file from `.copilot/instructions/` for the active domain:
  - catalog work: `.copilot/instructions/catalog.instructions.md`
  - visualizer work: `.copilot/instructions/visualizer.instructions.md`
- Treat `app/**` as orchestration only.
- Do not import Prisma directly in `app/**` or React components.
- Route database reads through `lib/fetchers/{domain}`.
- Route database writes through `lib/actions/{domain}`.
- Keep auth, tenancy, ownership, capability checks, and mutation validation on the server.
- Prefer Server Components by default and reuse `components/ui/**` primitives.
- Only load deeper `.copilot` docs, contracts, execution artifacts, or prompts when the task requires a domain spec, a contract change, or prior execution state.
