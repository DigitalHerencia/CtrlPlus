# Owner Operations Domain Spec

## Goal

Refactor owner-facing admin, settings, and cross-domain control surfaces into a coherent operational experience.

## Current repo anchors

- `app/(tenant)/admin/**`
- `app/(tenant)/settings/**`
- `components/admin/**`
- `components/settings/**`
- `components/shared/tenant-*.tsx`
- `lib/admin/**`
- `lib/settings/**`
- `lib/auth/**`
- `lib/authz/**`

## Main requirements

- improve owner dashboard usefulness
- strengthen settings flows
- align tenant navigation with actual capabilities
- keep cross-domain operational views coherent

## Key implementation points

- compose from existing domain fetchers/actions
- avoid duplicating business rules from catalog/scheduling/billing domains
- keep owner access control server-side and explicit
- improve dashboard information hierarchy and quick actions

## UX requirements

- operational dashboard, not placeholder stats
- clearer settings forms and save feedback
- coherent tenant shell navigation and layout behavior
- strong permission-denied and empty states

## Security/performance focus

- protect owner-only surfaces server-side
- keep settings scoped to current owner/session
- avoid expensive monolithic dashboard queries

## Acceptance signals

- owner-facing surfaces feel intentional and usable
- navigation reflects real product structure
- settings are cleaner and safer
- owner access boundaries remain intact
