# CtrlPlus Operations

## Working Loop

Use the same workflow across product, engineering, and release work:

1. `spec`
2. `implement`
3. `verify`
4. `document`

That loop is the operational default for feature work, hardening, and release prep.

## Notion Workspace Structure

When a writable Notion workspace is available, use two databases.

### `Workstreams`

One row per domain:

- `admin`
- `auth`
- `billing`
- `scheduling`
- `catalog`
- `tenancy`
- `visualizer`

Recommended properties:

- `Domain`
- `Status`
- `Risk`
- `Owner agent/thread`
- `PR link`
- `CI status`
- `Release target`
- `Notes`

### `Tasks`

Many rows related back to `Workstreams`.

Recommended properties:

- `Workstream`
- `Scope`
- `Type`
- `Test coverage`
- `Definition of done`
- `Reviewer`
- `Link to code location`

### Recommended Views

- Kanban by `Status`
- Table grouped by `Domain`
- Timeline by `Release target`
- Blocked view where `Status = Blocked` or CI is failing

## Visualizer Model Selection

The current visualizer implementation is template-first with upload persistence and placeholder processing. For a production upload pipeline, v1 model selection should stay pragmatic.

Recommended evaluation process for Hugging Face:

1. Compare segmentation candidates focused on vehicle-pixel isolation.
2. Record model size, license, expected latency, and deployment options.
3. Prefer cityscapes-style segmentation as the first-pass baseline for vehicle masking.
4. Lock one model for v1 before building background jobs or inference infrastructure.

Record the selected model and rationale in the `visualizer` workstream before rollout.

## Tunnel and Webhook Policy

- `ngrok-free.app` is acceptable for development webhook delivery only.
- Tunnel hostnames must never be treated as tenant identifiers.
- Clerk and Stripe webhook endpoints remain public and signature-verified.
- Tenant parsing must remain independent from tunnel domains and client input.

## Ship Checklist

A release is ready only when all of the following are true:

- CI passes with the repository’s pinned Node and pnpm versions.
- Local quality gates pass: formatting, lint, types, unit tests, Prisma validation, production build.
- Playwright passes for either the `@no-server` subset or a full `BASE_URL` run.
- Clerk webhooks are verified, public, idempotent, and abuse-aware.
- Stripe webhooks are verified and replay-safe.
- Tenant isolation is enforced end-to-end.
- `tenantId` is never accepted from the client.
- ngrok tunnel hosts cannot be interpreted as tenants.
- Hardening work is documented back into the repo after verification.

## Release Artifacts

For each release candidate, keep these updated together:

- linked PR
- passing CI run
- test evidence
- rollout notes
- operational decisions and follow-ups
