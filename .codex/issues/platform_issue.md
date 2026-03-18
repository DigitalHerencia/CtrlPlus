# Issue: Platform Admin and Webhook Operations Refactor

## Labels

feature, admin

## References

PRD.md
TECH-REQUIREMENTS.md
admin-platform.domain.md

## Summary

Improve platform operational tooling including webhook visibility and recovery actions.

## Scope

- app/(tenant)/platform/\*\*
- components/platform/\*\*
- lib/platform/\*\*

## Implementation tasks

### 1 Platform status dashboard

Show:

- webhook failures
- system status
- retry queues

### 2 Recovery actions

Add safe retry actions for failed events.

### 3 UI separation

Separate diagnostics from destructive recovery tools.

### 4 Security

Only platform admins may access these routes.

## QA / CI

- lint
- typecheck
- build

## Completion criteria

- operational state easier to understand
- recovery actions safe
- privilege boundaries enforced
