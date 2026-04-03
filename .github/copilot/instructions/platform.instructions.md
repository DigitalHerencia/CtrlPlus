---
description: "Platform domain: infrastructure, health checks, observability, error handling."
applyTo: "app/(tenant)/platform/**, app/api/**, features/platform/**, components/platform/**, lib/actions/platform.actions.ts, lib/fetchers/platform.fetchers.ts, lib/integrations/**"
---

# Platform Domain Quick Reference

## Core Responsibilities

- **Observability** - Error tracking, logging, metrics
- **Health Checks** - Service status, dependency health
- **External Integrations** - Third-party APIs (Stripe, Cloudinary, HF, Clerk)
- **Error Handling** - Graceful degradation, user-facing errors

## Health Check Routes

- `app/api/health` - Basic health (200 if running)
- `app/api/health/deep` - Check all dependencies (DB, Stripe, HF, Cloudinary)

## Integrations: `lib/integrations/`

- `clerk.ts` - Clerk auth integration
- `stripe.ts` - Payment processing
- `cloudinary.ts` - Image storage
- `huggingface.ts` - AI inference
- `audit-log.ts` - Audit logging
- `observability.ts` - Error tracking (Sentry, DataDog, etc.)

## Error Handling Pattern

```typescript
try {
  // operation
} catch (error: unknown) {
  // Log to observability system
  await observability.captureException(error, { context });

  // If user-facing, return generic message
  return { error: "Failed to process request", code: "INTERNAL_ERROR" };

  // If internal, log specific error
  console.error("Detailed error:", error);
}
```

## Key Rules

- All integrations are fail-soft (don't crash if external API times out)
- Observability logged even for soft failures (performance issues tracked)
- Health endpoints never block on external calls (timeout immediately)
