---
description: 'Domain instructions for platform admin diagnostics and recovery operations'
applyTo: 'app/(tenant)/platform/**,components/platform/**,lib/platform/**,app/api/stripe/**'
---

# Platform Domain Instructions

## Domain purpose

The platform domain covers internal platform operations, webhook status or recovery workflows, maintenance actions, and platform health visibility.

## Scope boundaries

This domain owns:

- platform dashboard/status views
- webhook operations overview
- recovery and maintenance actions
- internal admin tooling around provider integrations
- operational handling around webhook event flows

This domain does not own:

- auth route implementation
- Clerk identity sync implementation
- tenant-facing catalog UX
- booking UX
- invoice UX
- visualizer UX

## Required patterns

- Keep platform pages read-heavy and server-controlled.
- Reads go through `lib/platform/fetchers/**` and related operational fetchers.
- Writes go through `lib/platform/actions/**` or explicit webhook handlers.
- Future refactors should move route composition into `features/platform/**`.
- Webhook routes remain narrow integration boundaries.
- Recovery actions must be explicit, auditable, and safe.
- Platform may observe Clerk-related failures operationally, but auth identity sync ownership stays in the auth/authz domain.

## Security requirements

- Treat platform actions as highly privileged.
- Enforce platform admin checks server-side.
- Never expose provider secrets or raw operational internals unnecessarily.
- Recovery and replay actions must validate scope, target, and current state.
- Avoid any client-authoritative operational mutation paths.

## Product requirements

- Platform dashboard must expose health, backlog, failures, and recovery options clearly.
- Recovery actions must distinguish retryable failures from terminal states.
- Webhook management must make operational state understandable quickly.
- Platform recovery UX must not imply a retry happened when the code only flipped stored state.

## UI requirements

- Platform UI should be concise, high-signal, and operational.
- Prefer tables, summaries, severity/status badges, and explicit action grouping.
- Surface dangerous actions with confirmation and context.
- Separate read-only diagnostics from mutating recovery tools.

## Performance requirements

- Keep operational overviews query-efficient.
- Avoid loading excessive event history on first render.
- Prefer targeted fetches and pagination for large operational data sets.

## Testing requirements

Add or update tests when changing:

- webhook route behavior
- recovery actions
- platform status fetchers
- platform admin access rules
- failure/retry handling

## Refactor priorities

1. improve platform status clarity
2. harden replay/recovery workflows into real retry execution
3. separate diagnostics from dangerous actions
4. tighten privilege enforcement
5. improve operational test coverage around webhooks and recovery
