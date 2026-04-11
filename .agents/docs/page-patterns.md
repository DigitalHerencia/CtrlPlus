# Dashboard Page Patterns & Architecture

## Intent

Standardized dashboard page patterns for consistent user experience, maintainability, and rapid development. All tenant workspace pages follow this architecture.

## Architecture Overview

Every dashboard page follows a **six-layer composition**:

```
┌─────────────────────────────────────────┐
│ 1. Header Section (WorkspacePageIntro)  │
├─────────────────────────────────────────┤
│ 2. Actions Card (WorkspacePageContextCard)
├─────────────────────────────────────────┤
│ 3. KPI Stats Grid (WorkspaceMetricCard) │
│    (Gated by capability checks)         │
├─────────────────────────────────────────┤
│ 4. Filters Section (Custom grid layout) │
├─────────────────────────────────────────┤
│ 5. Results Section (Table/List/Grid)    │
├─────────────────────────────────────────┤
│ 6. Empty State (WorkspaceEmptyState)    │
└─────────────────────────────────────────┘
```

### Spacing Layer

```tsx
<div className="space-y-6">  {/* Major sections: 24px */}
    <Section1 />

    <div className="space-y-4">  {/* Internal group: 16px */}
        <Subsection1 />
        <Subsection2 />
    </div>
</div>
```

## Component Layer Breakdown

### 1. Header Section — `WorkspacePageIntro`

**Purpose**: Introduce the domain and page context.

**Props**:

- `label` (string): Domain name (e.g., "Scheduling", "Billing")
- `title` (string): Page title
- `description` (string): Brief explanation of the page's purpose
- `className?` (string): Additional CSS classes

**Styling**:

- Border: `border border-neutral-700`
- Background: `bg-neutral-950/80`
- Padding: `px-6 py-7`
- Label: Uppercase, `text-xs font-semibold uppercase tracking-[0.24em] text-blue-600`
- Title: `text-3xl sm:text-4xl font-black tracking-tight text-neutral-100`
- Description: `text-sm sm:text-base text-neutral-100`

**Example**:

```tsx
<WorkspacePageIntro
    label="Scheduling"
    title="Installation Scheduling"
    description="Keep your wrap install calendar tight, predictable, and customer-friendly from booking to bay handoff."
/>
```

### 2. Actions/Context Card — `WorkspacePageContextCard`

**Purpose**: Present domain-specific actions and context information.

**Props**:

- `title?` (string): Left-side label
- `description?` (string): Left-side supporting text
- `children` (ReactNode): Action buttons and controls (right-aligned on desktop)
- `className?` (string): Additional CSS classes

**Layout**:

- Desktop: Two-column flex (labels left, actions right)
- Mobile: Stacked, full-width actions
- Responsive breakpoint: `lg:flex-row` on desktop, column on mobile

**Styling**:

- Border: `border border-neutral-700`
- Background: `bg-neutral-950/80`
- Padding: `px-6 py-6`
- Gap between left/right: `gap-4`
- Action buttons gap: `gap-3`

**Example**:

```tsx
<WorkspacePageContextCard
    title="Scheduling Actions"
    description="Jump between operator and booking workflows"
>
    <Button asChild>
        <Link href="/scheduling/manage/new">Create Booking</Link>
    </Button>
    <Button asChild variant="outline">
        <Link href="/scheduling/manage">Manage Bookings</Link>
    </Button>
</WorkspacePageContextCard>
```

### 3. KPI Stats Section — `WorkspaceMetricCard` Grid

**Purpose**: Display key performance indicators with capability-based visibility.

**Props per card**:

- `label` (string): KPI name (e.g., "Total Bookings")
- `value` (ReactNode): Main metric (number, percentage, status)
- `description?` (ReactNode): Supporting detail or change indicator
- `icon?` (LucideIcon): Right-side icon (optional)
- `badge?` (string): Status badge (optional)
- `className?` (string): Additional CSS classes

