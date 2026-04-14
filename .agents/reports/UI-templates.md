// Generic UI templates for CtrlPlus (Tailwind)
// Enforces: no card-inside-card, page bg-neutral-900, neutral dark system, blue primary accents.

```tsx
export const layoutTemplates = {
// Page shell
page: 'min-h-screen bg-neutral-900 text-neutral-100',
pageContainer: 'space-y-6',
section: 'border border-neutral-700 bg-neutral-950/80 px-6 py-7',
sectionCompact: 'border border-neutral-700 bg-neutral-950/80 px-6 py-6',
sectionMuted: 'border border-dashed border-neutral-700 bg-neutral-950/80 px-4 py-6',
}

export const cardTemplates = {
// Card primitives
base: 'border-neutral-700 bg-neutral-950/80 text-neutral-100',
strong: 'border-neutral-800 bg-neutral-950/80 text-neutral-100',
media: 'overflow-hidden border-neutral-700 bg-neutral-950/80 text-neutral-100',
mediaTop: 'border-b border-neutral-800 bg-neutral-900',
emptyState: 'border border-dashed border-neutral-700 bg-neutral-950/80 text-center',
}

export const imageTemplates = {
// Media blocks
hero: 'h-104 w-full object-cover',
placeholder: 'h-104 flex items-center justify-center text-sm text-neutral-500',
}

export const fieldTemplates = {
// Inputs
input:
'h-12 border border-neutral-800 bg-neutral-900 px-3 text-neutral-50 placeholder:text-neutral-500',
select: 'h-12 border border-neutral-800 bg-neutral-900 px-3 text-neutral-100',
textarea:
'min-h-28 border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-500',

// Text/labels
label: 'text-neutral-300',
helpText: 'text-xs text-neutral-500',
errorText: 'text-xs text-red-400',
}

export const buttonTemplates = {
// Primary action
primary:
'border-2 border-transparent bg-blue-600 px-6 py-3 text-base font-semibold text-neutral-100 shadow-lg transition-all hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg',

// Secondary action
secondary:
'h-12 border border-neutral-700 bg-neutral-900 px-4 text-neutral-100 transition-all duration-300 hover:border-blue-600 hover:bg-neutral-950',

// Utility
icon: 'h-10 w-10 border border-neutral-700 bg-neutral-900 text-neutral-100 transition-all hover:border-blue-600 hover:text-blue-600',
ghost: 'text-neutral-300 transition-all hover:bg-neutral-900 hover:text-neutral-100',
}

export const formTemplates = {
// Form shell
shell: 'border border-neutral-700 bg-neutral-950/80 px-6 py-7',
stack: 'space-y-4',

// Catalog-style filter grid
filterGrid:
'grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_repeat(2,minmax(0,0.9fr))] lg:items-start',

// Footer row under filters
footerRow:
'flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between',
footerStatus: 'text-xs uppercase tracking-[0.18em] text-neutral-500',
}

export const tableTemplates = {
shell: 'overflow-hidden border border-neutral-800 bg-neutral-950/80',
toolbar: 'border border-neutral-700 bg-neutral-950/80 px-4 py-3 text-neutral-100',
}

export const metricTemplates = {
grid: 'grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 xl:grid-cols-4',
iconWrap:
'flex h-11 w-11 items-center justify-center border border-blue-600 bg-neutral-900 text-blue-600',
label: 'text-xs uppercase tracking-[0.18em] text-neutral-100',
value: 'text-3xl font-black tracking-tight text-neutral-100',
description: 'text-sm text-neutral-100',
}

export const stateTemplates = {
loadingSkeleton: 'rounded-none border border-neutral-700 bg-neutral-950/80',
emptyTitle: 'text-xl font-bold text-neutral-100',
emptyDescription: 'max-w-md text-sm text-neutral-100',
emptyEyebrow: 'text-xs font-semibold uppercase tracking-[0.24em] text-blue-600',
}

export const navTemplates = {
topBar: 'sticky top-0 z-30 border-b border-neutral-700 bg-neutral-950/80 backdrop-blur-md',
sideBar:
'border-r border-neutral-700 bg-neutral-950/90 text-neutral-100 supports-backdrop-filter:bg-neutral-950/80 backdrop-blur',
}
```

