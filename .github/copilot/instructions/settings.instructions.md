---
description: "Settings domain: user preferences, tenant configuration, data export."
applyTo: "lib/settings/**, features/settings/**, components/settings/**"
---

# Settings Domain Quick Reference

## Storage

All preferences stored in Prisma as JSONB in `UserPreferences` or `TenantSettings` (if table exists).

## User Settings

- Theme preference (light/dark)
- Notification settings (email, SMS, push)
- Language preference
- Timezone

## Tenant Settings

- Business name
- Address
- Tax ID
- Notification email
- Logo (URL)

## Actions: `lib/actions/settings/`

- `updateUserPreferences(userId, prefs)` - User settings
- `updateTenantSettings(tenantId, settings)` - Tenant settings (owner-only)
- `exportData(tenantId, format)` - Data export (owner-only)

## Pages

- `/(tenant)/settings/profile` - User settings (public)
- `/(tenant)/settings/account` - Tenant settings (owner-only)
- `/(tenant)/settings/data` - Export options (owner-only)

## Key Rules

- User settings owned by user only
- Tenant settings require owner role
- All mutations audit-logged
