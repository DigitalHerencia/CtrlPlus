# Ship Readiness

## Readiness Checklist

- Env vars set for Clerk, Stripe, Neon, and webhook secrets
- Prisma migrations applied
- Prisma client generated
- Typecheck/lint pass
- Critical auth and payment flows smoke-tested

## Auth/Role Notes

- Owner/admin IDs are env-managed only.
- No in-app role assignment path.

## Webhook Notes

- Local webhook tunnels are transport only.
- Identity/authorization decisions must never depend on tunnel hostnames.
