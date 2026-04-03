## Data model overview

CtrlPlus uses Prisma as the canonical schema and PostgreSQL as the persistent data
store. The current implementation is single-store and auth-scoped; domain entities
are consumed via server-side fetchers/actions.

## Data model principles

- Prisma schema is the source of truth for persisted entities.
- Authorization boundaries must be enforced server-side for reads and writes.
- DTOs exposed to UI should be explicit and minimal.
- Mutations should be validated before touching persistence.

## Core domain entities

### Identity and authorization posture

- User identity is managed through Clerk.
- Role, capability, and ownership checks drive authorization rules in the current single-store schema.

### Catalog

- Wrap entities define product-level wrap information.
- Related image entities define asset roles used by catalog and visualizer.
- Category mappings classify wraps for discovery and filtering.

### Visualizer

- Preview entities track input image references, wrap selection, and generation state.
- Preview lifecycle supports pending/processing/complete/failed semantics.

### Scheduling

- Availability rules define bookable capacity windows.
- Bookings represent customer/service scheduling lifecycle.

### Billing

- Invoices and related payment artifacts capture billing state and transitions.

### Audit and operations

- Audit log records sensitive mutation actions and contextual metadata.

## Relationship and flow summary

- Authenticated users create and manage wraps, bookings, invoices, and related operational records through server-side capability checks.
- A wrap can have multiple categorized media assets with explicit role meaning.
- Visualizer previews reference a selected wrap and an uploaded customer vehicle image.
- Scheduling and billing entities are linked to authenticated operational activity in the current single-store schema.

## Schema change safety checklist

Before schema changes:

1. Confirm impacted entities and relationships.
2. Validate migration path for existing data.
3. Review authorization impact for new/changed fields.
4. Verify fetchers/actions and DTO contracts stay consistent.
5. Run migration validation and tests.

## Migration safety guidelines

- Favor additive, backward-compatible changes when possible.
- Use explicit migrations and review SQL impact.
- Avoid dropping/renaming critical fields without a staged transition plan.
