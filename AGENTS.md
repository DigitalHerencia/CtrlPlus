---
description: 'Repo-specific Agent instructions for CtrlPlus'
applyTo: '**/*'
---

# CtrlPlus Agent Instructions

## Project intent

CtrlPlus is a single-store, tenant-scoped operations platform built on Next.js App Router, Clerk auth, Prisma, Neon Postgres, Stripe billing, scheduling, a wrap catalog, and a vehicle visualizer.

## Required architecture rules

- Treat `app/**` as orchestration only.
- Do not import Prisma directly in `app/**` or React components.
- All database reads go through `lib/fetchers/{domain}`.
- All database writes go through `lib/actions/{domain}`.
- Keep auth, tenancy, ownership, and capability checks server-side.
- Never trust tenant, role, owner, booking, invoice, wrap, or preview scope from the client.
- Validate all mutation inputs with Zod or existing domain schemas.
- Preserve App Router server-first patterns.
- Prefer Server Components by default; use client components only for interaction-heavy UI.
- Reuse existing `components/ui/**` primitives; never rewrite shadcn primitives unless explicitly required.

## Repo structure expectations

- `app/(tenant)/**`: tenant routes and page orchestration
- `app/(auth)/**`: auth surfaces
- `app/api/**`: webhook and HTTP integration boundaries
- `features/{domain}/**`: business logic and domain-specific orchestration, including domain-level components, fetchers, and actions
- `components/{domain}/**`: domain UI
- `components/ui/**`: reusable primitives only
- `lib/fetchers/{domain}`: read-side domain access
- `lib/actions/{domain}`: write-side domain mutations
- `lib/auth/**`, `lib/authz/**`: identity and authorization
- `prisma/schema.prisma`: canonical data model

## Agent Domain Resources

The `.github/copilot` directory contains domain-specific resources to guide agents and automate workflows:

- `.github/copilot/instructions/`: Domain-specific architectural guidance (canonical patterns, naming, testing strategy for each domain)
- `.github/copilot/contracts/`: YAML contracts defining naming, boundaries, data access patterns, mutation pipelines, and asset lifecycles
- `.github/copilot/json/`: Execution state tracks (backlog, progress, blockers) for multi-session refactoring efforts
- `.github/copilot/prompts/`: One-shot refactor prompts (bounded, specific tasks with acceptance criteria)
- `.github/copilot/README.md`: Navigation and precedence guide

**Domain-Specific Instruction Files** (read in this order for context):

| Domain         | Instruction File                                                                                  | Primary Patterns                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Foundation** | [`server-first.instructions.md`](./.github/copilot/instructions/server-first.instructions.md)     | Layer separation, data access, caching, validation, auth enforcement       |
| **Catalog**    | [`catalog.instructions.md`](./.github/copilot/instructions/catalog.instructions.md)               | Asset roles, image management, publish workflows, form structure           |
| **Visualizer** | [`visualizer.instructions.md`](./.github/copilot/instructions/visualizer.instructions.md)         | Preview pipeline, status lifecycle, HF integration, async design           |
| **Auth**       | [`authentication.instructions.md`](./.github/copilot/instructions/authentication.instructions.md) | Session extraction, capability guards, role enforcement, Clerk integration |
| **Billing**    | [`billing.instructions.md`](./.github/copilot/instructions/billing.instructions.md)               | Stripe integration, invoices, payments, tax calculation                    |
| **Scheduling** | [`scheduling.instructions.md`](./.github/copilot/instructions/scheduling.instructions.md)         | Booking state machine, availability, notifications, calendar               |
| **Settings**   | [`settings.instructions.md`](./.github/copilot/instructions/settings.instructions.md)             | User preferences, tenant config, data export                               |
| **Admin**      | [`admin.instructions.md`](./.github/copilot/instructions/admin.instructions.md)                   | Moderation, analytics, audit logs, platform operations                     |
| **Platform**   | [`platform.instructions.md`](./.github/copilot/instructions/platform.instructions.md)             | Health checks, integrations, error handling, observability                 |

