# Product Requirements (Single-Store)

CTRL+ is a single-store vehicle wrap platform.

## Personas

- Customer
- Store Owner
- Platform Admin (developer)

## Goals

- Let customers browse one shared catalog, preview wraps, book appointments, and pay invoices.
- Give owner/admin management dashboards for catalog, scheduling, and billing.
- Give admin platform diagnostics and maintenance tools.

## Authorization Outcomes

- Customers can only access their own bookings, invoices, and settings.
- Owner can access and manage all customer bookings and invoices.
- Admin can access owner capabilities plus platform/database operations.
- Owner/admin Clerk IDs are configured only through environment variables.

## Non-Goals

- Multi-tenant hosting
- Clerk organizations
- In-app owner/admin assignment workflows
