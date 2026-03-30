---
description: 'Repo-specific Codex instructions for CtrlPlus'
applyTo: '**/*'
---

# CtrlPlus Codex Instructions

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

## Codex Domain Resources

The `.codex` directory contains domain-specific resources to guide codex agents and automate workflows:

- `.codex/arch/`: Target architecture, refactor principles, and directory-tree specs.
- `.codex/docs/`: Domain specs and cross-domain product or technical requirements.
- `.codex/instructions/`: Domain-specific instructions and architectural notes.
- `.codex/contracts/`: YAML contracts that agents consume as literal execution constraints.
- `.codex/execution/`: JSON backlog, progress, decision, and validation state for active programs.
- `.codex/prompts/`: Per-domain refactor prompts for future execution passes.
- `.codex/README.md`: entrypoint describing precedence and how markdown, YAML, and JSON fit together.

The active codex domain set is:

- `admin`
- `auth/authz`
- `billing`
- `catalog`
- `platform`
- `scheduling`
- `settings`
- `visualizer`

codex agents should consult these files for domain boundaries, implementation standards, and prompt-driven refactor orchestration. These codex artifacts are preparatory guidance and do not themselves authorize runtime refactors that are outside the current task.

## Codex Resource Precedence

When `.codex` resources exist, consume them in this order:

1. `.codex/README.md`
2. relevant `.codex/instructions/*.md`
3. relevant `.codex/docs/*.md` and `.codex/arch/*.md`
4. relevant `.codex/contracts/*.yaml`
5. relevant `.codex/execution/*.json`
6. relevant `.codex/prompts/*.md`

## Instruction Discovery

- Codex auto-discovers `AGENTS.md` files by name and scope.
- Files under `.codex/instructions/*.md` are not auto-discovered by filename alone; they are repo-directed resources that agents must read because this `AGENTS.md` tells them to.
- Do not rename `.codex/instructions/*.md` to `{domain}.agents.md` unless you are intentionally creating another scoped `AGENTS.md` surface.

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

For catalog or visualizer work, treat these `.codex` files as authoritative first:

- `.codex/arch/codex_catalog_visualizer_migration_spec.md`
- `.codex/arch/codex_visualizer_huggingface_generation_spec.md`
- `.codex/docs/catalog.md`
- `.codex/docs/visualizer.md`
- `.codex/instructions/catalog.instructions.md`
- `.codex/instructions/visualizer.instructions.md`

Catalog and visualizer prompt work now follows a `master + phases` model:

- use `.codex/prompts/catalog.refactor.prompt.md` or `.codex/prompts/visualizer.refactor.prompt.md` as the domain-level entrypoint
- pair the master prompt with the relevant phase prompt under `.codex/prompts/` for bounded implementation passes
- use `.codex/prompts/catalog-visualizer.integration-e2e.prompt.md` when the storefront funnel spans both domains

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

## Codex operating mode

When implementing or refactoring:

1. inspect the relevant page, components, fetchers, actions, types, tests, and Prisma models first
2. preserve working domain boundaries
3. make the smallest coherent architectural change that improves production readiness
4. update tests/docs/contracts/execution artifacts when behavior, scope, or contracts change
5. avoid speculative abstractions unless repeated patterns justify them
