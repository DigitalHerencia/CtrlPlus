# Admin Platform Domain Spec

## Goal

Refactor platform admin and recovery tooling into a safer, clearer operational surface for webhook and system health management.

## Current repo anchors

- `app/(tenant)/platform/**`
- `components/platform/**`
- `lib/platform/**`
- `app/api/clerk/webhook-handler/route.ts`
- `app/api/stripe/webhook/route.ts`

## Main requirements

- improve status visibility
- separate diagnostics from recovery actions
- harden replay/recovery behavior
- preserve platform admin privilege boundaries

## Key implementation points

- keep operational reads in platform fetchers
- keep operational mutations explicit and minimal
- keep webhook routes focused and testable
- represent failure/retry state clearly in UI

## UX requirements

- platform page should surface health, failures, backlog, and next actions quickly
- dangerous actions must require context and confirmation
- maintenance and recovery tools must not be mixed into noisy layouts

## Security/performance focus

- highly privileged server-side enforcement
- no client-authoritative operational actions
- paginated/targeted operational data access
- idempotent recovery flows where possible

## Acceptance signals

- platform tools are safer to operate
- webhook and operational visibility improves
- recovery flows are clearer and more testable
- privilege boundaries remain strict
