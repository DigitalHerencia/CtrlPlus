---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Scheduling Route/Feature/Component Full Structure

## Task Overview

Implement the full requested scheduling route/feature/component structure while preserving CtrlPlus server-first boundaries and reusing existing scheduling fetchers/actions.

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20260402-scheduling-route-feature-component-structure-changes.md` in #file:../changes/ if it does not exist.

### Step 2: Execute Implementation

You WILL follow #file:../../.github/instructions/task-implementation.instructions.md
You WILL systematically implement #file:../plans/20260402-scheduling-route-feature-component-structure-plan.instructions.md task-by-task
You WILL follow ALL project standards and conventions

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

### Step 3: Execution Order (File Creation/Update Sequence)

1. Route scaffolding under `app/(tenant)/scheduling/**`:
    - Add missing customer route files (`not-found`, `new`, `[bookingId]`, `[bookingId]/edit`).
    - Add full `/manage` route tree and segment special files.
2. Customer feature files under `features/scheduling/**`.
3. Manage feature files under `features/scheduling/manage/**`.
4. Presentational components under `components/scheduling/**` and nested `booking-form/**` + `manage/**`.
5. Update any existing scheduling features/pages to point to new file names.
6. Validate no Prisma imports in app/features/components.
7. Run lint/typecheck/tests.

### Step 4: Dependency Notes (Must Hold)

- Pages depend on features (never vice-versa).
- Features depend on components + `lib/fetchers/scheduling.fetchers` + `lib/actions/scheduling.actions`.
- Components depend on `components/ui/**` and typed props only.
- Manage features require capability checks before exposing all-bookings actions.
- Any required extra fields are added in `lib/fetchers/scheduling.fetchers.ts` / `types/scheduling.types.ts`, not in route/component layers.

### Step 5: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from #file:../changes/20260402-scheduling-route-feature-component-structure-changes.md to the user:
    - You WILL keep the overall summary brief
    - You WILL add spacing around any lists
    - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to .copilot-tracking/plans/20260402-scheduling-route-feature-component-structure-plan.instructions.md, .copilot-tracking/details/20260402-scheduling-route-feature-component-structure-details.md, and .copilot-tracking/research/20260402-scheduling-route-feature-component-structure-research.md documents. You WILL recommend cleaning these files up as well.
3. **MANDATORY**: You WILL attempt to delete .copilot-tracking/prompts/implement-scheduling-route-feature-component-structure.prompt.md

## Success Criteria

- [ ] Changes tracking file created
- [ ] All plan items implemented with working code
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] Changes file updated continuously
