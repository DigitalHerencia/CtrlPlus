# Refactor Phase 3: Server Boundaries and Validation

Advance tasks in workstream `WS-004`.

## Goal

Confirm that reads, writes, authz, validation, DTOs, and provider boundaries remain server-authoritative during the refactor.

## Requirements

- No Prisma in `app/**`, `features/**`, or React components.
- Reads stay behind fetchers.
- Writes stay behind actions.
- Schema and DTO updates must remain explicit and transport-safe.
- Update JSON execution state after each bounded pass.
