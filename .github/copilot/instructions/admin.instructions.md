---
description: "Admin domain: moderation, analytics, platform operations for owner/admin users."
applyTo: "lib/admin/**, features/admin/**, components/admin/**, app/(tenant)/admin/**"
---

# Admin Domain Quick Reference

## Components

- **Metrics Dashboard** - KPIs (bookings, revenue, preview generation)
- **Moderation** - Flag/review user behavior
- **Analytics** - Usage tracking, performance data
- **Audit Log** - Action history (read-only)

## Admin Panel Routes (owner/admin only)

- `/(tenant)/admin` - Dashboard
- `/(tenant)/admin/analytics` - Metrics and chart
- `/(tenant)/admin/audit` - Action history
- `/(tenant)/admin/moderation` - Review flagged content

## Fetchers: `lib/fetchers/admin/`

- `getTenantMetrics(tenantId, dateRange)` - KPIs
- `getAuditLog(tenantId, filters)` - Action history
- `getFlaggedItems(tenantId)` - Moderation queue

## Actions: `lib/actions/admin/`

- `flagContent(resourceType, resourceId, reason)` - Flag for review
- `resolveFlag(flagId, action)` - Approve or delete

## Key Rules

- All access requires `assertTenantMembership(..., "admin")`
- Audit log is append-only (no deletes)
- Metrics computed from audit log (immutable)
