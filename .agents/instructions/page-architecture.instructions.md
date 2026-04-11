---
description: Instructions for building new dashboard pages following CtrlPlus standards
applyTo: 'features/**/*-page-feature.tsx, features/**/*-dashboard-page-feature.tsx'
---

# Building Dashboard Pages — CtrlPlus Instructions

## Overview

This file instructs Copilot on how to build new dashboard pages for CtrlPlus that conform to project governance, architecture, and component standards.

**Reference for governance**: `.agents/docs/page-patterns.md`

## Principles

1. **Use Standard Components**: `WorkspacePageIntro`, `WorkspacePageContextCard`, `WorkspaceMetricCard`, `WorkspaceEmptyState`
2. **No Custom Wrappers**: Replace inheritance hierarchies with direct component usage
3. **Server-First Approach**: All data fetching and capability checks happen in Server Components
4. **Client-Side Interactivity**: Keep Client Components thin, focused on state and event handling
5. **Consistent Spacing**: Major sections use `space-y-6`, internal groups use `space-y-4`
6. **Auth/Authz at Server Boundary**: Capability checks before rendering sensitive sections

## File Organization

Every dashboard requires these files (optional marked):

```
features/{domain}/
├── {domain}-dashboard-page-feature.tsx      # Main orchestrator (async)
├── {domain}-dashboard-parts.tsx             # Server components (stats, table)
├── {domain}-dashboard-filters.client.tsx    # Client: filter state & onChange
├── {domain}-dashboard-table.client.tsx      # Client: table interactivity
├── {domain}-dashboard-header.tsx            # (Optional) Custom header wrapper
├── {domain}-dashboard-toolbar.tsx           # (Optional) Custom filter container
├── {domain}-skeletons.tsx                   # Suspense fallback loading states
└── index.ts                                 # (Optional) Public exports
```

### File Roles

- **`*-page-feature.tsx`** — Async root component. Orchestrates all parts. Handles search params, async data fetching.
- **`*-dashboard-parts.tsx`** — Pure Server Components. Stats section, table section. Includes capability checks.
- **`*-filters.client.tsx`** — Client Component. Manages filter state, onChange handlers, search input updates.
- **`*-table.client.tsx`** — Client Component. Pagination, sorting, row selection, inline actions.
- **`*-skeletons.tsx`** — UI shells for Suspense fallbacks. Matches card/table layout with neutral placeholder content.

## Step-by-Step Build Process

### 1. Create Page Feature (Root Orchestrator)

**File**: `features/{domain}/{domain}-dashboard-page-feature.tsx`

```tsx
import Link from 'next/link'
import { Suspense } from 'react'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { parse{Domain}SearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { {Domain}DashboardFiltersClient } from './{domain}-dashboard-filters.client'
import { {Domain}DashboardStatsSection, {Domain}DashboardTableSection } from './{domain}-dashboard-parts'
import { {Domain}TableSkeleton, {Domain}StatsSkeleton } from './{domain}-skeletons'

interface {Domain}DashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function {Domain}DashboardPageFeature({
    searchParams,
}: {Domain}DashboardPageFeatureProps) {
    // Parse URL search params to extract filters
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parse{Domain}SearchParams(resolvedParams)

    return (
        <div className="space-y-6">
            {/* 1. Header */}
            <WorkspacePageIntro
                label="{Domain Label}"
                title="{Page Title}"
                description="{Brief explanation of the page's purpose and user benefits}"
            />

            {/* 2. Actions Card */}
            <WorkspacePageContextCard
                title="Quick Actions"
                description="(Optional description)"
            >
                <Button asChild>
                    <Link href="/{domain}/manage/new">Create {Entity}</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/{domain}/manage">Manage {Entity}s</Link>
                </Button>
            </WorkspacePageContextCard>

            {/* 3. KPI Stats */}
            <Suspense fallback={<{Domain}StatsSkeleton />}>
                <{Domain}DashboardStatsSection filters={filters} />
            </Suspense>

            {/* 4. Filters */}
            <{Domain}DashboardFiltersClient />

            {/* 5. Results */}
            <Suspense fallback={<{Domain}TableSkeleton />}>
                <{Domain}DashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
```

**Key Points**:

- Use `Suspense` boundaries with skeleton fallbacks for all async sections
- Pass filters down to async parts
- Never import Client Components for direct rendering (use `<Component.client.tsx` naming to distinguish)

