# Instructions Files

YAML-frontmatter markdown files that guide agent behavior for specific files and patterns.

## Structure

Each file has YAML frontmatter with metadata:

- `description` - What this instruction is for (used for discovery)
- `applyTo` - Glob pattern for files this applies to
- Body: Structured guidance organized by topic

## Core Instructions

### `server-first.instructions.md` (Foundational)

Applies to: All TypeScript/app files

Defines the server-first architecture that all domains follow:

- How to organize `app/`, `features/`, `components/`, `lib/`
- Pattern for page → feature → component layers
- Server actions, fetchers, and auth/authz expectations
- When to use Server Components vs. Client Components
- Common anti-patterns and how to avoid them

**Load this first** to understand the baseline architecture all domains inherit.

### `{domain}.instructions.md` (8 per domain)

Applies to: Domain-specific patterns

**Files** (one per active domain):

- `admin.instructions.md` - Platform admin surfaces + analytics
- `authentication.instructions.md` - Clerk integration + capability checks
- `billing.instructions.md` - Stripe integration + payment workflows
- `catalog.instructions.md` - Wrap storefront + asset management
- `platform.instructions.md` - Core platform operations + tenancy
- `scheduling.instructions.md` - Availability + bookings + temporal logic
- `settings.instructions.md` - User preferences + tenant config
- `visualizer.instructions.md` - Preview generation + vehicle handling + AI

Each domain instruction includes:

- Domain-specific architecture and layer expectations
- Naming conventions (DTOs, types, components, actions)
- Auth/authz patterns and capability checks
- Common tasks and code templates
- Anti-pattern warnings

## Note

Testing and security guidance is covered through:

- `server-first.instructions.md`
- `authentication.instructions.md`
- domain instruction files

## Update Pattern

When adding a new domain or discovering a recurring pattern:

1. **Create** `{domain}.instructions.md` with frontmatter
2. **Set `applyTo`** to match all files in that domain (e.g., `lib/{domain}/**`, `app/(tenant)/{domain}/**`)
3. **Document patterns** that appear across multiple files in that domain
4. **Cross-reference** `server-first.instructions.md` for baseline architecture
5. **Link to contracts** for machine-checkable rules

## Discovery Rules

- Agents auto-load instructions based on `applyTo` glob pattern
- Multiple instruction files can apply to the same file (they combine)
- More specific patterns take precedence (domain > server-first)
- If an instruction feels large ( > 500 lines), split it into a doc + a shorter instruction

## Example: Adding Catalog Instructions

When updating `catalog.instructions.md`:

- Set `applyTo: "lib/catalog/**, features/catalog/**, app/(tenant)/catalog/**"`
- Include sections: Asset roles, DTO contracts, server actions, publish validation
- Link to `/docs/ARCHITECTURE.md` and `/docs/DATA-MODEL.md` for long explanations
- Link to `/contracts/naming.yaml` and `/contracts/mutations.yaml` for enforceable rules

## File Relationships

- `server-first.instructions.md` ← foundational, loaded first
- `{domain}.instructions.md` ← domain-specific, loaded when working in that domain

All reference and cross-link each other for coherence.
