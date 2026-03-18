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
- All database reads go through `lib/{domain}/fetchers/**`.
- All database writes go through `lib/{domain}/actions/**`.
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
- `components/{domain}/**`: domain UI
- `components/ui/**`: reusable primitives only
- `lib/{domain}/fetchers/**`: read-side domain access
- `lib/{domain}/actions/**`: write-side domain mutations
- `lib/auth/**`, `lib/authz/**`: identity and authorization
- `prisma/schema.prisma`: canonical data model

## Codex Domain Resources

The `.codex` directory contains domain-specific resources to guide codex agents and automate workflows:

- `.codex/docs/`: Domain specs and requirements. See README for details.
- `.codex/instructions/`: Domain-specific instructions and architectural notes. See README for usage.
- `.codex/issues/`: Issue templates for codex-driven work. See README for automation guidance.
- `.codex/prompts/`: codex prompt files for agent orchestration. See README for workflow details.

codex agents should consult these files for domain boundaries, implementation standards, issue creation, and prompt-driven task orchestration. Refer to each subfolder's README for specifics.

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
4. update tests/docs when behavior or contracts change
5. avoid speculative abstractions unless repeated patterns justify them
