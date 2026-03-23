# Settings Domain Spec

## Goal

Refactor settings into a clear, schema-backed configuration surface for current-user and owner-scoped preferences under the target server-first architecture.

## Current repo anchors

- `app/(tenant)/settings/**`
- `components/settings/**`
- `lib/settings/**`
- `lib/auth/**`
- `lib/authz/**`

## Main requirements

- keep settings reads and writes focused
- strengthen validation and save feedback
- preserve current-session or owner scoping
- keep settings flows distinct from admin dashboard concerns
- prepare settings routes for thin page orchestration and feature-owned form flow

## Key implementation points

- keep reads in `lib/settings/fetchers/**`
- keep writes in `lib/settings/actions/**`
- keep validation tied to explicit settings DTOs and schemas
- keep route entrypoints thin and move orchestration into `features/settings/**` during the actual refactor
- keep settings-specific revalidation targeted to settings routes and dependent summaries

## UX requirements

- settings forms must be easy to scan and complete
- save feedback should be explicit and trustworthy
- validation messages should be field-specific and actionable
- loading, empty, permission-denied, and error states must be explicit

## Security/performance focus

- protect settings mutations server-side
- never trust client-provided scope or role claims
- avoid broad dashboard-style queries for simple settings screens
- keep settings reads small and stable

## Acceptance signals

- settings routes, forms, and server helpers align with the target architecture
- settings forms are clearer and safer to use
- permission boundaries remain intact
- settings concerns are no longer folded into a generic operations bucket
