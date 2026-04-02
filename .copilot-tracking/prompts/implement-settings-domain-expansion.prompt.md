---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Comprehensive Settings Domain Expansion

## Task Overview

Implement segmented settings domain architecture for profile/account/data routes with server-first boundaries, owner-only tenant and export mutations, expanded settings contracts, and updated tests.

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20260402-settings-domain-expansion-changes.md` in #file:../changes/ if it does not exist.

### Step 2: Execute Implementation

You WILL follow #file:c:/Users/scree/AppData/Roaming/Code/User/prompts/instructions/task-implementation.instructions.md
You WILL systematically implement #file:../plans/20260402-settings-domain-expansion-plan.instructions.md task-by-task.
You WILL follow all CtrlPlus project standards and layer-boundary rules.

**CRITICAL**: If `${input:phaseStop:true}` is true, you WILL stop after each Phase for user review.
**CRITICAL**: If `${input:taskStop:false}` is true, you WILL stop after each Task for user review.

### Step 3: Cleanup

When all phases are checked off (`[x]`) and completed, you WILL:

1. Provide a concise summary of all changes from #file:../changes/20260402-settings-domain-expansion-changes.md with markdown file links.
2. Provide markdown links to:
    - #file:../plans/20260402-settings-domain-expansion-plan.instructions.md
    - #file:../details/20260402-settings-domain-expansion-details.md
    - #file:../research/20260402-settings-domain-expansion-research.md
      and recommend cleanup archival when no longer needed.
3. Attempt to delete #file:../prompts/implement-settings-domain-expansion.prompt.md.

## Success Criteria

- [ ] Changes tracking file created
- [ ] All plan items implemented with working code
- [ ] All detail-file specifications satisfied
- [ ] Project conventions and server-boundary rules followed
- [ ] Changes file updated continuously during implementation
