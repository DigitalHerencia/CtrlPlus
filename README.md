# CTRL+

Single-store vehicle wrap platform built with Next.js 16, React 19, TypeScript 5, Prisma 7, Neon Postgres, Clerk, Tailwind 4, and Vercel.

## Quick Start

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm prisma generate
pnpm dev
```

## Workspace Setup

Project-facing engineering workflow docs now live under `.codex/`:

- `.codex/README.md`
- `.codex/config.toml`
- `.codex/instructions/`
- `.codex/setup/`

`docs/` is reserved for end-user and operational product documentation only.

## Core Rules

- Do not import Prisma in `app/**` except webhook handlers.
- Keep reads in `lib/*/fetchers` and writes in `lib/*/actions`.
- All actions follow `auth -> authorize -> validate -> mutate -> audit`.
- Resolve elevated access server-side from session and environment only.

## Commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm codex:doctor
```
