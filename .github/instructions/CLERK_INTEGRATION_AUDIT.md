# Clerk Integration Audit (Current State)

**Date**: 2026-03-11

## Summary

CTRL+ uses Clerk for authentication in a single-store model.

- No Clerk organizations
- No tenant membership table
- Role resolution is env-driven (`customer` / `owner` / `admin`)
- Clerk webhook syncs user/session/email/sms/subscription/payment-attempt cache tables

## Verified Controls

- Webhook signature verification enabled
- Idempotent event ledger (`ClerkWebhookEvent`)
- User role sync uses server-side env mapping only
- Deletion flow soft-deletes local user cache and associated Clerk cache rows
- No in-app owner/admin assignment workflow

## Follow-up Checks

- Ensure `STORE_OWNER_CLERK_USER_ID` and `PLATFORM_DEV_CLERK_USER_ID` are managed in environment secrets.
- Periodically review webhook failure logs and replay handling.