**Contract Files** (machine-readable constraints):

| Contract                                                                                       | Purpose                                                                          |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`naming.yaml`](./.github/copilot/contracts/naming.yaml)                                       | Export names (DTO/Schema suffixes), component naming, file organization          |
| [`domain-boundaries.yaml`](./.github/copilot/contracts/domain-boundaries.yaml)                 | Domain ownership, forbidden cross-domain calls                                   |
| [`mutations.yaml`](./.github/copilot/contracts/mutations.yaml)                                 | 6-step mutation pipeline (auth → authz → validate → mutate → audit → revalidate) |
| [`domain-map.yaml`](./.github/copilot/contracts/domain-map.yaml)                               | Canonical domain-to-path map for route, feature, component, and boundary files   |
| [`layer-boundaries.contract.yaml`](./.github/copilot/contracts/layer-boundaries.contract.yaml) | Layer responsibilities, forbidden behaviors, and import direction rules          |
| [`route-layer-contract.yaml`](./.github/copilot/contracts/route-layer-contract.yaml)           | Route-to-feature mapping for thin App Router page orchestration                  |

**Execution JSON Tracks** (progress across sessions):

| Refactor                    | File                                                                          | Status      | Next Step                               |
| --------------------------- | ----------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| Catalog Unification         | [`catalog-refactor.json`](./.github/copilot/json/catalog-refactor.json)       | not-started | Phase 1: Asset role consolidation       |
| Visualizer Async Generation | [`visualizer-refactor.json`](./.github/copilot/json/visualizer-refactor.json) | not-started | Phase 1: Status lifecycle formalization |

**Focused Refactor Prompts** (one-shot task prompts):

| Prompt                                                                                             | Objective                                             |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`catalog-asset-role-unification.md`](./.github/copilot/prompts/catalog-asset-role-unification.md) | Replace all `images[0]` with explicit role resolution |

Agents should consult these files in precedence order for domain boundaries, implementation standards, and prompt-driven refactor orchestration.

## Agent Resource Precedence

When `.github/copilot` resources exist, consume them in this order:

1. **Instruction file for your domain** (e.g., `catalog.instructions.md` if working on catalog)
2. **Foundational instruction** (`server-first.instructions.md`) - for patterns that apply across domains
3. **Relevant contracts** (e.g., `naming.yaml`, `mutations.yaml`) - for constraints and rules
4. **Execution JSON** (e.g., `catalog-refactor.json`) - to understand progress and blockers
5. **Focused prompts** (e.g., `catalog-asset-role-unification.md`) - for specific, bounded tasks

## Using These Resources as an Agent

**When implementing a feature or refactor, follow this workflow:**

1. **Read the foundational instruction** (`server-first.instructions.md`):
    - Understand layer separation (app → features → components → lib)
    - Understand data access patterns (lib/fetchers for reads, lib/actions for writes)
    - Understand caching strategy (revalidateTag, not revalidatePath)
    - Understand mutation pipeline (6-step: auth → authz → validate → mutate → audit → revalidate)

2. **Read the domain instruction** (e.g., `catalog.instructions.md`):
    - Understand what the domain owns and forbids (from contracts/domain-boundaries.yaml)
    - Understand DTOs and schemas for your domain
    - Understand which routes are public vs admin-only
    - Understand naming conventions for your domain

3. **Check the execution JSON** (e.g., `catalog-refactor.json`):
    - Understand what phases are in progress or blocked
    - Identify dependencies (e.g., "Phase 1 must complete before Phase 2 starts")
    - Find open decisions and blockers that affect your work

4. **Consult contracts for specific questions**:
    - `naming.yaml`: How should I name this DTO? This component? This action?
    - `domain-boundaries.yaml`: Can visualization call catalog.getWrap directly? Or must it use lib/fetchers?
    - `mutations.yaml`: What are the 6 steps for this server action? Which step am I implementing?