**Grid Layout**:

- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 4 columns (or 3, depending on screen size)
- Responsive: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8`

**Styling**:

- Card border: `border-neutral-700`
- Card background: `bg-neutral-950/80`
- Label: `text-xs uppercase tracking-[0.18em] text-neutral-100`
- Value: `text-3xl font-black tracking-tight text-neutral-100`
- Icon background: `border border-blue-600 bg-neutral-900`
- Icon color: `text-blue-600`

**Capability Gating**:

- Stats sections return `null` if user lacks `{domain}.read.all` capability
- No "Access Denied" message — section simply doesn't render
- Example: `scheduling.read.all`, `billing.read.all`, `catalog.read.all`

**Example**:

```tsx
export async function SchedulingDashboardStatsSection({ filters }: { filters: BookingListParams }) {
    const session = await getSession()
    const canViewStats = hasCapability(session.authz, 'scheduling.read.all')

    if (!canViewStats) {
        return null  // Not rendered
    }

    const bookings = await getBookingsForDashboard(filters)
    const pending = bookings.items.filter(item => item.status === 'requested').length
    const confirmed = bookings.items.filter(item => item.status === 'confirmed').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <WorkspaceMetricCard
                label="Total Bookings"
                value={bookings.total}
                icon={CalendarIcon}
            />
            <WorkspaceMetricCard
                label="Pending Requests"
                value={pending}
                badge={pending > 0 ? "Action Needed" : "All Set"}
            />
            <WorkspaceMetricCard
                label="Confirmed"
                value={confirmed}
                description={`${((confirmed / bookings.total) * 100).toFixed(0)}% of total`}
            />
        </div>
    )
}
```

### 4. Filters Section — Custom Grid Layout

**Purpose**: Provide search, categorization, and sorting controls in a compact, responsive layout.

**Pattern**:

```tsx
<div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 sm:gap-6">
    {/* Column 1: Search + Filters */}
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input placeholder="Search..." />
        <Select>
            <SelectItem value="all">All Categories</SelectItem>
            {/* options */}
        </Select>
    </div>

    {/* Column 2: Sort */}
    <Select>
        <SelectItem value="recent">Most Recent</SelectItem>
        {/* options */}
    </Select>

    {/* Column 3: View Toggle (optional) */}
    <ToggleGroup type="single">
        <ToggleGroupItem value="table">List View</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid View</ToggleGroupItem>
    </ToggleGroup>
