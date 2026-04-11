---
description: CtrlPlus repository agent instructions
applyTo: '**/*'
---

## Project intent

CtrlPlus is a single-store, tenant-scoped operations platform built on Next.js App
Router, Clerk auth, Prisma + Neon Postgres, Stripe billing, scheduling, wrap catalog,
and visualizer previews.

## Non-negotiable architecture rules

- Treat `app/**` as orchestration only.
- Do not import Prisma directly in `app/**` or React components.
- All reads go through `lib/fetchers/**`.
- All writes go through `lib/actions/**`.
- Keep auth, authz, ownership, and capability checks server-side.
- Validate mutation input with Zod/runtime schemas.
- Prefer Server Components; use Client Components only where needed.
- Reuse `components/ui/**` primitives.

## Canonical governance source

Use `.agents` as the source of truth.

- `.agents/docs` = intent layer
- `.agents/instructions` = interpretation layer
- `.agents/contracts` = execution layer
- `.agents/json` = reporting layer
- `.agents/prompts` = accountability layer

### Precedence

`contracts > instructions > docs > prompts` (json is reporting only).

## Frontend Design & UI Governance

The frontend is optimized for **mobile-first responsive design** using Tailwind CSS and shadcn/ui primitives.
All styling, component, and animation rules are documented in `.agents/docs/design.md` and enforced via `.agents/contracts/ui-component-governance.contract.yaml`.

### Key Frontend Principles

- **Mobile-First**: Optimize for small screens first, progressively enhance for larger viewports
- **Semantic Simplicity**: Use shadcn/ui primitives exclusively; no custom UI components
- **Color System**: Strict palette (blue-600 primary, neutral-700 borders, neutral-900 bg, neutral-100 text)
- **Typography Scaling**: All font sizes responsive across breakpoints (mobile-first pattern)
- **Button Template**: All buttons follow Header Button Template (primary = blue bg with border-invert hover, secondary = outline variant)
- **Spacing System**: 4px increments with breakpoint scaling (px-4 sm:px-6 lg:px-8, etc.)
- **Animations**: Tailwind-only (fade-in, slide-in-up, transition-all)
- **No Rounded Corners**: All components use `--radius: 0` for sharp edges

### Design & Component References

- **Intent & Patterns**: `.agents/docs/design.md` (color system, typography scale, spacing, responsive grids, button styles, accessibility)
- **Execution Rules**: `.agents/contracts/ui-component-governance.contract.yaml` (component usage, button anatomy, color constraints, violations)
- **Example Implementation**: `app/page.tsx` (hero, features grid, pricing cards, animations)
- **Shared Components**: `components/shared/site-header.tsx`, `components/shared/site-footer.tsx` (responsive mobile-first header/footer)

## Domain boundaries

Active domains:

- admin
- auth/authz
- billing
- catalog
- platform
- scheduling
- settings
- visualizer

Catalog owns wrap and asset semantics. Visualizer owns preview lifecycle.

- Catalog wrap imagery production storage is Cloudinary-backed; local `/uploads/wraps/**`
  paths are legacy remediation-only and must not be used for live catalog assets.

## Security and quality expectations

- Never trust client-provided role/ownership/scope.
- Enforce auth/authz in server actions and route handlers.
- Verify Stripe webhooks and use replay-safe/idempotent processing.
- Keep sensitive operations auditable.

