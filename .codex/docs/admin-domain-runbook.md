# Admin Domain Runbook

## Scope

Admin/owner dashboards for:

- Catalog management
- Scheduling management
- Billing management
- Platform diagnostics (admin only)

## Access

- Owner dashboard: role `owner` or `admin`
- Platform dashboard: role `admin` only

## Operational Notes

- Owner/admin identities come from env vars only.
- No in-app role assignment.
- Sensitive mutations must write `AuditLog` records.