// UI component layering guidelines
// for consistency and maintainability

### 1) Shadcn primitive layer (already in `components/ui/*`)

Use existing primitives only (`Button`, `Card`, `Input`, `Select`, etc.) and keep styling tokenized.

```tsx
// components/ui stays primitive and generic (no domain logic)
<Button variant="default" className={buttonTemplates.primary}>Create</Button>
<Card className={cardTemplates.base}>...</Card>
<input className={fieldTemplates.input} />
```

---

### 2) Pure UI component layer (domain presentational only)

No fetching, no auth checks, no router writes, no server actions.
Only props in / events out.

```tsx
// components/{domain}/{domain}-filters-panel.tsx
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

type Filters = {
  query: string
  status: string
}

interface DomainFiltersPanelProps {
  value: Filters
  isPending?: boolean
  hasActiveFilters: boolean
  onChange: (next: Filters) => void
  onReset: () => void
}

export function DomainFiltersPanel({
  value,
  isPending,
  hasActiveFilters,
  onChange,
  onReset,
}: DomainFiltersPanelProps) {
  return (
    <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_repeat(2,minmax(0,0.9fr))] lg:items-start">
          <Field>
            <FieldLabel htmlFor="domain-search" className="text-neutral-300">
              Search
            </FieldLabel>
            <input
              id="domain-search"
              type="search"
              value={value.query}
              onChange={(e) => onChange({ ...value, query: e.target.value })}
              className="h-12 border border-neutral-800 bg-neutral-900 px-3 text-neutral-50 placeholder:text-neutral-500"
              placeholder="Search..."
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="domain-status" className="text-neutral-300">
              Status
            </FieldLabel>
            <select
              id="domain-status"
              value={value.status}
              onChange={(e) => onChange({ ...value, status: e.target.value })}
              className="h-12 border border-neutral-800 bg-neutral-900 px-3 text-neutral-100"
              disabled={isPending}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </FieldGroup>

        <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            {isPending ? 'Refreshing results' : 'Filters sync with URL and server search.'}
          </div>

          {hasActiveFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={isPending}>
              Clear Filters
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
```

---

### 3) Feature component layer (server orchestration + capability checks)

This is where parsing, authz checks, fetchers/actions wiring, Suspense boundaries happen.

```tsx
// features/{domain}/{domain}-dashboard-page-feature.tsx
import Link from 'next/link'
import { Suspense } from 'react'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import type { SearchParamRecord } from '@/types/common.types'
// import parse/search utils + filters/stats/table sections

interface DomainDashboardPageFeatureProps {
  searchParams?: Promise<SearchParamRecord>
}

export async function DomainDashboardPageFeature({ searchParams }: DomainDashboardPageFeatureProps) {
  const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
  // const { filters } = parseDomainSearchParams(resolvedParams)

  return (
    <div className="space-y-6">
      {/* 1) Header */}
      <WorkspacePageIntro
        label="Domain"
        title="Domain"
        description="Short operational context."
      />

      {/* 2) Actions */}
      <WorkspacePageContextCard>
        <Button asChild>
          <Link href="/domain/manage">Primary Action</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/domain/secondary">Secondary Action</Link>
        </Button>
      </WorkspacePageContextCard>

      {/* 3) Filters */}
      {/* <DomainFiltersClient /> */}

      {/* 4) Content */}
      <Suspense fallback={<div className="border border-neutral-700 bg-neutral-950/80 px-6 py-7 text-neutral-400">Loading…</div>}>
        {/* <DomainTableSection filters={filters} /> */}
      </Suspense>
    </div>
  )
}
```

---

### 4) App page layer (route entry only)

Keep `app/**` orchestration-only (no direct Prisma, no business logic).

```tsx
// app/(tenant)/domain/page.tsx
import { DomainDashboardPageFeature } from '@/features/domain/domain-dashboard-page-feature'
import type { SearchParamRecord } from '@/types/common.types'

export default async function DomainPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamRecord>
}) {
  return <DomainDashboardPageFeature searchParams={searchParams} />
}
```

---