Required quality gates when affected:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm build`
- `pnpm test`
- `pnpm test:e2e --project=chromium --reporter=line`

### Dead-code prevention policy

- Every new module must be imported by at least one route, feature, action, fetcher, or test in the same PR.
- Prefer local (non-exported) helpers unless external reuse is required.
- Do not create parallel abstractions in both `components/{domain}` and `features/{domain}` unless each has documented ownership.
- For alias migrations, keep one canonical export name and remove redundant aliases within one release cycle.
- **Dashboard Pages**: Must use standardized Workspace component templates (`WorkspacePageIntro`, `WorkspacePageContextCard`, `WorkspaceMetricCard`, `WorkspaceEmptyState`).
    - Custom header wrappers are prohibited; use `WorkspacePageIntro` directly.
    - Filter sections MUST follow grid layout pattern — never custom wrappers.
    - KPI/stat cards MUST use `WorkspaceMetricCard` component.
    - Empty states MUST use `WorkspaceEmptyState` component.

### CI enforcement

- Run `knip --no-progress` in CI and fail on newly introduced unused files/exports.
- Run `tsc --noEmit --noUnusedLocals --noUnusedParameters` in CI profile.
- Keep a reviewed ignore list (`knip.json`) for framework-convention exports (Next.js route entrypoints).

### Layer integrity

- `lib/actions/*` owns writes and orchestration.
- `lib/fetchers/*` owns reads.
- `lib/db/transactions/*` must be either actively consumed by actions or removed.

### Audit artifact freshness protocol

- Treat `.agents/reports/*.txt` and `.agents/reports/CODEBASE_AUDIT_REPORT.md` as snapshots that can become stale.
- Before acting on dead-code findings, regenerate artifacts using current runs:
    - `pnpm knip --no-progress` (write to `knip.out.txt`, then copy to `.agents/reports/knip.txt`)
    - `pnpm exec ts-prune` (write to `.agents/reports/ts-prune.txt`)
    - `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` (write to `.agents/reports/tsc-unused.txt`)
    - `pnpm exec eslint . --cache --max-warnings=0` (write to `.agents/reports/eslint-unused-vars.txt`)
- If `knip.out.txt` and `.agents/reports/knip.txt` differ, treat `knip.out.txt` as the source of truth until reports are refreshed.

## Dashboard Page Patterns

All dashboard pages (Scheduling, Billing, Visualizer, Settings, etc.) follow a standardized structure for consistency, maintainability, and user experience.

### Page Structure

Dashboard pages follow this composition pattern (**required order**):

1. **Header Section** — `WorkspacePageIntro` component
    - Label (domain name, e.g., "Scheduling", "Billing")
    - Title (page title)
    - Description (brief context)

2. **Actions/Context Card** — `WorkspacePageContextCard` component
    - Title and description (optional, context about the section)
    - Action buttons (primary + secondary)
    - Flex layout: labels on left, actions right-aligned on desktop

3. **KPI Stats Section** — Grid of `WorkspaceMetricCard` components
    - Each metric shows: label, value, optional description, optional icon, optional badge
    - All stats MUST be gated by capability checks (e.g., `scheduling.read.all`)
    - Use `Suspense` boundaries with skeleton UI for async loading
    - If user lacks capability, section returns `null` (not rendered)

4. **Filters/Navigation Section** — Custom grid layout (not wrapped in `WorkspacePageContextCard`)
    - Search input, category filters, sort options in horizontal grid
    - Pattern: `grid grid-cols-1 md:grid-cols-auto gap-4`
    - Use consistent spacing: `space-y-6` between major sections

5. **Results Section** — Table, list, or grid of items
    - Use appropriate collection component (Table, List, Grid)
    - Use `Suspense` boundaries with skeleton UI for async loading
    - Handle empty states with `WorkspaceEmptyState` component

6. **Spacing Between Sections**
    - Major sections: `space-y-6` (24px Tailwind spacing)
    - Within a section group: `space-y-4` (16px Tailwind spacing)
    - Page container: `div className="space-y-6"`

### Reference Implementations

- **Scheduling Dashboard**: `features/scheduling/scheduling-dashboard-page-feature.tsx`
- **Billing Dashboard**: `features/billing/invoices-dashboard-page-feature.tsx`
- **Settings Page**: `features/settings/unified-settings-page-feature.tsx`
- **Visualizer**: `features/visualizer/visualizer-hf-page-feature.tsx`

### Example: Dashboard Page Template

```tsx
// features/{domain}/{domain}-dashboard-page-feature.tsx
export async function [{Domain}DashboardPageFeature]({ searchParams }: { searchParams?: Promise<SearchParamRecord> }) {
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parse[Domain]SearchParams(resolvedParams)

    return (
        <div className="space-y-6">
            {/* 1. Header */}
            <WorkspacePageIntro
                label="[Domain Label]"
                title="[Page Title]"
                description="[Brief context]"
            />

            {/* 2. Actions Card */}
            <WorkspacePageContextCard
                title="[Optional Context Title]"
                description="[Optional Description]"
            >
                <Button asChild>
                    <Link href="/path">Primary Action</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/path">Secondary Action</Link>
                </Button>
            </WorkspacePageContextCard>

            {/* 3. KPI Stats */}
            <Suspense fallback={<[Domain]StatsSkeleton />}>
                <[Domain]StatsSection filters={filters} />
            </Suspense>

            {/* 4. Filters */}
            <[Domain]FiltersClient />

            {/* 5. Results */}
            <Suspense fallback={<[Domain]TableSkeleton />}>
                <[Domain]TableSection filters={filters} />
            </Suspense>
        </div>
    )
}
```

## Component Governance: Approved Page Components

The following components MUST be used for dashboard page construction. Using custom wrappers or alternative patterns is prohibited.

### Component Definitions

| Component                  | Location                                | Purpose               | Required Parts                                          |
| -------------------------- | --------------------------------------- | --------------------- | ------------------------------------------------------- |
| `WorkspacePageIntro`       | `components/shared/tenant-elements.tsx` | Page header section   | label, title, description                               |
| `WorkspacePageContextCard` | `components/shared/tenant-elements.tsx` | Actions/context panel | (optional title/description), children (action buttons) |
| `WorkspaceMetricCard`      | `components/shared/tenant-elements.tsx` | KPI stat display      | label, value, optional (description, icon, badge)       |
| `WorkspaceEmptyState`      | `components/shared/tenant-elements.tsx` | No-data state         | title, description, optional (action)                   |

### Styling Constraints

- **Borders**: `border-neutral-700` (strict)
- **Background**: `bg-neutral-950/80` (strict)
- **Text Primary**: `text-neutral-100`
- **Text Secondary**: `text-neutral-400`
- **Accent/Icon**: `bg-blue-600` or `text-blue-600`
- **Spacing in grid**: `gap-4 sm:gap-6 lg:gap-8`

### No Custom Headers Allowed

❌ **Prohibited pattern**:

```tsx
// DON'T do this
function CatalogPageHeader() { /* custom wrapper */ }
export function CatalogDashboard() {
    return (
        <div>
            <CatalogPageHeader />  // ← WRONG
        </div>
    )
}
```

✅ **Approved pattern**:

```tsx
// DO this
export function CatalogDashboard() {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro label="Catalog" title="..." description="..." />
            {/* rest of page */}
        </div>
    )
}
```

## Auth/Authz Enforcement & Patterns

### Capability-Based Access Control

All statistics, sensitive sections, and restricted features MUST be gated by capability checks.

#### Capability Naming Convention

Capabilities follow the pattern: `{domain}.{operation}.{scope}`

- **Domain**: `billing`, `scheduling`, `catalog`, `visualizer`, `settings`, `admin`, `platform`
- **Operation**: `read` (query, view) or `write` (create, update, delete, refund, archive)
- **Scope**: `all` (full domain access), or specific (e.g., `customer:owned`)

**Common Capabilities**:

- `billing.read.all` — View all invoices, stats, customer data
- `billing.write.all` — Create invoices, refunds, adjustments
- `scheduling.read.all` — View all bookings, stats
- `scheduling.write.all` — Create/update/cancel bookings
- `catalog.read.all` — View all wraps, assets, templates
- `catalog.write.all` — Create/edit/delete wraps, upload assets
- `visualizer.read.all` — View all preview sessions
- `visualizer.write.all` — Create previews, snapshots
- `platform.write` — Admin-only: user management, role changes, system config
- `admin.write` — Platform admin actions: moderation, audit, system monitoring

#### Server-Side Capability Checks

All auth/authz checks MUST happen server-side in Server Components or Route Handlers. Never trust client input for capability validation.

```tsx
// ✅ Correct: Check in Server Component before rendering
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

