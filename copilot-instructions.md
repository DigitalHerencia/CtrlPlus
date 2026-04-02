---
description: 'CtrlPlus-specific customization for GitHub Copilot. Start here for AI-assisted development.'
applyTo: '**/*'
---

# CtrlPlus Copilot Instructions

Quick reference for AI assistance on CtrlPlus. Full guidance lives in `.github/copilot/`.

## What is CtrlPlus?

A single-store, tenant-scoped operations platform:

- **WrapCatalog**: Storefront for vehicle wrap designs
- **VisualizerAI**: Preview wraps on customer vehicles via Hugging Face segmentation
- **Scheduling**: Book appointments for wrap installations
- **Billing**: Stripe-integrated subscription management
- **Admin**: Tenant owner dashboard and moderation

**Tech Stack**: Next.js 16 App Router, React 19, TypeScript, Prisma, Neon Postgres, Clerk auth, Cloudinary, Hugging Face AI

## Golden Rules (Never Violate)

1. **No direct Prisma in `app/**`or React components.** All database access through`lib/fetchers/`(reads) or`lib/actions/` (writes).
2. **No barrel imports** (`export * from`). Import explicitly.
3. **All auth/authz server-side only.** Never trust tenant, role, or user scope from the client.
4. **Mutation pipeline: 6 steps.** Auth → Authz → Validate → Mutate → Audit → Revalidate. Always. See `.github/copilot/contracts/mutations.yaml`.
5. **Layer separation is strict.** `app/**` = orchestration only. `features/**` = domain logic. `components/**` = pure UI. `lib/**` = business logic.

## How to Get Help

### For General Questions

- Start with `.github/copilot/instructions/server-first.instructions.md` (foundational patterns apply everywhere)

### For Domain-Specific Questions

- **Catalog work?** Read `.github/copilot/instructions/catalog.instructions.md`
- **Visualizer work?** Read `.github/copilot/instructions/visualizer.instructions.md`
- **Auth/security?** Read `.github/copilot/instructions/authentication.instructions.md`
- **Billing/payments?** Read `.github/copilot/instructions/billing.instructions.md`
- **Scheduling/appointments?** Read `.github/copilot/instructions/scheduling.instructions.md`
- **Settings/preferences?** Read `.github/copilot/instructions/settings.instructions.md`
- **Admin/moderation?** Read `.github/copilot/instructions/admin.instructions.md`
- **Infrastructure/health?** Read `.github/copilot/instructions/platform.instructions.md`

### For Specific Constraints

- **Naming conventions** → `.github/copilot/contracts/naming.yaml` (export suffixes, component names, file structure)
- **Domain boundaries** → `.github/copilot/contracts/domain-boundaries.yaml` (what each domain owns, forbidden calls)
- **Mutation checklist** → `.github/copilot/contracts/mutations.yaml` (6-step pipeline template)
- **Domain path map** → `.github/copilot/contracts/domain-map.yaml` (route/feature/component roots and boundary files)
- **Layer rules** → `.github/copilot/contracts/layer-boundaries.contract.yaml` (allowed/forbidden layer behavior and import direction)
- **Route-to-feature mapping** → `.github/copilot/contracts/route-layer-contract.yaml` (thin route orchestration targets)

### For Multi-Step Refactors

- **Catalog unification** → `.github/copilot/json/catalog-refactor.json` (phases, tasks, blockers, progress)
- **Visualizer async** → `.github/copilot/json/visualizer-refactor.json` (phases, tasks, blockers, progress)

### For One-Shot Tasks

