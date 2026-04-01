---
description: 'Lean repo-wide Copilot instructions for CtrlPlus'
applyTo: '**/*'
---

# CtrlPlus Copilot Instructions

- Use `AGENTS.md` as the primary repo-wide contract.
- Keep prompt context lean. Do not preload the full `.copilot` tree by default.
- Do not auto-load external notes under `C:\Users\scree\Documents\DevNotes\**`. Treat them as manual reference only.
- Keep prompt context lean. Do not preload the full `.github/copilot` tree by default.
- Avoid placing a `.copilot` folder at the root of a drive or in parent directories of your workspace; some Copilot clients may scan parent directories and auto-load large instruction trees into the prompt context. Keep large archives behind explicit gates or inside plugin packages.
- Do not auto-load `.github/copilot/README.md`, `.github/copilot/docs/**`, `.github/copilot/contracts/**`, `.github/copilot/json/**`, or `.github/copilot/prompts/**` (or any drive-root `.copilot` archive such as `D:\.copilot`) unless the current task clearly needs them.
- catalog work: `.copilot/instructions/catalog.instructions.md`
- visualizer work: `.copilot/instructions/visualizer.instructions.md`
- Treat `app/**` as orchestration only.
- Do not import Prisma directly in `app/**` or React components.
- Route database reads through `lib/fetchers/{domain}`.
- Route database writes through `lib/actions/{domain}`.
- Keep auth, tenancy, ownership, capability checks, and mutation validation on the server.
- Prefer Server Components by default and reuse `components/ui/**` primitives.
- Only load deeper `.copilot` docs, contracts, execution artifacts, or prompts when the task requires a domain spec, a contract change, or prior execution state.
