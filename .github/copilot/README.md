# CtrlPlus Agent Resources

This directory contains agent-facing docs, instructions, contracts, prompts, and progress state for CtrlPlus.

## Directory Structure

### `/docs`

Canonical long-form documents:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `TECHNOLOGY-REQUIREMENTS.md`
4. `DATA-MODEL.md`
5. `ROADMAP.md`

### `/instructions`

Available instruction files:

- `server-first.instructions.md`
- `authentication.instructions.md`
- `catalog.instructions.md`
- `visualizer.instructions.md`
- `billing.instructions.md`
- `scheduling.instructions.md`
- `settings.instructions.md`
- `admin.instructions.md`
- `platform.instructions.md`

### `/contracts`

Available contracts:

- `naming.yaml`
- `domain-boundaries.yaml`
- `mutations.yaml`
- `domain-map.yaml`
- `layer-boundaries.contract.yaml`
- `route-layer-contract.yaml`

### `/json`

Current execution state files:

- `next-session-action-plan.json`
- `tracking-programs.json`
- `tracking-backlog.json`
- `catalog-refactor.json`
- `visualizer-refactor.json`

### `/prompts`

Current focused prompt files:

- `catalog-asset-role-unification.md`

## Precedence and Discovery

### For Agents Starting a Task

1. **Route-specific problem?** → Check `/instructions/{domain}.instructions.md`
2. **Architectural decision needed?** → Check `/docs/ARCHITECTURE.md`, then relevant domain doc
3. **Want to validate generated code?** → Check `/contracts/` for that domain
4. **Need to inherit state?** → Check `/json/next-session-action-plan.json`, `/json/tracking-programs.json`, then domain-specific JSON files
5. **Running a focused refactor?** → Use `/prompts/catalog-asset-role-unification.md`

### For Agents Completing Work

1. Update `/json/next-session-action-plan.json` and any affected domain JSON when progress changes
2. Reference updated docs in relevant instruction file sections

## Key Principles

### Context Efficiency

- Use specific `applyTo` globs in instruction files (e.g., `lib/fetchers/**` not `**`)
- Keep individual docs focused; cross-reference rather than repeat
- Instructions guide, contracts enforce; avoid redundancy

### Cohesion

- All domains follow same server-first patterns (defined in `server-first.instructions.md`)
- Cross-domain contracts live in `/contracts/` (not scattered in docs)
- Execution state is consolidated in `/json/` (single source of truth for progress)

### Tightness

- Constraints, not suggestions: Everything in `/contracts/` and instructions is non-negotiable
- Lib dir is source of truth: Adjust docs to accommodate existing lib structure, not vice versa
- No barrel index imports: Document explicit import patterns in naming contracts

## Domains

Active domains in CtrlPlus (each has instructions, docs, contracts, and progress tracking):

- **admin** - platform admin surfaces, analytics, user management
- **auth/authz** - Clerk integration, session management, capability checks
- **billing** - Stripe integration, invoicing, subscription workflows
- **catalog** - wrap storefront, asset management, publish workflows
- **platform** - core platform operations, diagnostics, integrations
- **scheduling** - booking/availability, temporal workflows
- **settings** - user settings, tenant config, preferences
- **visualizer** - wrap preview generation, vehicle photo handling, AI integration

## Related Files

- `d:\CtrlPlus\AGENTS.md` - workspace-level agent configuration and rules
- `d:\CtrlPlus\copilot-instructions.md` - project-wide coding standards and patterns
- `d:\CtrlPlus\.github\copilot-instructions.md` (deprecated; use AGENTS.md)
- `d:\CtrlPlus\README.md` - user/contributor facing docs

## Usage Examples

**Starting catalog asset role unification:**

```
/catalog-asset-role-unification
→ loads catalog-asset-role-unification.md
→ agent checks docs/ARCHITECTURE.md and docs/DATA-MODEL.md for context
→ agent loads catalog.instructions.md for rule set
→ agent validates against catalog contracts
→ agent updates catalog-refactor.json on completion
```

**Fixing an auth bug:**

```
Agent working on lib/auth/session.ts
→ automatically loads authentication.instructions.md
→ validates against auth/authz contracts
→ checks server-first.instructions.md for session patterns
```

**Planning next phase:**

```
Agent reads catalog-refactor.json
→ identifies next priority from next-session-action-plan.json/tracking-programs.json/domain JSON
→ loads relevant domain docs and instructions
→ checks known blockers in those JSON files
→ proceeds with implementation
```