### 2. Create Dashboard Parts (Server Components)

**File**: `features/{domain}/{domain}-dashboard-parts.tsx`

```tsx
import { cache } from 'react'

import { {Domain}DashboardStats } from '@/components/{domain}/{domain}-dashboard-stats'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { get{Domain}Data } from '@/lib/fetchers/{domain}.fetchers'
import type { {Domain}ListParams } from '@/types/{domain}.types'

import { {Domain}DashboardTableClient } from './{domain}-dashboard-table.client'

// Memoize data fetching to prevent duplicate calls
const get{Domain}ForDashboard = cache(async (filters: {Domain}ListParams) =>
    get{Domain}Data(filters)
)

// Stats Section — Capability Gated
export async function {Domain}DashboardStatsSection({
    filters,
}: {
    filters: {Domain}ListParams
}) {
    // Check capability server-side
    const session = await getSession()
    const canViewStats = hasCapability(session.authz, '{domain}.read.all')

    // Return null if unauthorized (section not rendered)
    if (!canViewStats) {
        return null
    }

    // Fetch data
    const data = await get{Domain}ForDashboard(filters)

    // Transform data for metrics
    const stat1 = data.items.length
    const stat2 = data.items.filter(item => item.someCondition).length
    const stat3 = data.items.filter(item => item.anotherCondition).length

    // Render stats
    return (
        <{Domain}DashboardStats
            stat1={stat1}
            stat2={stat2}
            stat3={stat3}
            total={data.total}
        />
    )
}

// Table Section — Not capability gated (shows accessible rows)
export async function {Domain}DashboardTableSection({
    filters,
}: {
    filters: {Domain}ListParams
}) {
    const rows = await get{Domain}ForDashboard(filters)

    // Optional: Return empty state
    if (rows.items.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No {Entity}s"
                description="Create your first {entity} to get started."
                action={
                    <Button asChild>
                        <Link href="/{domain}/manage/new">Create {Entity}</Link>
                    </Button>
                }
            />
        )
    }

    return <{Domain}DashboardTableClient rows={rows.items} total={rows.total} />
}
```

**Key Points**:

- Use `cache()` wrapper to memoize fetcher calls (prevents duplicate DB queries)
- Stats section checks `hasCapability()` and returns `null` if unauthorized
- Table section doesn't gate capability — shows only accessible rows (auth happens at fetcher level)
- Use simple derived variables for metric calculations

### 3. Create Filter Component (Client)

**File**: `features/{domain}/{domain}-dashboard-filters.client.tsx`

```tsx
'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export function {Domain}DashboardFiltersClient() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')

    // Update URL params and refetch
    const handleFilterChange = useCallback(() => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (category !== 'all') params.set('category', category)

        router.push(`?${params.toString()}`)
    }, [search, category, router])

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 sm:gap-6 border border-neutral-700 bg-neutral-950/80 px-6 py-6">
            <Input
                placeholder="Search {entity}..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onBlur={handleFilterChange}
            />
            <Select value={category} onValueChange={v => setCategory(v)}>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                {/* Add more options */}
            </Select>
        </div>
    )
}
```

**Key Points**:

- Use `useRouter()` to update URL params (enables browser back button)
- Debounce input changes or use onBlur to avoid excessive refetches
- Keep styling consistent with dashboard cards

### 4. Create Table Component (Client)

**File**: `features/{domain}/{domain}-dashboard-table.client.tsx`

```tsx
'use client'

import { useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { {Domain}Row } from '@/types/{domain}.types'

interface {Domain}DashboardTableClientProps {
    rows: {Domain}Row[]
    total: number
}

export function {Domain}DashboardTableClient({
    rows,
    total,
}: {Domain}DashboardTableClientProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{formatDate(row.createdAt)}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/{domain}/manage/${row.id}`}>View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Optional: Pagination */}
        </div>
    )
}
```

**Key Points**:

- Keep Client Components focused on interactivity (expand/collapse, sorting, pagination)
- Use `'use client'` directive at top
- Pass all data as props from Server Components

### 5. Create Skeleton Components

**File**: `features/{domain}/{domain}-skeletons.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function {Domain}StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
            ))}
        </div>
    )
}

