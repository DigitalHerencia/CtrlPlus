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
- Wrap image records carry explicit asset-role semantics and persist Cloudinary
  authority fields as the durable storage contract for active storefront media.
- Category mappings drive browse/discovery taxonomy.

### Visualizer

- `VisualizerUpload` is the first-class, owner-scoped source image entity for the
  visualizer. It stores Cloudinary authority fields, media metadata, content hash,
  and ownership identifiers.
- `VisualizerPreview` references `VisualizerUpload` via `uploadId` and tracks the
  selected wrap, reference-set signature, generation metadata, and persisted preview
  asset authority fields.
- Preview lifecycle is explicit and status-driven (`pending`, `processing`,
  `complete`, `failed`).
- Legacy URL fields may exist only as transition/backfill surfaces; Cloudinary
  authority fields are the durable storage contract.

### Scheduling

- Availability and booking entities encode temporal constraints and operator flow.

### Billing

- Invoices and payment artifacts represent billing truth and transition history.
- Integration metadata should support reconciliation and retry safety.

### Audit and operations

- Audit records preserve who/what/when context for sensitive operations.

## Relationship and flow summary

- Catalog entities provide inputs for visualizer and customer decision flows.
- Visualizer uploads connect authenticated user media to generated preview outputs.
- Catalog wrap assets connect to visualizer previews through explicit `hero` and
  `gallery` reference images rather than texture-only contracts.
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
