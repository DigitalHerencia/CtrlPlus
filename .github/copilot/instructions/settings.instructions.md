---
description: "Settings domain: user preferences, owner-controlled account settings, and data export."
applyTo: "app/(tenant)/settings/**, features/settings/**, components/settings/**, lib/actions/settings.actions.ts, lib/fetchers/settings.fetchers.ts"
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
- `updateAccountSettings(settings)` - Owner-controlled account settings
- `exportData(format)` - Data export (owner-only)

## Pages

- `/(tenant)/settings/profile` - User settings (authenticated)
- `/(tenant)/settings/account` - Tenant settings (owner-only)
- `/(tenant)/settings/data` - Export options (owner-only)

## Key Rules

- User settings owned by user only
- Tenant settings require owner role
- All mutations audit-logged
