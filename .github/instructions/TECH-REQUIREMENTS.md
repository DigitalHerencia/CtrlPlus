# Technical Requirements (Copilot Instructions)

- Single-store architecture.
- Clerk authentication without organizations.
- Authorization roles: `customer`, `owner`, `admin`.
- Owner/admin IDs are derived from environment variables.
- Prisma usage restricted to domain modules and webhook handlers.
- All actions follow `auth -> authorize -> validate -> mutate -> audit`.
- Shared catalog; customer-specific scope enforced for bookings/invoices/settings.