</div>
```

**Styling**:

- Container: Border and background same as header cards
- Gap: `gap-4 sm:gap-6` between controls
- Inputs/Selects: Standard `Input` and `Select` shadcn components
- Responsive breakpoint: Stack on mobile, horizontal on tablet+

### 5. Results Section — Table/List/Grid

**Purpose**: Display paginated data in the appropriate collection format.

**Patterns**:

#### Table Pattern

```tsx
<div className="space-y-4">
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Column 1</TableHead>
                <TableHead>Column 2</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map(row => (
                <TableRow key={row.id}>
                    <TableCell>{row.field1}</TableCell>
                    <TableCell>{row.field2}</TableCell>
                    <TableCell className="text-right">
                        <RowActions row={row} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

    {/* Pagination */}
    <Pagination currentPage={page} totalPages={totalPages} />
</div>
```

#### Skeleton Loading

```tsx
// Use Suspense boundaries with skeleton UI
<Suspense fallback={<TableSkeleton rows={10} columns={5} />}>
    <DataTable data={data} />
</Suspense>
```

### 6. Empty State — `WorkspaceEmptyState`

**Purpose**: Display a helpful message when no data is available.

**Props**:

- `title` (string): Empty state heading
- `description` (string): Explanation of why nothing is shown
- `action?` (ReactNode): Call-to-action button
- `className?` (string): Additional CSS classes

**Styling**:

- Border: `border border-dashed border-neutral-700` (dashed for empty states)
- Background: `bg-neutral-950/80`
- Padding: `py-14` (vertical centering)
- Text alignment: centered
- Label: `text-xs uppercase tracking-[0.24em] text-blue-600`
- Title: `text-xl font-bold text-neutral-100`
- Description: `text-sm text-neutral-100 max-w-md`

**Example**:

```tsx
import { Button } from '@/components/ui/button'
import { WorkspaceEmptyState } from '@/components/shared/tenant-elements'

export function EmptyBookingState() {
    return (
        <WorkspaceEmptyState
            title="No Bookings Yet"
            description="Create your first wrap installation booking to get started."
            action={
                <Button asChild>
                    <Link href="/scheduling/manage/new">Create First Booking</Link>
                </Button>
            }
        />
    )
}
```

---

## Complete Page Example

### Feature Component Structure

```
features/scheduling/
├── scheduling-dashboard-page-feature.tsx       (Async wrapper, orchestrator)
├── scheduling-dashboard-filters.client.tsx     (Client-side filter logic)
├── scheduling-dashboard-table.client.tsx       (Client-side table interactivity)
├── scheduling-dashboard-parts.tsx              (Server components: stats, table)
└── scheduling-skeletons.tsx                    (Skeleton UI for Suspense fallbacks)
```

### Orchestration Pattern

```tsx
// features/scheduling/scheduling-dashboard-page-feature.tsx
export async function SchedulingDashboardPageFeature({
    searchParams,
}: SchedulingDashboardPageFeatureProps) {
    const resolvedParams = (searchParams ? await searchParams : {}) as SearchParamRecord
    const { filters } = parseSchedulingSearchParams(resolvedParams)

    return (
        <div className="space-y-6">
            {/* 1. Header */}
            <WorkspacePageIntro
                label="Scheduling"
                title="Installation Scheduling"
                description="Manage all wrap installation bookings..."
            />

            {/* 2. Actions Card */}
            <WorkspacePageContextCard
                title="Quick Actions"
                description="Start a new workflow"
            >
                <Button asChild>
                    <Link href="/scheduling/manage/new">New Booking</Link>
                </Button>
            </WorkspacePageContextCard>

            {/* 3. KPI Stats - Capability Gated */}
            <Suspense fallback={<SchedulingDashboardStatsSkeleton />}>
                <SchedulingDashboardStatsSection filters={filters} />
            </Suspense>

            {/* 4. Filters - Custom Grid */}
            <SchedulingDashboardToolbar>
                <SchedulingDashboardFiltersClient />
            </SchedulingDashboardToolbar>

            {/* 5. Results - Table with Pagination */}
            <Suspense fallback={<SchedulingBookingTableSkeleton />}>
                <SchedulingDashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
```

### Server Components with Auth/Authz

```tsx
// features/scheduling/scheduling-dashboard-parts.tsx
export async function SchedulingDashboardStatsSection({ filters }: Props) {
    // Server-side capability check
    const session = await getSession()
    const canViewStats = hasCapability(session.authz, 'scheduling.read.all')

    if (!canViewStats) {
        return null  // No access, return nothing
    }

    const bookings = await getBookingsForDashboard(filters)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <WorkspaceMetricCard label="Total" value={bookings.total} />
            <WorkspaceMetricCard label="Pending" value={bookings.pending} />
            <WorkspaceMetricCard label="Confirmed" value={bookings.confirmed} />
            <WorkspaceMetricCard label="Completed" value={bookings.completed} />
        </div>
    )
}

export async function SchedulingDashboardTableSection({ filters }: Props) {
    // No capability gate for results (showing what user has access to)
    const rows = await getBookingManagerRows(filters)

    if (rows.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No Bookings"
                description="Create your first booking to get started."
                action={<Button asChild><Link href="/scheduling/manage/new">New Booking</Link></Button>}
            />
        )
    }

    return <SchedulingDashboardTableClient rows={rows} />
}
```

---

## Design System Integration

### Color Palette for Dashboard Pages

| Element               | Class                | Hex                   |
| --------------------- | -------------------- | --------------------- |
| Card Border           | `border-neutral-700` | #404040               |
| Card Background       | `bg-neutral-950/80`  | rgba(10, 10, 10, 0.8) |
| Text Primary          | `text-neutral-100`   | #f5f5f5               |
| Text Secondary        | `text-neutral-400`   | #a3a3a3               |
| Label Accent          | `text-blue-600`      | #2563eb               |
| Icon Container Bg     | `bg-neutral-900`     | #171717               |
| Icon Container Border | `border-blue-600`    | #2563eb               |

### Typography for Dashboard Pages

| Element          | Mobile   | Desktop   | Weight        | Spacing           |
| ---------------- | -------- | --------- | ------------- | ----------------- |
| Page Label       | text-xs  | text-xs   | font-semibold | tracking-[0.24em] |
| Page Title       | text-3xl | text-4xl  | font-black    | tracking-tight    |
| Page Description | text-sm  | text-base | font-normal   | tracking-normal   |
| Card Title       | text-sm  | text-sm   | font-semibold | tracking-[0.18em] |
| Metric Label     | text-xs  | text-xs   | font-normal   | tracking-[0.18em] |
| Metric Value     | text-3xl | text-3xl  | font-black    | tracking-tight    |

### Spacing Conventions

- **Major sections**: `space-y-6` (24px)
- **Internal groups**: `space-y-4` (16px)
- **Grid gaps**: `gap-4 sm:gap-6 lg:gap-8`
- **Card padding**: `px-6 py-6` or `px-6 py-7` (header)
- **Container margins**: `mx-auto max-w-7xl` (if added later)

---

## Accessibility & Best Practices

1. **Semantic HTML**: Use `<section>` for major page sections
2. **ARIA Labels**: Add descriptions on icon-only buttons and custom controls
3. **Keyboard Navigation**: Ensure all buttons, selects, and inputs are keyboard-accessible
4. **Color Contrast**: All text meets WCAG AA standards
5. **Focus Indicators**: Tailwind's default ring styling applies
6. **Alt Text**: All images and icons have descriptive labels
7. **Responsive**: Mobile-first design, tested on 375px and up

---

## Anti-Patterns (Never Do These)

❌ Custom wrapper components for headers

```tsx
// Wrong
function MyPageHeader() { return (...) }
export function MyDashboard() {
    return <MyPageHeader />
}
```

❌ Multiple header styles per domain

```tsx
// Wrong - use ONE component for all domain headers
const CatalogPageHeader = () => (...)
const SchedulingPageHeader = () => (...)
```

❌ Filtering logic mixed with display

```tsx
// Wrong - filters should be Client Components, results in Server Components
export function DashboardResults() {
    const [filter, setFilter] = useState()
    // complex filtering logic
    return <Table />
}
```

❌ Client-side capability checks

```tsx
// Wrong - ALWAYS check on server
if (useAuth().hasCapability('billing.read.all')) {
    return <Stats />
}
```

❌ Hard-coded styling in components

```tsx
// Wrong - use className props instead
<div style={{ padding: '24px', backgroundColor: '#0a0a0a' }}>
```

---

## Migration Guide (For Existing Pages)

### Step 1: Replace Custom Headers

Find any `[Domain]PageHeader` components and replace with `WorkspacePageIntro`.

### Step 2: Standardize Action Cards

Wrap all action buttons in `WorkspacePageContextCard`.

### Step 3: Convert Stat Cards

Replace `[Domain]StatCard` with `WorkspaceMetricCard`.

### Step 4: Convert Empty States

Replace any `[Domain]EmptyState` with `WorkspaceEmptyState`.

### Step 5: Verify Page Structure

Ensure page follows the six-layer composition with correct spacing (`space-y-6`).

### Step 6: Add Auth/Authz Checks

Ensure stats sections check `hasCapability()` and return `null` if unauthorized.
