# PRD (Copilot Instructions)

CTRL+ is a single-store vehicle wrap platform.

## Users

- Customer: self-service browsing, visualizer, appointments, invoices, settings.
- Owner: management dashboard for catalog, scheduling, billing.
- Admin: owner capabilities plus platform/database diagnostics and maintenance.

## Auth Model

- Clerk user identity only.
- No organizations and no tenant membership model.
- Owner/admin assignment via env vars only.
