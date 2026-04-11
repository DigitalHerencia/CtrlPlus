# CtrlPlus

CtrlPlus is a tenant-scoped operations platform for vehicle wrap businesses.
It combines catalog management, visualizer previews, scheduling, billing,
authentication, and admin tooling in a server-first Next.js architecture.

## Platform Snapshot

| Area               | What it delivers                                          |
| ------------------ | --------------------------------------------------------- |
| Catalog            | Wrap discovery, detail pages, publish-readiness workflows |
| Visualizer         | Preview generation lifecycle with server-owned validation |
| Scheduling         | Booking operations and workflow orchestration             |
| Billing            | Stripe-backed billing and invoicing paths                 |
| Admin and Platform | Moderation, operational insights, and governance surfaces |

## Tech Stack

| Layer               | Technologies                                              |
| ------------------- | --------------------------------------------------------- |
| Frontend            | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS |
| Identity            | Clerk                                                     |
| Data                | Prisma + Neon Postgres                                    |
| Payments            | Stripe                                                    |
| Testing and Quality | Vitest, Playwright, ESLint, TypeScript type-checking      |

## Getting Started

```powershell
pnpm install
Copy-Item .env.example .env
Copy-Item .env.example .env.local
pnpm exec prisma generate
pnpm dev
```

## Architecture Guardrails

- Keep `app/**` route-focused and orchestration-only.
- Route all reads through `lib/fetchers/{domain}`.
- Route all writes through `lib/actions/{domain}`.
- Keep auth, tenancy, ownership, and capability checks server-side.
- Reuse `components/ui/**` primitives and keep domain UI in
  `components/{domain}/**`.

## Engineering References

- `.agents/README.md`
- `.agents/docs/`
- `.agents/instructions/`
- `.agents/contracts/`
- `.agents/json/`
- `.agents/prompts/`

`docs/` is reserved for end-user and operational product documentation.

`AGENTS.md` and `.github/copilot-instructions.md` are synchronized repository-level
agent instructions and must remain identical.

## Quality Gates

```powershell
pnpm lint
pnpm typecheck
pnpm prisma:validate
pnpm test
pnpm build
```

## CtrlPlus codebase metrics

### Scope used

- **Primary analysis:** `git ls-files` (tracked files only)
- **Also included:** all files currently on disk (to show workspace bloat)

### 1) File counts

| Metric                               |      Count |
| ------------------------------------ | ---------: |
| Tracked files (codebase)             |    **684** |
| All files on disk (excluding .git)   | **52,614** |
| Directories on disk (excluding .git) | **10,689** |

> The big gap between tracked vs on-disk is typically from dependencies or build artifacts, likely `node_modules`, test outputs, and similar generated assets.

### 2) File type breakdown (top)

| Extension |   Count |
| --------- | ------: |
| `.tsx`    | **432** |
| `.ts`     | **158** |
| `.md`     |      36 |
| `.sql`    |      14 |
| `.png`    |       9 |
| `.json`   |       8 |
| `.yaml`   |       7 |
| `.mjs`    |       3 |
| `.yml`    |       3 |

Quick take:

- **TS/TSX combined = 590 files (~86.3% of tracked files)**
- `.tsx` alone is **~63.2%** of tracked files

### 3) Line counts

| Metric                                                 |      Lines |
| ------------------------------------------------------ | ---------: |
| Total lines (tracked files)                            | **50,996** |
| Non-empty lines                                        | **42,974** |
| Source-only lines (configured code or text extensions) | **50,736** |

> Note: line totals are physical line counts, not comment-adjusted or blank-adjusted language parsing.

### 4) Largest tracked files by line count

1. `pnpm-lock.yaml` - **9,540**
2. `billing.actions.ts` - **778**
3. `sidebar.tsx` - **748**
4. `catalog.actions.ts` - **748**
5. `catalog-manager-client.tsx` - **691**
6. `route.ts` - **644**
7. `scheduling.actions.ts` - **583**
8. `admin.fetchers.ts` - **539**
9. `catalog.fetchers.ts` - **525**
10. `scheduling.fetchers.ts` - **477**

### 5) Top-level folder distribution (tracked files)

| Folder     |   Files |
| ---------- | ------: |
| components | **222** |
| features   | **121** |
| app        |  **92** |
| lib        |  **73** |
| tests      |  **48** |
| .github    |      38 |
| `[root]`   |      29 |
| types      |      18 |
| prisma     |      16 |
| schemas    |      13 |

## Contributing

See `CONTRIBUTING.md` for contribution workflow, validation expectations, and pull request guidance.

## Developer: Dependency Graph & TSDoc

See `docs/DEPENDENCYGRAPH.md` for step-by-step guidance on generating
TSDoc comments (using `cschlosser.doxdocgen`), running the VS Code
Dependency Graph extension (`sz-p.dependencygraph`), and using the
helper script `scripts/tsdoc-suggester.js` to suggest conservative
TSDoc templates across the codebase.