export function {Domain}TableSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
            ))}
        </div>
    )
}
```

**Key Points**:

- Match the visual layout of actual components (grid, rows)
- Use approximate heights that match real content

### 6. Create Stats Component

**File**: `components/{domain}/{domain}-dashboard-stats.tsx`

```tsx
import { WorkspaceMetricCard } from '@/components/shared/tenant-elements'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'

interface {Domain}DashboardStatsProps {
    stat1: number
    stat2: number
    stat3: number
    total: number
}

export function {Domain}DashboardStats({
    stat1,
    stat2,
    stat3,
    total,
}: {Domain}DashboardStatsProps) {
    const percentage = Math.round((stat1 / total) * 100)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <WorkspaceMetricCard
                label="Total {Entity}s"
                value={total}
                icon={CalendarIcon}
            />
            <WorkspaceMetricCard
                label="Stat 1 Label"
                value={stat1}
                badge={`${percentage}% of total`}
            />
            <WorkspaceMetricCard
                label="Stat 2 Label"
                value={stat2}
                description="Description or change indicator"
                icon={CheckIcon}
            />
            <WorkspaceMetricCard
                label="Stat 3 Label"
                value={stat3}
                description="Pending action"
            />
        </div>
    )
}
```

**Key Points**:

- Props are simple, derived metrics (calculations done in parts.tsx)
- Use icons from lucide-react for visual interest
- Use optional badge, description, icon props

## Checklist for New Pages

- [ ] Files created in `features/{domain}/` with correct naming (`*-page-feature.tsx`, `*-parts.tsx`, `*-filters.client.tsx`, etc.)
- [ ] Page orchestrator imports and uses `WorkspacePageIntro`, `WorkspacePageContextCard`
- [ ] Stats component uses `WorkspaceMetricCard` grid (1 col mobile, 2 col tablet, 4 col desktop)
- [ ] Stats section has capability check: `hasCapability(session.authz, '{domain}.read.all')`
- [ ] Stats section returns `null` if unauthorized (not rendered)
- [ ] Page uses `Suspense` boundaries with skeleton fallbacks for async sections
- [ ] Page uses `space-y-6` for major section spacing
- [ ] Empty state uses `WorkspaceEmptyState` component
- [ ] All data fetching in Server Components (no fetching in Client Components)
- [ ] Filters use Client Component for state management
- [ ] All buttons follow button style patterns: primary (solid) + outline (secondary)
- [ ] No custom header wrappers — use `WorkspacePageIntro` directly
- [ ] No custom stat card wrappers — use `WorkspaceMetricCard` directly
- [ ] No custom empty state wrappers — use `WorkspaceEmptyState` directly
- [ ] TypeScript types defined in `types/{domain}.types.ts`
- [ ] Zod schemas defined in `schemas/{domain}.schemas.ts`
- [ ] Features exported from `features/{domain}/index.ts`
- [ ] Page tested on mobile (375px), tablet (768px), desktop (1024px)
- [ ] All text meets WCAG AA contrast ratio
- [ ] Page builds without TypeScript errors (`pnpm typecheck`)
- [ ] Page lints without warnings (`pnpm lint`)

## Anti-Patterns (Don't Do These)

❌ Create custom header components that wrap `WorkspacePageIntro`

```tsx
// Wrong
function MyPageHeader() {
    return <WorkspacePageIntro label="..." title="..." description="..." />
}
```

❌ Fetch data in Client Components

```tsx
// Wrong
'use client'
export function MyDashboard() {
    const [data, setData] = useState(null)
    useEffect(() => {
        fetch('/api/data').then(res => res.json()).then(setData)
    }, [])
}
```

❌ Hardcode styles in components

```tsx
// Wrong
<div style={{ padding: '24px', backgroundColor: '#0a0a0a' }}>
```

❌ Client-side capability checks

```tsx
// Wrong
if (useAuth().hasCapability('billing.read.all')) {
    return <Stats />
}
```

❌ Multiple stat card component formats

```tsx
// Wrong
<BillingStatCard /> vs <SchedulingStatCard /> vs <StatCard />
// Use WorkspaceMetricCard for all
```

## Reference Pages

- **Scheduling**: `features/scheduling/scheduling-dashboard-page-feature.tsx`
- **Billing**: `features/billing/invoices-dashboard-page-feature.tsx`
- **Settings**: `features/settings/unified-settings-page-feature.tsx` (different pattern, but uses core components)
- **Visualizer**: `features/visualizer/visualizer-hf-page-feature.tsx`

Study these pages for patterns and conventions.
