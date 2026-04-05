## Purpose

Define persistence intent for CtrlPlus. This document explains model semantics,
entity relationships, and evolution strategy. It does not define executable migration
steps or policy enforcement rules.

## Data model overview

CtrlPlus uses Prisma schema as canonical data modeling surface and PostgreSQL as the
persistent store. The operating model is single-store with server-authoritative scope.

## Data model principles

- Favor additive and backward-compatible evolution.
- Keep persisted model semantics explicit (no overloaded fields for multiple meanings).
- Preserve auditability for sensitive lifecycle transitions.

## Core domain entities

### Identity and authorization posture

- User identity is externalized through Clerk.
- Access decisions derive from server-side identity/capability context.

### Catalog

- Wrap records represent product entities and publish state.
- Wrap image records carry explicit asset-role semantics.
- Category mappings drive browse/discovery taxonomy.

### Visualizer

- Preview entities track request identity, source assets, and output artifacts.
- Preview lifecycle is explicit and status-driven.

### Scheduling

- Availability and booking entities encode temporal constraints and operator flow.

### Billing

- Invoices and payment artifacts represent billing truth and transition history.
- Integration metadata should support reconciliation and retry safety.

### Audit and operations

- Audit records preserve who/what/when context for sensitive operations.

## Relationship and flow summary

- Catalog entities provide inputs for visualizer and customer decision flows.
- Visualizer entities connect wrap assets to generated preview outputs.
- Scheduling and billing entities connect operational commitments to financial outcomes.
- Audit entities track sensitive lifecycle-changing events.

## Schema evolution intent checklist

Before schema changes, ensure:

1. Relationship integrity remains explicit.
2. Existing data can transition safely.
3. Access semantics remain correct for new/changed fields.
4. DTO and schema layers remain aligned.
5. Validation/testing strategy is updated with the change.

## Migration safety guidance

- Favor additive, backward-compatible changes when possible.
- Use explicit migrations and review SQL impact.
- Avoid dropping/renaming critical fields without a staged transition plan.

## Related files

- `ARCHITECTURE.md` for layer intent.
- `.agents/contracts/data-access.contract.yaml` for enforceable data-access rules.
- `.agents/contracts/mutation-pipeline.contract.yaml` for write lifecycle rules.