export async function SchedulingDashboardStatsSection() {
    const session = await getSession()
    const canViewStats = hasCapability(session.authz, 'scheduling.read.all')

    if (!canViewStats) {
        return null  // Section not rendered
    }

    const stats = await fetchStats()
    return <StatsDisplay stats={stats} />
}

// ❌ Wrong: Client-side capability check (can be bypassed)
export function StatsDisplay() {
    const { authz } = useAuth()  // ← AVOID THIS
    if (!hasCapability(authz, 'scheduling.read.all')) {
        return null
    }
    // ...
}
```

#### Stat Card Capability Gating

Each major stat card section MUST return `null` if the user lacks the required capability. Use this pattern:

```tsx
export async function [Domain]StatsSection() {
    const session = await getSession()
    const canView = hasCapability(session.authz, '{domain}.read.all')

    if (!canView) {
        return null  // Not rendered, no "access denied" message needed
    }

    const data = await fetchData()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <WorkspaceMetricCard label="Metric 1" value={data.value1} />
            <WorkspaceMetricCard label="Metric 2" value={data.value2} />
        </div>
    )
}
```

#### Sensitive Routes Require Capability Checks

Pages that perform restricted operations MUST check auth before rendering:

```tsx
// app/(tenant)/billing/[invoiceId]/refund/page.tsx
import { hasCapability } from '@/lib/authz/policy'

export default async function InvoiceRefundPage() {
    const session = await getSession()

    if (!hasCapability(session.authz, 'billing.write.all')) {
        redirect('/billing')  // Unauthorized
    }

    // Safe to render restricted UI
    return <RefundForm />
}
```

### Security Checklist for New Pages

- [ ] All sensitive data reads are gated by capability checks
- [ ] Capability checks happen in Server Components (not Client Components)
- [ ] Stat cards return `null` if user lacks capability (no content visible)
- [ ] Sensitive form pages check auth before rendering
- [ ] All mutations validate authz in the server action (`lib/actions/*`)
- [ ] No sensitive data is passed to Client Components unless necessary
- [ ] Admin-only features check `platform.write` or `admin.write` capability

## Operating workflow

1. Read relevant `.agents/docs/*` for intent.
2. Apply `.agents/instructions/*` for interpretation.
3. Enforce `.agents/contracts/*` rules.
4. Use `.agents/prompts/*` for execution framing.
5. Update `.agents/json/*` with tasks, decisions, progress, blockers, actions, edits,
   errors, and fixes.

## Synchronization requirement

`AGENTS.md` and `.github/copilot-instructions.md` must always contain the same content.
