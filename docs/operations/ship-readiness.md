# Ship Readiness

CtrlPlus is ready to ship only when all of the following are true.

## Workflow

- Work is tracked through `spec -> implement -> verify -> document`.
- Domain ownership is visible in Notion workstreams before the release cut.
- User-facing changes have a matching documentation or operational note before merge.

## Quality Gates

- `pnpm check` passes.
- Playwright passes in one of two modes:
  - `@no-server` smoke coverage for contract-safe changes.
  - Full `BASE_URL` run against a real preview deployment for release candidates.
- The repo uses the pinned toolchain in [`package.json`](../../package.json): Node `20+` and `pnpm 10.24.0`.

## Webhooks

- Clerk webhooks are public, verified, idempotent, and retry-safe.
- Stripe webhooks are public, verified, idempotent, and replay-safe.
- Both webhook paths record event-level processing state in the database.
- Local webhook delivery may use `ngrok-free.app`, but tenant parsing must never trust ngrok hostnames.

## Multi-Tenancy

- `tenantId` is resolved server-side from session and host context only.
- Prisma reads and writes remain scoped to tenant-owned records.
- Unknown public hosts do not become implicit tenant slugs.
- `ngrok-free.app` remains webhook transport only, never tenant identity.

## Visualizer

- The current fallback template mode remains available when async processing is unavailable.
- The v1 segmentation model is locked and documented in [../visualizer/huggingface-v1.md](../visualizer/huggingface-v1.md).
- Visualizer model or provider changes require a new documented decision before release.

## Release Checklist

1. Update the matching Notion workstream and task status.
2. Run `pnpm check`.
3. Run Playwright against a preview `BASE_URL` for the release candidate.
4. Verify Clerk and Stripe webhook secrets for the target environment.
5. Confirm `NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX` matches the release domain.
6. Link the merged PR and release target back into Notion.
