---
description: 'Domain instructions for platform admin and recovery operations'
applyTo: 'app/(tenant)/platform/**,components/platform/**,lib/platform/**,app/api/clerk/**,app/api/stripe/**'
---

# Admin Platform Domain Instructions

## Domain purpose

Admin platform covers internal platform operations, webhook status/recovery workflows, maintenance actions, and platform health visibility.

## Scope boundaries

This domain owns:

- platform dashboard/status views
- webhook operations overview
- recovery and maintenance actions
- internal admin tooling around provider integrations
- operational handling around webhook event flows

This domain does not own:

- tenant-facing catalog UX
- booking UX
- invoice UX
- visualizer UX

## Required patterns

- Keep platform pages read-heavy and server-controlled.
- Reads go through `lib/platform/fetchers/**` and related operational fetchers.
- Writes go through `lib/platform/actions/**` or explicit webhook handlers.
- Webhook routes remain narrow integration boundaries.
- Recovery actions must be explicit, auditable, and safe.

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
2. harden replay/recovery workflows
3. separate diagnostics from dangerous actions
4. tighten privilege enforcement
5. improve operational test coverage around webhooks and recovery
