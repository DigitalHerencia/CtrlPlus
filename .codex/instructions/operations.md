# Operations

## Local Setup

- Copy `.env.example` to `.env.local` and fill only the variables you actually need.
- Keep developer secrets in `.env.local`, user-level Windows environment variables, or Codex sandbox secrets.
- Run `.codex/setup/bootstrap-windows.ps1` to normalize Git, VS Code, and local CLI checks.

## Data and Auth

- Use pooled Neon URLs at runtime and unpooled URLs for schema operations.
- Keep `STORE_OWNER_CLERK_USER_ID` and `PLATFORM_DEV_CLERK_USER_ID` in secrets, not code.

## Runbooks

- `docs/operations/ship-readiness.md`
- `docs/operations/billing-runbook.md`
- `docs/operations/scheduling-reservations.md`
