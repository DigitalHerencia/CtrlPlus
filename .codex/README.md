# CtrlPlus Codex Scaffold

This directory turns high-context source material into repeatable agent resources for the CtrlPlus refactor program.

## Model

- Markdown is the thinking layer.
- YAML is the contract layer.
- JSON is the execution layer.

## Source Documents

- `C:\Users\scree\Documents\DevNotes\Thinking vs Execution vs Machines.md`
- `C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md`
- [AGENTS.md](D:\CtrlPlus\AGENTS.md)

## Read Order

1. This file
2. `.codex/instructions/*.md`
3. `.codex/docs/*.md`
4. `.codex/arch/*.md`
5. `.codex/contracts/*.yaml`
6. `.codex/execution/*.json`
7. `.codex/prompts/*.md`

## Directory Roles

- `.codex/arch/`: normalized architecture and layer-target docs
- `.codex/docs/`: PRD, technical requirements, and gap analysis
- `.codex/instructions/`: operating rules for agents working this repo
- `.codex/contracts/`: machine-readable refactor contracts and wave plans
- `.codex/execution/`: machine-readable backlog, progress, and decision state
- `.codex/prompts/`: bounded prompts for repeated refactor passes

## Operating Rule

When a major refactor changes architecture, update the relevant markdown, YAML, and JSON artifacts together so the next agent inherits aligned intent, contracts, and state.