5. **For bounded, specific tasks**, use the focused prompts:
    - These are one-shot tasks with clear acceptance criteria
    - Example: `catalog-asset-role-unification.md` → "Replace all images[0] with explicit role resolution"

**Example: Implementing a new catalog feature**

```
1. Read server-first.instructions.md → understand layers and data access
2. Read catalog.instructions.md → understand asset roles, publish workflow, form expectations
3. Check catalog-refactor.json → see which phases are in progress (blocked on asset role unification?)
4. Check contracts/naming.yaml → what should I name my new DTO? (WrapDetailDTO pattern)
5. Start implementation, following 6-step mutation pipeline from contracts/mutations.yaml
6. If stuck on specific task, check prompts/ for relevant one-shot prompt
```

**Key Principle**: These resources guide without mandating. If a resource says "prefer," balance against project constraints. If it says "must," follow it (security, boundary, or architectural invariant).

- Understand data access patterns (lib/fetchers for reads, lib/actions for writes)
- Understand caching strategy (revalidateTag, not revalidatePath)
- Understand mutation pipeline (6-step: auth → authz → validate → mutate → audit → revalidate)

2. **Read the domain instruction** (e.g., `catalog.instructions.md`):
    - Understand what the domain owns and forbids (from contracts/domain-boundaries.yaml)
    - Understand DTOs and schemas for your domain
    - Understand which routes are public vs admin-only
    - Understand naming conventions for your domain

3. **Check the execution JSON** (e.g., `catalog-refactor.json`):
    - Understand what phases are in progress or blocked
    - Identify dependencies (e.g., "Phase 1 must complete before Phase 2 starts")
    - Find open decisions and blockers that affect your work

4. **Consult contracts for specific questions**:
    - `naming.yaml`: How should I name this DTO? This component? This action?
    - `domain-boundaries.yaml`: Can visualization call catalog.getWrap directly? Or must it use lib/fetchers?
    - `mutations.yaml`: What are the 6 steps for this server action? Which step am I implementing?

5. **For bounded, specific tasks**, use the focused prompts:
    - These are one-shot tasks with clear acceptance criteria
    - Example: `catalog-asset-role-unification.md` → "Replace all images[0] with explicit role resolution"

**Example: Implementing a new catalog feature**

```
1. Read server-first.instructions.md → understand layers and data access
2. Read catalog.instructions.md → understand asset roles, publish workflow, form expectations
3. Check catalog-refactor.json → see which phases are in progress (blocked on asset role unification?)
4. Check contracts/naming.yaml → what should I name my new DTO? (WrapDetailDTO pattern)
5. Start implementation, following 6-step mutation pipeline from contracts/mutations.yaml
6. If stuck on specific task, check prompts/ for relevant one-shot prompt
```

**Key Principle**: These resources guide without mandating. If a resource says "prefer," balance against project constraints. If it says "must," follow it (security, boundary, or architectural invariant).

## Markdown, YAML, JSON Rules

- Treat markdown as the thinking and explanation layer.
- Treat YAML as the agent contract layer.
- Treat JSON as the execution and progress layer.
- If a repeated decision can be represented as a contract, add or update YAML instead of burying it in prose.
- If a refactor spans multiple sessions or waves, update the JSON execution files so the next agent inherits real state instead of guessing.

## Refactor Program Rules

- For major `app`, `features`, and `components` refactors, start from the blueprint and derived technical docs before editing code.
- Use YAML contracts to define route ownership, domain boundaries, naming, sequencing, and acceptance gates.
- Use JSON execution files to track backlog, progress, open decisions, and validation coverage.
- Keep markdown, YAML, and JSON aligned. If one changes materially, update the others in the same pass when feasible.

- For catalog or visualizer work, treat these `.github/copilot` files as authoritative first:

