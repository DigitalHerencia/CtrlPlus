# .codex Directory

This directory contains Codex-facing architecture guidance and preparatory refactor artifacts for CtrlPlus. These files define how future domain refactors should be scoped and executed without changing runtime code in advance.

## Active domains

- `admin`
- `auth/authz`
- `billing`
- `catalog`
- `platform`
- `scheduling`
- `settings`
- `visualizer`

## Structure

- `arch/`: cross-domain target architecture, refactor principles, and directory-tree specs
- `docs/`: domain specs and cross-domain product or technical requirements
- `instructions/`: domain-specific implementation rules and boundaries
- `prompts/`: per-domain refactor prompts for future execution passes

Use these files to align agents on domain boundaries, server-first architecture, and refactor sequencing. This layer is preparatory guidance only and is separate from runtime implementation work.
