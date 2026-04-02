# Execution JSON Files

Machine-readable state files for tracking work progress, decisions, and validation across implementation sessions.

## Purpose

JSON files serve as the execution/state layer: they track what's been done, what's in progress, and what's blocked. Next agent inherits concrete state instead of guessing.

## Files

### `catalog-refactor.json`

Catalog refactor progress, tasks, and phase state.

### `visualizer-refactor.json`

Visualizer refactor progress, tasks, and phase state.

**Fields:**

- `current_phase` - which phase is active
- `completion` - status and date per phase
- `completion_pct` - rough % for current phase
- `blockers` - any unresolved issues
- `notes` - next agent handoff notes

**Use when:**

- Checking domain health
- Planning next phase
- Identifying unblocked work

These two JSON files are the active source of progress state in this repository.

## Update Pattern

When completing work:

1. Update `catalog-refactor.json` or `visualizer-refactor.json` with status changes
2. Record blockers and next steps in those files
3. Keep dates and phase indicators current

## Next Agent Handoff

When handing off to next agent:

- Update the relevant active JSON file (`catalog-refactor.json` or `visualizer-refactor.json`)
- List blockers explicitly
- Include links to relevant docs/contracts where useful

## Example: Catalog Phase Handoff

```json
{
    "catalog": {
        "last_updated": "2026-04-02",
        "current_phase": "phase-2-asset-management",
        "notes": "Phase 1 DTO migration complete. Next: ImageManager component refactor for explicit asset roles. See .github/copilot/docs/ARCHITECTURE.md for context."
    }
}
```