- `.github/copilot/docs/PRD.md`
- `.github/copilot/docs/ARCHITECTURE.md`
- `.github/copilot/docs/DATA-MODEL.md`
- `.github/copilot/docs/ROADMAP.md`
- `.github/copilot/instructions/catalog.instructions.md`
- `.github/copilot/instructions/visualizer.instructions.md`

Catalog and visualizer prompt work currently uses this focused prompt:

- `.github/copilot/prompts/catalog-asset-role-unification.md`

## Catalog and visualizer directives

- Treat the catalog as a wrap storefront and source of truth for wrap discovery, detail presentation, publish-readiness, and visualizer handoff.
- Standardize wrap asset meaning through `WrapImageKind` with `hero`, `gallery`, `visualizer_texture`, and `visualizer_mask_hint`.
- Never derive wrap asset meaning from unordered image arrays such as `images[0]`.
- Keep catalog DTOs explicit for browse, detail, manager, publish-readiness, and visualizer selection flows.
- Preserve the customer handoff contract through `/visualizer?wrapId=...` with server-side wrap validation.
- Treat the visualizer as an AI concept preview flow, not a manufacturing proofing system.
- Keep visualizer previews on an explicit `PreviewStatus` lifecycle: `pending`, `processing`, `complete`, `failed`.
- Keep Hugging Face generation behind an adapter boundary and persist vehicle uploads and generated previews in Cloudinary rather than inline database payloads.
- Preserve fallback preview generation when HF inference is unavailable or unstable.
- Keep preview cache keys and preview ownership server-authoritative and traceable through source wrap image metadata.

## Implementation standards

- Use TypeScript strictly and avoid `any`.
- Keep domain DTOs explicit.
- Prefer narrow server actions over overloaded handlers.
- Keep page files thin; push logic into domain fetchers/actions/components.
- Prefer explicit empty, loading, error, and permission-denied states.
- Keep forms aligned with React Hook Form + Zod patterns already present in repo.
- Keep route params and search params typed and validated.
- Preserve existing capability model and owner/platform admin distinctions.

## UI standards

- Build professional, production-ready SaaS UI.
- Optimize for clarity, fast scanning, and operational workflows.
- Use consistent cards, tables, filters, status badges, dialogs, and validation feedback.
- Do not create visually noisy UI.
- Prefer progressive disclosure over overcrowded pages.
- Use existing domain component patterns before introducing new abstractions.

## Security rules

- Enforce ownership and authorization on the server.
- Keep `lib/auth/**` and `lib/authz/**` as server-boundary concerns.
- Do not expose secret keys, webhook secrets, or provider internals.
- Do not accept client-provided scope identifiers as authoritative.
- Sanitize upload handling and remote-fetch behavior.
- Treat billing, platform recovery, admin actions, and preview generation as sensitive operations.

## Performance rules

- Avoid unnecessary client-side state when server rendering is enough.
- Avoid duplicate fetches across page/component boundaries.
- Prefer cached read patterns where appropriate.
- Keep payloads small.
- Do not pass base64-heavy payloads when durable storage references are better.
- Keep long-running work out of blocking UI paths when possible.

## Testing and quality gates

Before considering work complete, ensure changes are compatible with existing CI and PR standards:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line` when affected

Follow the existing CI workflow and PR checklist conventions.

## GitHub issue / PR alignment

Use existing labels and template style:

- Feature work should align with `enhancement` style.
- Bugs should align with `bug` style.
- PRs must satisfy security and code quality checklists already used in repo.

## Agent operating mode

When implementing or refactoring:

1. inspect the relevant page, components, fetchers, actions, types, tests, and Prisma models first
2. preserve working domain boundaries
3. make the smallest coherent architectural change that improves production readiness
4. update tests/docs/contracts/execution artifacts when behavior, scope, or contracts change
5. avoid speculative abstractions unless repeated patterns justify them