- **Fix all images[0] usage** → `.github/copilot/prompts/catalog-asset-role-unification.md` (specific task, acceptance criteria, dependencies)

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                     app/(tenant)/**                         │
│         Next.js Pages & Route Handlers (Orchestration Only)  │
│                                                             │
│  - No Prisma imports allowed                                │
│  - No business logic                                        │
│  - Calls features/**  and lib/fetchers, lib/actions        │
└──────────────────────────────────┬──────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
┌─────────▼──────────┐  ┌──────────▼─────────┐  ┌────────────▼──────┐
│  features/**       │  │  components/**     │  │  lib/**            │
│  Domain Logic &    │  │  Pure UI Components│  │  Business Logic    │
│  Orchestration     │  │  (no DB access,    │  │  (all DB access,   │
│                    │  │   no business      │  │   validation,       │
│  - Calls lib/*     │  │   logic)           │  │   auth hooks)      │
│  - Chains fetcher/ │  │                    │  │                    │
│    action calls    │  │  - Accept DTO      │  │  └─────┬────────┬──┘
│                    │  │    props           │  │        │        │
│  Example:          │  │  - Render UI only  │  │    ┌────▼─┐ ┌───▼──┐
│  CatalogBrowse     │  │                    │  │    │      │ │      │
│  → getCatalog()    │  │  Example:          │  │    │ DATA │ │ AUTH │
│  → renderWrapCard  │  │  WrapCard,         │  │    │      │ │      │
│                    │  │  WrapDetail        │  │    │      │ │      │
└────────────────────┘  └────────────────────┘  │    │ ACCESS   │
                                                 │    │      │ │      │
                                                 │    │      │ │      │
                                                 │    └──┬───┘ └──┬───┘
                                                 │       │        │
                                            ┌────┴───────┴───┐
                                            │  Prisma ORM    │
                                            │  Neon Postgres │
                                            └────────────────┘
```

## Data Flow Example: Create a Booking

```
1. User clicks "Book" on /visualizer
2. onClick handler calls action: createBooking(tenantId, wrapId, dateTime)
3. Action: createBooking (lib/actions/scheduling/create.ts)
   - Step 1: Auth - getSession()
   - Step 2: Authz - assertTenantMembership()
   - Step 3: Validate - createBookingSchema.parse()
   - Step 4: Mutate - prisma.booking.create()
   - Step 5: Audit - auditLog.create()
   - Step 6: Revalidate - revalidateTag('scheduling:bookings')
4. Action returns DTO (BookingConfirmationDTO, not raw Prisma)
5. Page revalidates via tag, shows confirmation
6. Side effect: triggers createInvoice(bookingId) in billing domain
```

## Naming Conventions at a Glance

| Category         | Pattern                            | Example                       |
| ---------------- | ---------------------------------- | ----------------------------- |
| DTOs             | `{Entity}DTO`                      | `WrapDTO`, `BookingDTO`       |
| Zod Schemas      | `{entity}Schema`                   | `wrapSchema`, `bookingSchema` |
| React Components | `PascalCase`                       | `WrapCard`, `BookingForm`     |
| Server Actions   | `camelCase`                        | `createBooking`, `updateWrap` |
| Fetchers         | `get{Plurals}`, `get{Entity}`      | `getWraps()`, `getBooking()`  |
| File Names       | Match primary export or `index.ts` | `wrap-card.tsx`, `create.ts`  |

See `.github/copilot/contracts/naming.yaml` for full reference.

## Common Tasks & Where to Find Guidance

| Task                   | Where to Look                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a new API endpoint | `.github/copilot/instructions/server-first.instructions.md` (lib/actions pattern) + `.github/copilot/instructions/authentication.instructions.md` |
| Create a new page      | `app/* structure` + `.github/copilot/instructions/server-first.instructions.md`                                                                   |
| Add a form             | `.github/copilot/instructions/server-first.instructions.md` (validation) + domain instruction (DTO shape)                                         |
| Add a new fetch        | `.github/copilot/instructions/server-first.instructions.md` (lib/fetchers pattern) + domain instruction (what data to fetch)                      |
| Add unit test          | See `vitest.config.ts` and test-shims/ for setup                                                                                                  |
| Add E2E test           | See `playwright.config.ts` and tests/playwright/ for examples                                                                                     |
| Deploy                 | See CI/CD workflows in `.github/workflows/`                                                                                                       |
| Debug 401 errors       | `.github/copilot/instructions/authentication.instructions.md` (session/auth/authz checklist)                                                      |
| Debug 403 errors       | `.github/copilot/contracts/domain-boundaries.yaml` (cross-domain violations)                                                                      |
| Debug stale cache      | `.github/copilot/instructions/server-first.instructions.md` (revalidateTag rules)                                                                 |

## References

- 📋 **Full Architecture**: [`server-first.instructions.md`](./.github/copilot/instructions/server-first.instructions.md)
- 📦 **Data Models**: `prisma/schema.prisma`
- 🔐 **Security**: [`authentication.instructions.md`](./.github/copilot/instructions/authentication.instructions.md)
- 🎨 **Component Library**: `components/ui/` (shadcn, Tailwind)
- 🛣️ **Routing**: `app/` structure follows Next.js App Router convention
- 🧪 **Testing**: `vitest.config.ts` for unit tests, `playwright.config.ts` for E2E
- 🚀 **Deployment**: `.github/workflows/` for CI/CD

## Quick Start for AI Pair Programming

When Copilot Chat asks for context:

1. **"What should I know about this repo?"** → Share `.github/copilot/README.md` and this file
2. **"What are the rules?"** → Share relevant domain instruction file + `.github/copilot/contracts/mutations.yaml`
3. **"Is this the right approach?"** → Share `.github/copilot/instructions/server-first.instructions.md` for pattern validation
4. **"What's the current status?"** → Share relevant `.github/copilot/json/` execution file

## Questions? Not in Docs?

Check the `.github/copilot/json/` files for open decisions and blockers. Likely your question is on the roadmap.
