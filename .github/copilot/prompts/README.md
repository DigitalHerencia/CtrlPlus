# Prompts Files

Markdown prompt files with structured sections for single-focused refactor or implementation tasks.

## Purpose

Prompts are the task layer: they're parameterized workflows for recurring refactor patterns or large coordinated tasks. They appear as slash commands in chat (e.g., `/catalog-refactor`).

## Available Prompt Files

### `catalog-asset-role-unification.md`

Focused prompt for replacing `images[0]`-based behavior with explicit asset-role
resolution across catalog and visualizer paths.

Use this for:

- catalog card/detail image correctness
- visualizer texture role enforcement
- deterministic asset selection behavior

## Prompt Expansion Guidance

If additional prompts are introduced in the future, keep this README in sync and
only reference prompt files that exist in this directory.

## Structure

Each prompt file has:

1. **Header** - purpose, triggers, related docs
2. **Context** - links to docs, contracts, existing code
3. **Steps** - numbered implementation tasks
4. **Validation** - checklist of sign-off criteria
5. **Handoff** - what to update in `/json/` before completing

**Example header:**

```markdown
---
description: 'Catalog domain refactor orchestration. Use when: overhauling catalog architecture, normalizing asset roles, hardening publish workflow'
related_docs: [.github/copilot/docs/ARCHITECTURE.md, .github/copilot/docs/DATA-MODEL.md]
related_contracts:
    [
        .github/copilot/contracts/naming.yaml,
        .github/copilot/contracts/domain-boundaries.yaml,
        .github/copilot/contracts/mutations.yaml,
    ]
---
```

## Execution Pattern

When an agent loads a prompt:

1. Read header + context sections
2. Load linked docs and contracts
3. Check `/json/catalog-refactor.json` for prioritized tasks within prompt scope
4. Check `/json/visualizer-refactor.json` when visualizer dependencies are involved
5. Execute steps in order
6. Validate against checklist
7. Update JSON files with progress
8. Document notable decisions in the relevant docs when applicable

## Discovery

Prompts are available as:

- Slash command in chat: `/catalog-asset-role-unification`
- Linked in relevant instruction or docs files
- Referenced in `catalog-refactor.json` / `visualizer-refactor.json` notes when applicable

## Naming Convention

- Focused prompts: `{domain}-{topic}.md`
