---
description: "Admin domain: moderation, analytics, platform operations for owner/admin users."
applyTo: "app/(tenant)/admin/**, features/admin/**, components/admin/**, lib/actions/admin.actions.ts, lib/fetchers/admin.fetchers.ts"
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

- `getTenantMetrics(dateRange)` - KPIs for the current admin surface
- `getAuditLog(filters)` - Action history
- `getFlaggedItems()` - Moderation queue

## Actions: `lib/actions/admin/`

- `flagContent(resourceType, resourceId, reason)` - Flag for review
- `resolveFlag(flagId, action)` - Approve or delete

## Key Rules

- All access requires authenticated owner/admin capability checks
- Audit log is append-only (no deletes)
- Metrics computed from audit log (immutable)
