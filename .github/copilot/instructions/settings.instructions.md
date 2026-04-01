---
description: 'Domain instructions for current-user and owner-scoped settings flows'
applyTo: 'app/(tenant)/settings/**,components/settings/**,lib/settings/**'
---

# Settings Domain Instructions

## Domain purpose

The settings domain owns current-user and owner-scoped configuration flows, settings reads and writes, and the forms used to manage those preferences.

## Scope boundaries

This domain owns:

- settings pages
- settings form UI
- settings fetchers and actions
- settings-specific validation and save feedback

This domain does not own:

- owner dashboard metrics
- billing lifecycle logic
- scheduling lifecycle logic
- auth or capability policy implementation

## Required patterns

- Keep `app/(tenant)/settings/**` thin and orchestration-focused.
- Reads go through `lib/settings/fetchers/**`.
- Writes go through `lib/settings/actions/**`.
- Future refactors should move settings composition into `features/settings/**`.
- Keep settings validation explicit and schema-backed.

## Security requirements

- Enforce current-user or owner scope server-side.
- Never trust client-provided role or scope identifiers.
- Keep authorization policy in `lib/auth/**` and `lib/authz/**`, not in the form layer.
- Keep settings mutations explicit and auditable enough for sensitive preferences.

## Product requirements

- Settings forms must be clear, focused, and easy to complete.
- Save feedback must be immediate and trustworthy.
- Validation should be field-specific and actionable.
- Settings should remain distinct from admin dashboard concerns.

## UI requirements

- Forms should use existing form primitives and patterns.
- Include explicit success, error, loading, empty, and permission-denied states.
- Avoid overcrowding pages with unrelated controls.
- Prefer progressive disclosure when settings become more complex.

## Performance requirements

- Keep settings reads focused and server-side.
- Avoid broad dashboard-style queries for single-user settings screens.
- Use targeted revalidation after settings mutations.

## Testing requirements

Add or update tests when changing:

- settings fetchers
- settings mutations
- settings form validation
- settings save feedback
- settings access rules

## Refactor priorities

1. clarify settings form structure and validation
2. improve save feedback and permission handling
3. keep settings reads and writes focused
4. separate settings from generic operations or dashboard concerns
5. preserve coverage for settings access and save flows
