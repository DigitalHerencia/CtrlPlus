# CtrlPlus

CtrlPlus is a single-store vehicle wrap operations platform built with Next.js 16, React 19, TypeScript, Prisma, Neon Postgres, Clerk, Stripe, and Tailwind CSS.

## What This Repo Contains

- Tenant-facing wrap catalog and visualizer flows
- Scheduling and billing workflows
- Admin and platform operational surfaces
- A server-first architecture scaffold under `.codex/` for large refactor work

## Quick Start

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm exec prisma generate
pnpm dev
```

## Core Architecture Rules

- Keep `app/**` thin and route-focused.
- Keep reads behind `lib/fetchers/**`.
- Keep writes behind `lib/actions/**`.
- Keep Prisma, authz, ownership, billing, and preview authority on the server.
- Reuse `components/ui/**` for primitives and keep domain UI in `components/{domain}/**`.

## Engineering Docs

Project-facing engineering workflow docs live under `.codex/`:

- `.codex/README.md`
- `.codex/docs/`
- `.codex/contracts/`
- `.codex/execution/`
- `.codex/instructions/`
- `.codex/prompts/`

`docs/` is reserved for end-user and operational product documentation.

## Common Commands

```powershell
pnpm lint
pnpm typecheck
pnpm prisma:validate
pnpm test
pnpm build
```

## Contributing

See `CONTRIBUTING.md` for contribution workflow, validation expectations, and PR guidance.
