# Issue: Owner Operations Dashboard and Settings Improvements

## Labels

feature, owner

## References

PRD.md
TECH-REQUIREMENTS.md
owner-operations.domain.md

## Summary

Improve owner dashboard usefulness, tighten settings UX, and ensure owner-only workflows are secure and clear.

## Scope

- app/(tenant)/admin/\*\*
- app/(tenant)/settings/\*\*
- components/admin/\*\*
- components/settings/\*\*

## Implementation tasks

### 1 Dashboard

Replace placeholder stats with operational metrics:

- bookings
- invoices
- catalog health

### 2 Settings UX

Improve:

- validation
- save feedback
- form clarity

### 3 Navigation

Ensure tenant navigation reflects actual capabilities.

### 4 Security

All owner surfaces must enforce owner permissions server-side.

## QA / CI

- lint
- typecheck
- build

## Completion criteria

- dashboard useful
- settings safer and clearer
- owner permission boundaries intact
