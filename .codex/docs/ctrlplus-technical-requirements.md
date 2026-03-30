---
title: CtrlPlus Refactor Technical Requirements
version: 1.0
date_created: 2026-03-29
last_updated: 2026-03-29
owner: Codex
tags:
  - technical-requirements
  - refactor
  - architecture
---

# Introduction

This document translates the server-first blueprint into concise technical requirements that agents and maintainers can apply during the refactor program.

## 1. Requirements

- **REQ-001**: `app/**` must remain route-focused and thin.
- **REQ-002**: `features/**` must own orchestration and interactive containers.
- **REQ-003**: `components/**` must remain presentational and reusable.
- **REQ-004**: `components/ui/**` must remain primitive-only.
- **REQ-005**: All reads must stay behind `lib/fetchers/**`.
- **REQ-006**: All writes must stay behind `lib/actions/**`.
- **REQ-007**: Server-side validation must remain in `schemas/**` and server actions.
- **REQ-008**: DTOs must remain explicit and transport-safe in `types/**`.
- **REQ-009**: Route params and search params must be typed and validated.
- **REQ-010**: Auth, authz, ownership, billing, and preview authority must remain server-side.

## 2. Constraints

- **CON-001**: Do not import Prisma into `app/**`, `features/**`, or `components/**`.
- **CON-002**: Do not move provider SDK logic into client code or presentational components.
- **CON-003**: Do not let JSON execution state replace markdown rationale or YAML contracts.
- **CON-004**: Do not rename public route structures without an explicit migration decision.

## 3. Guidelines

- **GUD-001**: Prefer additive scaffolding before invasive code moves.
- **GUD-002**: Normalize naming per domain in waves, not as a repo-wide scramble.
- **GUD-003**: Preserve working behavior while improving structural clarity.
- **GUD-004**: Update docs, contracts, and execution state when the refactor plan changes materially.

## 4. Validation Expectations

- **VAL-001**: Structural changes must remain compatible with `pnpm lint`.
- **VAL-002**: Structural changes must remain compatible with `pnpm typecheck`.
- **VAL-003**: Server-boundary changes must remain compatible with `pnpm prisma:validate`.
- **VAL-004**: Refactor waves that touch runtime behavior should eventually pass `pnpm build` and affected tests.
