# Platform Domain Spec

## Goal

Refactor platform-admin diagnostics and recovery tooling into a safer, clearer operational surface for webhook and system health management.

## Current repo anchors

- `app/(tenant)/platform/**`
- `features/platform/**`
- `components/platform/**`
- `lib/platform/actions/**`
- `lib/platform/fetchers/**`
- `app/api/stripe/webhook/route.ts`
- `lib/authz/**`

## Main requirements

- improve status visibility
- separate diagnostics from recovery actions
- harden replay and recovery behavior
- preserve strict platform-admin privilege boundaries
- keep platform ops distinct from auth/authz implementation ownership

## Key implementation points

- keep platform reads in `lib/platform/fetchers/**`
- keep recovery and maintenance mutations in `lib/platform/actions/**`
- keep route entrypoints thin and push orchestration into `features/platform/**`
- keep webhook routes narrow and testable
- treat auth and identity sync as `auth/authz` implementation concerns even when platform surfaces observe or recover related events
- account for the audit finding that current retry UI must evolve from state flipping into real retry execution

## UX requirements

- platform pages should surface health, failures, backlog, and next actions quickly
- dangerous actions must require context, confirmation, and operator clarity
- maintenance and recovery tools must not be mixed into noisy layouts
- diagnostics should be readable without exposing low-signal provider internals

## Security/performance focus

- highly privileged server-side enforcement
- no client-authoritative operational actions
- paginated and targeted operational data access
- auditable, idempotent recovery flows where possible
- avoid broad first-load queries across large webhook histories

## Acceptance signals

- platform routes, features, and helpers align with the target architecture
- platform tools are safer to operate
- webhook and operational visibility improves
- diagnostics and recovery concerns are clearly separated
- privilege boundaries remain strict and auditable
