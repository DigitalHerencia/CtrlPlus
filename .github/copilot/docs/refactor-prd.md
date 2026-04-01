---
title: CtrlPlus Server-First Refactor PRD
status: Draft
owner: Copilot
last_updated: 2026-03-29
source_documents:
  - C:\Users\scree\Documents\DevNotes\Thinking vs Execution vs Machines.md
  - C:\Users\scree\Documents\DevNotes\CtrlPlus Server-First Architecture Blueprint.md
---

# CtrlPlus Server-First Refactor PRD

## Product Intent

CtrlPlus needs a large-scale refactor that makes the application predictable for repeated agent execution. The desired end state is a strict server-first architecture in which route shells stay thin, orchestration moves into `features/`, reusable UI lives in `components/`, primitives remain in `components/ui/`, and all server authority stays behind `lib/`, `schemas/`, `types/`, and Prisma boundaries.

## Problem Statement

The current codebase already contains the major domain folders and a partial `app -> features -> components` split, but the program does not yet have a formal artifact system for staged refactors. That makes future large changes dependent on prompt memory, ad hoc interpretation, and inconsistent task tracking.

## Goals

- Establish a durable `.copilot` scaffold that agents can use repeatedly during the refactor.
- Convert the architecture blueprint into repo-local markdown documents that are easy for humans to review.
- Distill the architecture into YAML contracts that future agents can consume literally.
- Enforce JSON execution tracking so refactor progress, blockers, and task state remain explicit across sessions.
- Prepare the repo for a multi-pass refactor of `app/`, `features/`, and `components/` without weakening server boundaries.

## Non-Goals

- This scaffold does not perform the full refactor.
- This scaffold does not rename current business domains unless a later task explicitly approves that migration.
- This scaffold does not replace repo code review or verification requirements.

## Users and Stakeholders

- Primary: future Copilot agents executing bounded refactor passes
- Secondary: maintainers reviewing architecture intent and progress
- Tertiary: contributors who need stable contracts for new code

## Success Metrics

- Every refactor pass can be anchored to markdown, YAML, and JSON artifacts instead of freeform prompt text.
- Future agents can identify the next refactor task from `.copilot/execution/refactor-backlog.json`.
- The repo-level operating model clearly states how to convert source docs into contracts and execution state.
- Architecture rules around `app/`, `features/`, `components/`, and server boundaries remain explicit and cross-referenced.

## Program Scope

### In Scope

- Route-thinning across `app/(auth)`, `app/(tenant)`, and `app/api`
- Feature entrypoint normalization in `features/*`
- Component boundary cleanup in `components/*` and `components/ui/*`
- Server read/write contract enforcement across `lib/*`, `schemas/*`, `types/*`, and `prisma/*`
- Refactor planning and tracking artifacts under `.copilot/`

### Out of Scope

- Net-new product features unrelated to the architectural refactor
- Schema redesign beyond what later refactor tasks explicitly authorize
- Deployment process changes not required by the refactor

## Workstreams

- WS-001: App Shell Thinning
- WS-002: Feature Orchestration Normalization
- WS-003: Component Boundary Cleanup
- WS-004: Server Authority Hardening
- WS-005: Contract and Validation Alignment
- WS-006: Verification and Cutover

## Functional Requirements

- The repo must contain markdown docs that restate the refactor intent in CtrlPlus-specific terms.
- The repo must contain YAML contracts for layer boundaries, workstream sequencing, and execution rules.
- The repo must contain JSON backlog and progress state for the refactor program.
- Agents executing future refactor passes must update JSON task state when progress changes materially.

## Operational Requirements

- Every future pass should identify its target workstream and task IDs before editing code.
- Assumptions that change program scope must be recorded in markdown before they become YAML or JSON state.
- Repo-local instructions must mention `.copilot/contracts/` and `.copilot/execution/` as authoritative layers.

## Acceptance Criteria

- Given a new agent session, when the agent opens `.copilot/README.md`, then it can identify the source docs, contracts, and execution files for the refactor program.
- Given a scoped refactor task, when the agent reads the YAML contracts, then it can determine allowed responsibilities and workstream boundaries without inferring them from memory.
- Given progress on a refactor pass, when the agent updates JSON state, then the next session can see what is pending, active, blocked, or complete.
