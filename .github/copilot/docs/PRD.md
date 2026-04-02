## Product vision

CtrlPlus is a tenant-scoped operations platform for wrap shops that unifies catalog,
visualizer, scheduling, billing, settings, and admin workflows in one system.

The product must deliver a server-first, secure, and operationally reliable experience
for store owners, staff members, and customers.

## Goals

- Provide a professional wrap storefront and management experience.
- Enable deterministic visualizer previews based on catalog-approved assets.
- Keep scheduling and billing flows accurate, auditable, and tenant-safe.
- Ensure production-readiness with explicit auth/authz, validation, and observability.

## Non-goals

- Physically accurate manufacturing-grade wrap simulation.
- Client-authoritative ownership, tenant, role, booking, or billing decisions.
- Ad hoc domain coupling that bypasses server boundaries.

## Primary personas

### Owner / Admin

- Manages wraps, categories, assets, and publishing readiness.
- Oversees scheduling, billing, and tenant operations.
- Reviews metrics and performs platform-sensitive actions.

### Team member

- Executes day-to-day operations for bookings and invoices.
- Works within capability-based permissions.

### Customer

- Discovers wraps.
- Selects a wrap for vehicle preview.
- Reviews generated preview output.

## Product features by domain

### Catalog

- Wrap browsing, detail pages, and management surfaces.
- Deterministic asset roles for hero, gallery, and visualizer texture.
- Publish-readiness checks before making wraps customer-visible.

### Visualizer

- Wrap handoff from catalog via wrap ID.
- Vehicle image upload and preview generation pipeline.
- Status lifecycle for preview requests.

### Scheduling

- Availability and booking workflows.
- Tenant-scoped booking visibility and mutation.

### Billing

- Invoice lifecycle and payment workflows.
- Tenant-safe access and status handling.

### Settings, admin, and platform

- Tenant configuration and user preferences.
- Admin analytics and sensitive operations with strict authorization.
- Platform integration boundaries (webhooks, recovery, diagnostics).

## User stories and acceptance criteria

### Story: publish a wrap

- As an owner, I can publish a wrap only when required assets are present.
- Acceptance criteria:
    - Publishing enforces server-side validation.
    - Missing required assets block publish with clear feedback.
    - Published wraps are discoverable in the customer catalog.

### Story: generate a wrap preview

- As a customer, I can select a wrap and generate a preview on my vehicle photo.
- Acceptance criteria:
    - Visualizer accepts only valid, catalog-approved wrap selection.
    - Preview status is visible as pending/processing/complete/failed.
    - Generated result is persisted and viewable after completion.

### Story: perform secure mutations

- As a platform operator, I need all critical changes to be authenticated,
  authorized, and validated.
- Acceptance criteria:
    - Server actions enforce auth, authz, and schema validation.
    - Mutations are tenant-scoped and auditable.
    - Cache invalidation occurs after successful writes.

## Success metrics

- Reduced time-to-publish for new wraps.
- High preview completion rate with low failure rate.
- Low authorization error leakage and zero cross-tenant data exposure.
- Improved operational throughput in scheduling and billing domains.
