---
description: Edge-case and lifecycle audit. Hunts down unhandled states, broken lifecycle transitions, and silent failures across all domain flows.
---

# POST-REFACTOR ENFORCEMENT PROMPT — EDGE CASES DON'T PAY RENT BUT THEY LIVE HERE NOW

You are performing an edge-case and lifecycle audit.

## Mission

Hunt down unhandled states, broken lifecycles, and silent failures.

## Audit objectives

1. Missing status states (pending/processing/failed/etc.)
2. Incomplete lifecycle transitions
3. Missing error handling
4. Silent failures in async flows
5. Inconsistent empty states
6. Missing not-found handling

## Correction rules

- Enumerate all lifecycle states explicitly
- Handle failure states visibly
- Add strong empty states
- Add error boundaries where needed

## Deliverables

- Apply lifecycle hardening
- Output grouped changes:
  - State completeness fixes
  - Error handling fixes
  - Empty state improvements

## Verification checklist

- No undefined states
- Failures are visible
- Empty states are intentional
