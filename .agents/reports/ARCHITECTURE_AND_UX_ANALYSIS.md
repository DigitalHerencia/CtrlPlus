# CtrlPlus Codebase Architecture & UX Analysis

**Date**: April 10, 2026
**Scope**: Complete UX/Architecture review of tenant-scoped domains
**Status**: Actionable intelligence for implementation

---

## 1. CURRENT STATE ANALYSIS

### 1.1 Domain Inventory

| Domain         | Purpose                                              | Scope                            | Pages                                | Auth Pattern                                      |
| -------------- | ---------------------------------------------------- | -------------------------------- | ------------------------------------ | ------------------------------------------------- |
| **catalog**    | Product wrap inventory, browse/manage                | Browse public, manage restricted | browse, [wrapId], manage/, [wrapId]/ | `hasCapability('catalog.manage')`                 |
| **billing**    | Invoice/payment lifecycle                            | Dashboard + management           | dashboard, manage/, [invoiceId]/     | `hasCapability('billing.read.all')` for manage    |
| **scheduling** | Booking calendar & appointment system                | Dashboard + management           | dashboard, manage/, [bookingId]/     | `hasCapability('scheduling.read.all')` for manage |
| **visualizer** | Wrap preview generation (HuggingFace integration)    | Single public interface          | /visualizer                          | `requireCapability('visualizer.use')`             |
| **settings**   | User/tenant/workspace configuration                  | Profile, account, data export    | /settings/profile, /account, /data   | Basic `isAuthenticated` check                     |
| **platform**   | Developer/operations dashboards (DB, webhooks, jobs) | Internal monitoring              | /platform/\*\*                       | Admin-only (scope TBD)                            |
| **admin**      | Moderation, analytics, command-control               | Dashboard + sub-pages            | /admin/\*\*                          | Admin-only enforcement TBD                        |

### 1.2 Page Structure Patterns

#### Dashboard Pattern (Catalog, Billing, Scheduling)

```
Page Layer (/app/(tenant)/[domain]/page.tsx)
├─ Auth check: isAuthenticated + userId
├─ Optional: hasCapability() for conditional rendering
└─ Feature component with searchParams

Feature Layer (features/[domain]/[domain]-dashboard-page-feature.tsx)
├─ Awaits searchParams
├─ Parses search params via lib/utils/search-params
├─ Renders structure:
│  ├─ PageHeader (domain-specific title + description)
│  ├─ WorkspacePageContextCard (actions, snapshot info)
│  ├─ Stats section (Suspense + skeleton)
│  ├─ Filters toolbar
│  └─ Results/table section (Suspense + skeleton)
└─ All data fetching via lib/fetchers/[domain].fetchers.ts
```

#### Navigation Hierarchy

- **Catalog**: browse (public) → [wrapId] (detail) → manage (if capability) → new/[wrapId] (forms)
- **Billing**: dashboard → manage (if capability) → [invoiceId] (detail) → adjust/refund (if capability)
- **Scheduling**: dashboard → manage (if capability) → [bookingId] (detail) → new (if capability)
- **Visualizer**: /visualizer (single page, capability-gated)
- **Settings**: /settings (redirect) → profile | account | data
- **Platform**: /platform (redirect) → dashboard | db | webhooks | jobs | health | visualizer

### 1.3 Current Auth/Authz Implementation

**Session Type**: `AuthzContext` with role-based capabilities

- `isAuthenticated`: boolean
- `userId`: string
- `role`: user role (owner, admin, dev, user, etc.)
- `isOwner`: boolean
- `isPlatformAdmin`: boolean

**Capability System**: `ROLE_CAPABILITIES` map (role → Set<Capability>)

- `catalog.manage`: read/write wrap catalog
- `billing.read.all` / `billing.write.all`: invoice access
- `scheduling.read.all`: booking management
- `visualizer.use`: preview tool access
- _Pattern_: `hasCapability(session.authz, 'domain.action')` for conditional render
- _Pattern_: `requireCapability(session.authz, 'domain.action')` for enforced access

**Issues Found**:

- ❌ Visualizer uses `requireCapability()` (enforced) vs catalog uses `hasCapability()` (conditional) — inconsistent patterns
- ❌ Billing/scheduling manage pages redirect if `!hasCapability()`, but catalog/visualizer also redirect
- ❌ Settings pages only check `isAuthenticated`, no role-based access control
- ❌ Platform pages have NO auth checks at all (security risk)
- ❌ Admin pages have NO auth checks at all (security risk)

---

## 2. DESIGN PATTERN DOCUMENTATION

### 2.1 Shared Header Pattern

**Component**: `WorkspacePageIntro` (`components/shared/tenant-elements.tsx`)

```tsx
// Used by all domain pages
<WorkspacePageIntro
  label="Catalog"  // uppercase badge in blue-600
  title="Vehicle Wrap Gallery"  // h1 bold 3xl/4xl
  description="Explore premium wrap styles..."  // p base gray
/>

// Styling rules:
- Border: 1px solid neutral-700
- Background: neutral-950/80
- Padding: px-6 py-7
- Label: text-xs uppercase tracking-wide text-blue-600
- Title: text-3xl sm:text-4xl font-black
- Description: text-sm sm:text-base
```

**Used By**:

- `CatalogPageHeader` → wraps `WorkspacePageIntro`
- `InvoicesDashboardHeader` → wraps `WorkspacePageIntro`
- `SchedulingDashboardHeader` → wraps `WorkspacePageIntro`
- `SettingsPageHeader` → wraps `WorkspacePageIntro`
- `AdminPageHeader` → likely wraps `WorkspacePageIntro` (verify)

### 2.2 Context Card & Actions Pattern

**Component**: `WorkspacePageContextCard` (`components/shared/tenant-elements.tsx`)

```tsx
<WorkspacePageContextCard
  title="Billing Actions"
  description="Open management tools and lifecycle controls"
>
  <Button asChild>
    <Link href="/billing/manage">Manage Invoices</Link>
  </Button>
</WorkspacePageContextCard>

// Styling:
- Same border/bg as header
- Responsive grid: flex col on mobile, lg:flex-row on larger
- Title: text-sm font-semibold uppercase
- Children: flex gap-3, wrap with flex-wrap
```

**Used By**:

- Catalog: Catalog Snapshot, Publish Status sections
- Billing: Billing Actions
- Scheduling: Scheduling Actions
- All use shadcn/ui `Button` + `Link` for navigation

### 2.3 Stats/KPI Card Pattern

**Component**: `WorkspaceMetricCard` (`components/shared/tenant-elements.tsx`)

```tsx
<WorkspaceMetricCard
  label="Total Wraps"
  value={count}
  description="Active in catalog"
  icon={PackageIcon}
  badge="Latest"
/>

// Grid container: grid gap-4 xl:grid-cols-3 (3 columns on xl screens)
// Styling: Card with neutral-950/80 bg, blue icon box
```

**Used By**:

- Catalog: summary stats (published, drafts, pending)
- Billing: KPI grid (total revenue, pending payments, etc.)
- Scheduling: booking stats (pending, confirmed, completed)

### 2.4 Empty State Pattern

**Component**: `WorkspaceEmptyState` (`components/shared/tenant-elements.tsx`)

```tsx
<WorkspaceEmptyState
  title="No Bookings Yet"
  description="Create a new booking or wait for customers to book"
  action={<Button asChild><Link href="...">Create</Link></Button>}
/>

// Styling:
- Card with dashed border: border-dashed border-neutral-700
- Center flex layout
- "No Results" badge in blue
- py-14 vertical padding
```

**Duplicate Component**: `SettingsEmptyState` in `components/settings/`
→ _Candidate for consolidation_

**Used By**:

- Scheduling: booking management empty state
- Settings: account/data sections
- Catalog: empty wrap results (verify)

### 2.5 Filter/Toolbar Section Pattern

**Pattern**: Domain-specific filter sections

```tsx
// Catalog
<CatalogFiltersSection />  // Server component

// Billing (toolbar)
<InvoicesDashboardToolbar>
  <InvoicesDashboardFiltersClient />  // Client component
</InvoicesDashboardToolbar>

// Scheduling (toolbar)
<SchedulingDashboardToolbar>
  <SchedulingDashboardFiltersClient />  // Client component
</SchedulingDashboardToolbar>
```

**Pattern Consistency Issues**:

- ❌ Catalog filters are synchronous server component
- ❌ Billing/scheduling filters are async-wrapped client components
- ❌ No consistent toolbar/filter abstraction across domains

### 2.6 Results Section Pattern

**Pattern**: Feature component with Suspense + skeleton

```tsx
export async function CatalogResultsSection({ filters, canManageCatalog }) {
  const wraps = await getCatalogWraps(filters)
  return <CatalogGridComponent wraps={wraps} />
}

// Wrapped in page with:
<Suspense fallback={<SkeletonComponent />}>
  <ResultsSection filters={filters} />
</Suspense>
```

**Skeleton Components**:

- `CatalogGridSkeleton`, `CatalogPaginationSkeleton`
- `BillingInvoiceTableSkeleton`, `BillingKpiCardsSkeleton`
- `SchedulingBookingTableSkeleton`, `SchedulingDashboardStatsSkeleton`
- `VisualizerSkeletons`

### 2.7 shadcn/ui Primitives Used

**UI Components** (comprehensive inventory):

- `Button` (primary, secondary, outline variants)
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Badge` (outline, solid)
- `Table` (TableBody, TableCell, TableHead, TableHeader, TableRow)
- `Dialog` + `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- `Form` (with React Hook Form)
- `Input`, `Checkbox`, `Select`, `Textarea`
- `Popover`, `DropdownMenu`
- `Tabs`
- `AlertDialog`
- `Tooltip`

**Color System** (enforced):

- Primary: `blue-600` (labels, icons, active states)
- Text: `neutral-100` (primary), `neutral-400` (secondary), `neutral-700` (borders)
- Background: `neutral-950` (primary), `neutral-950/80` (cards)
- Borders: 1px `neutral-700`
- No rounded corners: `--radius: 0`

---

## 3. FILE STRUCTURE MAPPING

### 3.1 Catalog Domain (Reference)

```
📁 features/catalog/
├─ catalog-browse-page-feature.tsx        [Page feature: renders browse UI]
├─ catalog-browse-parts.tsx               [Sub-components: header, filters, results]
├─ catalog-detail-page-feature.tsx        [Wrap detail view]
├─ catalog-filters-client.tsx             [Filter controls - CLIENT]
├─ catalog-manager-page-feature.tsx       [Manager list view]
├─ catalog-manager-client.tsx             [Manager controls - CLIENT]
├─ catalog-wrap-assets-client.tsx         [Asset upload/management - CLIENT]
├─ file-key.client.ts                     [Utility for file naming]
└─ manage/
   ├─ wrap-manager-detail-page-feature.tsx [Detail form]
   ├─ wrap-manager-detail-page.client.tsx  [Detail form - CLIENT]
   ├─ wrap-publish-panel.client.tsx        [Publish controls - CLIENT]
   ├─ wrap-form/
   │  └─ [form components]
   └─ [11 more files...]

📁 components/catalog/
├─ catalog-page-header.tsx                [Wraps WorkspacePageIntro]
├─ catalog-pagination.tsx                 [Pagination UI]
├─ catalog-skeletons.tsx                  [Skeleton loaders]
├─ manage/                                [Manager-specific components]
├─ wrap-detail-carousel.tsx               [Image carousel]
├─ wrap-gallery-grid.tsx                  [Browse grid layout]
├─ wrap-images/                           [Image management components]
└─ WrapDetail.tsx, WrapImageManager.tsx   [Component orchestration]

📁 lib/fetchers/catalog.fetchers.ts
├─ getCatalogWraps()
├─ getCatalogWrap()
├─ getCatalogAssetDeliveryUrl()
├─ [5 more read functions]

📁 lib/actions/catalog.actions.ts
├─ createWrap()
├─ updateWrap()
├─ publishWrap()
├─ [6 more write functions]

📁 lib/db/selects/catalog.selects.ts     [Prisma field selections]

📁 schemas/catalog.schemas.ts             [Zod validation schemas]

📁 types/catalog.types.ts                 [TypeScript interfaces]
```

### 3.2 Billing Domain

```
📁 features/billing/
├─ invoices-dashboard-page-feature.tsx    [Dashboard feature]
├─ invoices-dashboard-parts.tsx           [Stats, table components]
├─ invoices-dashboard-filters.client.tsx  [Filter controls - CLIENT]
├─ invoices-dashboard-header.tsx          [Header wrapper]
└─ manage/
   ├─ invoice-manager-page-feature.tsx    [Manager feature]
   ├─ invoice-manager-table.client.tsx    [Table - CLIENT]
   ├─ invoice-manager-filters.client.tsx  [Filters - CLIENT]
   ├─ invoice-manager-bulk-actions.client.tsx [Bulk ops - CLIENT]
   ├─ invoice-editor-form.client.tsx      [Editor form - CLIENT]
   ├─ new-invoice-page-feature.tsx        [Creation feature]
   ├─ invoice-notification-controls.client.tsx [Notifications - CLIENT]
   └─ invoice-manager-toolbar.client.tsx  [Toolbar - CLIENT]

📁 components/billing/
├─ invoices-dashboard-header.tsx          [Header component]
├─ invoices-dashboard-toolbar.tsx         [Toolbar container]
├─ billing-skeletons.tsx                  [Skeleton loaders]
├─ manage/
│  ├─ invoice-lifecycle-panel.tsx         [❌ UNUSED - dead code]
│  └─ [other manage components]
└─ [other components...]

📁 lib/fetchers/billing.fetchers.ts
├─ getInvoices()
├─ getInvoiceById()                       [❌ UNUSED EXPORT]
├─ getInvoiceDashboardStats()
├─ [6 more read functions]

📁 lib/actions/billing.actions.ts
├─ createInvoice()
├─ updateInvoice()
├─ refundInvoice()
├─ [5 more write functions]

📁 schemas/billing.schemas.ts             [Zod schemas]
📁 types/billing.types.ts                 [DTOs and types]
```

### 3.3 Scheduling Domain

```
📁 features/scheduling/
├─ scheduling-dashboard-page-feature.tsx  [Dashboard feature]
├─ scheduling-dashboard-parts.tsx         [Stats, table components]
├─ scheduling-dashboard-filters.client.tsx [Filter - CLIENT]
├─ scheduling-dashboard-table.client.tsx [Table - CLIENT]
├─ scheduling-book-page-feature.tsx       [Booking form feature]
├─ scheduling-bookings-page-feature.tsx   [Bookings list - PUBLIC]
├─ booking-form.client.tsx                [Form - CLIENT]
├─ booking-slot-picker.client.tsx         [Calendar/slots - CLIENT]
├─ booking-status-filters.client.tsx      [Status filter - CLIENT]
├─ booking-detail-page-feature.tsx        [Detail view]
├─ booking.mappers.ts                     [Data transformation]
├─ booking-calendar.client.tsx            [Calendar - CLIENT]
└─ manage/
   ├─ bookings-manager-page-feature.tsx   [Manager feature]
   ├─ bookings-manager-table.client.tsx   [Table - CLIENT]
   ├─ bookings-manager-filters.client.tsx [Filters - CLIENT]
   ├─ bookings-manager-bulk-actions.client.tsx [Bulk ops - CLIENT]
   ├─ booking-notification-controls.client.tsx [Notifications - CLIENT]
   ├─ managed-booking-form.client.tsx     [Form - CLIENT]
   ├─ new-managed-booking-page-feature.tsx [Creation]
   ├─ edit-managed-booking-page-feature.tsx [Editing]
   └─ booking-status-actions.client.tsx   [Status ops - CLIENT]

📁 components/scheduling/
├─ scheduling-dashboard-header.tsx        [Header wrapper]
├─ scheduling-dashboard-toolbar.tsx       [Toolbar]
├─ scheduling-dashboard-stats.tsx         [Stats cards]
├─ scheduling-skeletons.tsx               [Skeleton loaders]
└─ [other components...]

📁 lib/fetchers/scheduling.fetchers.ts
├─ getBookings()
├─ getBookingById()
├─ getAvailableSlots()
├─ getBookingManagerRows()
├─ [4 more read functions]

📁 lib/actions/scheduling.actions.ts
├─ createBooking()
├─ updateBooking()
├─ cancelBooking()
├─ [5 more write functions]

📁 schemas/scheduling.schemas.ts          [Zod schemas]
📁 types/scheduling.types.ts              [DTOs and types]
```

### 3.4 Visualizer Domain (MINIMAL)

```
📁 features/visualizer/
├─ visualizer-hf-page-feature.tsx         [Single page feature]
└─ uploads/
   └─ [upload management]

📁 components/visualizer/
├─ visualizer-hf-configurator.client.tsx  [Configurator - CLIENT]
├─ visualizer-skeletons.tsx               [❌ UNUSED - dead code]
├─ previews/
│  └─ [preview components]
└─ uploads/
   └─ [upload components]

📁 lib/fetchers/visualizer.fetchers.ts
├─ getVisualizerHfCatalogData()
└─ [1 more function]

📁 lib/actions/visualizer.actions.ts
├─ generateVisualizerHfPreview()
└─ [1 more function]

❌ DEAD CODE (15 unused files in visualizer):
├─ lib/cache/visualizer-cache.ts
├─ lib/visualizer/asset-delivery.ts
├─ lib/visualizer/fallback/*.ts (3 files)
├─ lib/visualizer/huggingface/*.ts (2 files)
├─ lib/visualizer/prompting/*.ts
├─ lib/db/selects/visualizer.selects.ts
├─ components/visualizer/visualizer-skeletons.tsx
└─ [5 more...]
```

### 3.5 Settings Domain

```
📁 features/settings/
├─ profile-settings-page-feature.tsx      [User profile]
├─ account-settings-page-feature.tsx      [Account management]
├─ data-export-page-feature.tsx           [Data export]
├─ user-settings-form.client.tsx          [Form - CLIENT]
├─ tenant-settings-form.client.tsx        [Form - CLIENT]
├─ website-settings-form-client.tsx       [Form - CLIENT]
├─ settings-tabs.client.tsx               [Tab navigation - CLIENT]
├─ export-data-actions.client.tsx         [Export - CLIENT]

📁 components/settings/
├─ settings-page-header.tsx               [Header wrapper]
├─ settings-empty-state.tsx               [❌ DUPLICATE of WorkspaceEmptyState]
├─ settings-section-nav.tsx               [Navigation]
├─ user-settings/
├─ tenant-settings/
├─ website-settings-form.tsx
├─ security/
├─ export/
└─ [other components...]

📁 lib/fetchers/settings.fetchers.ts
├─ getUserSettings()
├─ getTenantSettings()
├─ getWebsiteSettings()

📁 lib/actions/settings.actions.ts
├─ updateUserSettings()
├─ updateTenantSettings()
├─ exportUserData()
├─ [3 more write functions]

📁 schemas/settings.schemas.ts            [Zod schemas]
📁 types/settings.types.ts                [Types]
```

### 3.6 Platform Domain (DevOps/Admin Tools)

```
📁 features/platform/
├─ platform-dashboard-page-feature.tsx    [Dashboard]
├─ platform-health-page-feature.tsx       [System health]
├─ platform-db-page-feature.tsx           [Database tools]
├─ platform-db-tools-feature.tsx          [DB operations]
├─ platform-webhooks-page-feature.tsx     [Webhook monitor]
├─ platform-jobs-page-feature.tsx         [Job queue monitor]
├─ platform-visualizer-page-feature.tsx   [Visualizer ops]
├─ platform-actions.client.tsx            [Actions - CLIENT]
├─ platform-recovery-actions-client.tsx   [Recovery - CLIENT]
└─ [6 more features...]

📁 lib/fetchers/platform.fetchers.ts
├─ getPlatformHealth()
├─ getPlatformDatabase()
├─ [10+ monitoring functions]

📁 lib/actions/platform.actions.ts
├─ triggerDatabaseMaintenance()
├─ [operational write functions]

🚨 SECURITY ISSUE: /app/(tenant)/platform/page.tsx has NO auth checks
```

### 3.7 Admin Domain (Moderation & Analytics)

```
📁 features/admin/
├─ admin-dashboard-page-feature.tsx       [Dashboard]
├─ admin-moderation-page-feature.tsx      [Moderation queue]
├─ admin-audit-page-feature.tsx           [Audit logs]
├─ admin-analytics-page-feature.tsx       [Analytics]
├─ admin-activity-panel-feature.tsx       [Activity feed]
├─ admin-kpi-grid-feature.tsx             [KPI metrics]
├─ admin-moderation-actions.client.tsx    [Moderation - CLIENT]
├─ admin-analytics-filters.client.tsx     [Filters - CLIENT]
├─ admin-audit-filters.client.tsx        [Filters - CLIENT]
└─ admin-quick-actions.client.tsx        [Actions - CLIENT]

📁 components/admin/
├─ admin-page-header.tsx                 [Header wrapper]
├─ admin-quick-links.tsx                 [Quick nav]
├─ admin-action-panel.tsx                [Action buttons]
├─ admin-activity-feed.tsx               [Activity list]
├─ admin-audit-log-table.tsx             [Audit table]
├─ admin-kpi-card.tsx                    [KPI card]
├─ admin-kpi-grid.tsx                    [KPI grid]
├─ [more components...]

📁 lib/fetchers/admin.fetchers.ts
├─ getAdminDashboardStats()
├─ getAdminQuickLinks()
├─ getModerationQueue()
├─ [10+ read functions]

🚨 SECURITY ISSUE: /app/(tenant)/admin/page.tsx has NO auth checks
```

---

## 4. AUTH/AUTHZ REQUIREMENTS & FIXES

### 4.1 Current Capability Mapping

```typescript
// From lib/authz/policy.ts and capabilities config
export const ROLE_CAPABILITIES = {
  owner: new Set([
    'catalog.manage',
    'catalog.read',
    'billing.read.all',
    'billing.write.all',
    'scheduling.read.all',
    'scheduling.write.all',
    'visualizer.use',
    'settings.manage',
    'platform.access',
    'admin.access',
  ]),
  admin: new Set([
    // Similar to owner, depending on model
  ]),
  platformDev: new Set([
    'catalog.read',
    'scheduling.read.all',
    'visualizer.use',
    'platform.access',
  ]),
  user: new Set([
    'catalog.read',
    'scheduling.read',
    'visualizer.use',
  ]),
}
```

### 4.2 Auth Checks Status by Page

| Page Route           | Current Check                                         | Issue                           | Fix Required                                       |
| -------------------- | ----------------------------------------------------- | ------------------------------- | -------------------------------------------------- |
| `/catalog`           | `isAuthenticated` + `hasCapability('catalog.manage')` | ✅ Conditional                  | None                                               |
| `/catalog/manage`    | `hasCapability('catalog.manage')` + redirect          | ✅ Enforced                     | None                                               |
| `/billing`           | `userId` only                                         | ❌ Missing role check           | Add `hasCapability('billing.read')` conditional    |
| `/billing/manage`    | `hasCapability('billing.read.all')` + redirect        | ✅ Enforced                     | None                                               |
| `/scheduling`        | `isAuthenticated` only                                | ❌ Missing role check           | Add `hasCapability('scheduling.read')` conditional |
| `/scheduling/manage` | `hasCapability('scheduling.read.all')` + redirect     | ✅ Enforced                     | None                                               |
| `/visualizer`        | `requireCapability('visualizer.use')`                 | ✅ Enforced                     | Standardize to `hasCapability()` pattern           |
| `/settings/profile`  | `isAuthenticated` only                                | ⚠️ Owner-scoped but not checked | Add `isOwner` check or verify user ownership       |
| `/settings/account`  | `isAuthenticated` only                                | ⚠️ Should be admin-only         | Add `requirePlatformAdmin()`                       |
| `/settings/data`     | `isAuthenticated` only                                | ⚠️ Should be owner-scoped       | Add `requireOwnerOrAdmin()`                        |
| `/platform/**`       | **NONE** 🚨                                           | 🚨 **CRITICAL**                 | Add `requirePlatformAdmin()` to all routes         |
| `/admin/**`          | **NONE** 🚨                                           | 🚨 **CRITICAL**                 | Add `requirePlatformAdmin()` to all routes         |

### 4.3 Auth Check Pattern Standardization

**Current Issues**:

1. ❌ Mixed patterns: `requireCapability()` vs `hasCapability()` vs redirect
2. ❌ Inconsistent capability names: `billing.read.all` vs `billing.read`
3. ❌ Platform/admin pages COMPLETELY UNPROTECTED
4. ❌ Settings pages have no role separation

**Proposed Standardization**:

```typescript
// TOP-LEVEL PAGE PATTERN (app/(tenant)/[domain]/page.tsx)

// For info-only pages (read-only dashboard)
const session = await getSession()
if (!session.isAuthenticated) redirect('/sign-in')

const canAccess = hasCapability(session.authz, 'domain.read')
// Pass to feature, render conditionally

// For management pages (write operations)
const session = await getSession()
if (!session.isAuthenticated) redirect('/sign-in')

if (!hasCapability(session.authz, 'domain.write.all')) {
  redirect('/domain')  // Fallback to read-only view
}

// For admin-only pages
const session = await getSession()
requirePlatformAdmin(session.authz)  // Throws if not admin

// For owner-only settings
const session = await getSession()
requireOwnerOrAdmin(session.authz)  // Throws if not owner/admin
```

### 4.4 Required Fixes (Priority Order)

#### CRITICAL (Security Risk)

1. **Add auth checks to all `/platform/**` pages\*\*
    - Add `requirePlatformAdmin(session.authz)` to all platform route handlers
    - Files: `app/(tenant)/platform/db/page.tsx`, `app/(tenant)/platform/jobs/page.tsx`, etc.

2. **Add auth checks to all `/admin/**` pages\*\*
    - Add `requirePlatformAdmin(session.authz)` to all admin route handlers
    - File: `app/(tenant)/admin/page.tsx` and all sub-routes

#### HIGH (Feature Consistency)

3. **Standardize capability naming**
    - Rename: `billing.read.all` → `billing.read`, `billing.write.all` → `billing.write`
    - Rename: `scheduling.read.all` → `scheduling.read`, `scheduling.write.all` → `scheduling.write`
    - Update all references throughout codebase

4. **Standardize auth pattern**
    - Replace `requireCapability()` with `hasCapability()` + conditional
    - Consolidate redirect patterns
    - Update all page routes to follow single pattern

#### MEDIUM (Role-Based Access)

5. **Add capability checks to info dashboards**
    - Billing: Check for `billing.read` capability
    - Scheduling: Check for `scheduling.read` capability
    - Catalog: Already correct

6. **Separate settings by role**
    - Profile: Keep for all authenticated users
    - Account: Restrict to owner/admin only
    - Data Export: Restrict to owner/admin only

#### LOW (Consistency)

7. **Visualizer pattern alignment**
    - Change `requireCapability()` to `hasCapability()` checkfor consistency
    - Show "access denied" UI instead of throwing

---

## 5. ACCESSIBILITY & GOVERNANCE

### 5.1 Component Reuse Opportunities

#### CONSOLIDATION CANDIDATES

1. **Empty State Components** (Can Consolidate)
    - `WorkspaceEmptyState` (shared/tenant-elements)
    - `SettingsEmptyState` (settings)
    - **Action**: Delete `SettingsEmptyState`, use `WorkspaceEmptyState` everywhere
    - **Dependencies**: 2 files in settings/ import it

2. **Page Header Components** (Can Consolidate)
    - `CatalogPageHeader` → wraps `WorkspacePageIntro`
    - `InvoicesDashboardHeader` → wraps `WorkspacePageIntro`
    - `SchedulingDashboardHeader` → wraps `WorkspacePageIntro`
    - `SettingsPageHeader` → wraps `WorkspacePageIntro`
    - `AdminPageHeader` → likely wraps `WorkspacePageIntro`
    - **Action**: Delete all domain-specific headers, use `WorkspacePageIntro` directly
    - **Impact**: Remove 5 files, simplify pattern

3. **Filter Toolbar Pattern** (Can Abstract)
    - `InvoicesDashboardToolbar`
    - `SchedulingDashboardToolbar`
    - `CatalogFiltersSection` (different name, same pattern)
    - **Action**: Create generic `WorkspaceFilterToolbar` component
    - **Impact**: Reduce duplication across 3 domains

4. **Skeleton Loaders** (Can Consolidate)
    - Each domain duplicates: GridSkeleton, TableSkeleton, StatsSkeleton
    - **Action**: Create generic skeletons in `components/ui/skeletons/`
    - **Impact**: Remove 15+ files

### 5.2 Dead Code Inventory

**UNUSED FILES** (from knip.out.txt):

| File                                                      | Reason           | Priority |
| --------------------------------------------------------- | ---------------- | -------- |
| `components/visualizer/visualizer-skeletons.tsx`          | ❌ Unused import | Delete   |
| `lib/cache/cache-keys.ts`                                 | ❌ No consumers  | Delete   |
| `lib/cache/visualizer-cache.ts`                           | ❌ No consumers  | Delete   |
| `lib/visualizer/asset-delivery.ts`                        | ❌ No consumers  | Delete   |
| `components/billing/manage/invoice-lifecycle-panel.tsx`   | ❌ Not imported  | Delete   |
| `components/catalog/wrap-images/wrap-gallery-manager.tsx` | ❌ Not imported  | Delete   |
| `components/catalog/wrap-images/wrap-image-card.tsx`      | ❌ Not imported  | Delete   |
| `components/catalog/wrap-images/wrap-image-list.tsx`      | ❌ Not imported  | Delete   |
| `lib/db/selects/visualizer.selects.ts`                    | ❌ Not imported  | Delete   |
| `lib/visualizer/fallback/build-simple-wrap-preview.ts`    | ❌ Not imported  | Delete   |
| `lib/visualizer/fallback/place-logo-overlay.ts`           | ❌ Not imported  | Delete   |
| `lib/visualizer/fallback/tint-vehicle-panels.ts`          | ❌ Not imported  | Delete   |
| `lib/visualizer/huggingface/generate-wrap-preview.ts`     | ❌ Not imported  | Delete   |
| `lib/visualizer/huggingface/image-to-image-client.ts`     | ❌ Not imported  | Delete   |
| `lib/visualizer/prompting/build-wrap-preview-prompt.ts`   | ❌ Not imported  | Delete   |

**UNUSED EXPORTS** (from knip.out.txt - partial list):

| Export                        | File                               | Used? | Action               |
| ----------------------------- | ---------------------------------- | ----- | -------------------- |
| `buttonVariants`              | `components/ui/button.tsx`         | ❌    | Keep for flexibility |
| `requireAuth`                 | `lib/auth/session.ts`              | ❌    | Delete if unused     |
| `parseVisualizerSearchParams` | `lib/utils/search-params.ts`       | ❌    | Delete               |
| `createVisualizerQueryString` | `lib/utils/search-params.ts`       | ❌    | Delete               |
| `getCatalogAssetDeliveryUrl`  | `lib/fetchers/catalog.mappers.ts`  | ❌    | Delete               |
| `toCatalogAssetImage`         | `lib/fetchers/catalog.mappers.ts`  | ❌    | Delete               |
| `getInvoiceById`              | `lib/fetchers/billing.fetchers.ts` | ❌    | Delete               |
| `wrapImageKindValues`         | `lib/constants/statuses.ts`        | ❌    | Delete               |
| `previewStatusValues`         | `lib/constants/statuses.ts`        | ❌    | Delete               |
| `normalizePreviewStatus`      | `lib/constants/statuses.ts`        | ❌    | Delete               |
| `normalizeVehicleUpload`      | `lib/uploads/image-processing.ts`  | ❌    | Delete               |
| `SidebarGroup*`               | `components/ui/sidebar.tsx`        | ❌    | Delete if not used   |

**UNUSED DEPENDENCY**:

- `@gradio/client` in `package.json` → May be legacy visualizer code

### 5.3 Governance Violations

**Dead Code Prevention Policy Violations**:

1. ❌ 15 unused files in visualizer (legacy preview generation attempts)
2. ❌ 103+ unused exports (mostly utilities)
3. ❌ 1 unused dependency (@gradio/client)

**Layer Integrity Violations** (from copilot-instructions.md):

1. ✅ All reads via `lib/fetchers/**` — COMPLIANT
2. ✅ All writes via `lib/actions/**` — COMPLIANT
3. ⚠️ Some components import Prisma directly (verify)
4. ✅ App layer is orchestration-only — MOSTLY COMPLIANT

**Audit Protocol Issues**:

1. `knip.out.txt` reflects current knip run results
2. `.agents/reports/knip.txt` may be stale (last audit snapshot)
3. Need regeneration: `pnpm knip --no-progress > knip.out.txt`

### 5.4 Component Governance (Design System)

**Color System** (from copilot-instructions.md):

- ✅ Primary: `blue-600` for labels/icons
- ✅ Text: `neutral-100` (primary), `neutral-400` (secondary)
- ✅ Background: `neutral-950` with `/80` opacity for cards
- ✅ Borders: 1px `neutral-700`
- ✅ No rounded corners: `--radius: 0`
- ✅ All buttons follow template (primary = blue, secondary = outline)

**Typography** (from copilot-instructions.md):

- ✅ Mobile-first responsive: `text-sm sm:text-base`
- ✅ Headers: `text-3xl sm:text-4xl font-black`
- ✅ Semantic font sizing

**Spacing** (from copilot-instructions.md):

- ✅ 4px increments: `px-4 sm:px-6 lg:px-8`
- ✅ Responsive scaling with breakpoints
- ✅ Consistent `gap-4`, `gap-6` usage

---

## 6. COMPREHENSIVE IMPLEMENTATION PLAN

### 6.1 Phased Rollout

#### Phase 1: SECURITY (1-2 days)

**Goal**: Protect platform and admin routes

```
Task 1.1: Add auth checks to platform routes
├─ File: app/(tenant)/platform/page.tsx
├─ Add: requirePlatformAdmin(session.authz)
├─ Apply to: all /platform/** routes
└─ Test: Verify non-admins get 403/redirect

Task 1.2: Add auth checks to admin routes
├─ File: app/(tenant)/admin/page.tsx
├─ Add: requirePlatformAdmin(session.authz)
├─ Apply to: all /admin/** routes
└─ Test: Verify non-admins get 403/redirect

Task 1.3: Update settings role separation
├─ /settings/account → requireOwnerOrAdmin()
├─ /settings/data → requireOwnerOrAdmin()
├─ /settings/profile → Keep as-is
└─ Test: Verify access levels
```

**Expected Result**: Platform/admin pages protected, settings properly scoped

#### Phase 2: STANDARDIZATION (2-3 days)

**Goal**: Normalize auth patterns and capability naming

```
Task 2.1: Rename capabilities for consistency
├─ billing.read.all → billing.read
├─ billing.write.all → billing.write
├─ scheduling.read.all → scheduling.read
├─ scheduling.write.all → scheduling.write
├─ Update: lib/authz/capabilities.ts
├─ Update: All page routes
└─ Test: pnpm typecheck

Task 2.2: Standardize auth pattern across pages
├─ All pages follow: isAuthenticated check + capability check
├─ Replace requireCapability() with hasCapability() + conditional
├─ Redirect pattern: if !capability, redirect to read-only view
├─ For admin: use requirePlatformAdmin()
└─ Files affected: 8 page.tsx files + manage/* pages

Task 2.3: Add billing/scheduling read capability checks
├─ /billing → add hasCapability('billing.read') conditional
├─ /scheduling → add hasCapability('scheduling.read') conditional
├─ Display message if !canRead
└─ Test: Verify conditional rendering

Task 2.4: Visualizer pattern consistency
├─ Change requireCapability() to hasCapability()
├─ Show UI message instead of throwing
├─ File: app/(tenant)/visualizer/page.tsx
└─ Test: Verify behavior for non-capable users
```

**Expected Result**: Consistent auth patterns, standardized capability names

#### Phase 3: CONSOLIDATION (2-3 days)

**Goal**: Remove duplication, improve maintainability

```
Task 3.1: Delete duplicate empty state component
├─ Delete: components/settings/settings-empty-state.tsx
├─ Update imports: features/settings/*.tsx (2 files)
├─ Use: WorkspaceEmptyState from shared
└─ Test: pnpm typecheck + lint

Task 3.2: Delete domain-specific page headers
├─ Delete: components/catalog/catalog-page-header.tsx
├─ Delete: components/billing/invoices-dashboard-header.tsx
├─ Delete: components/scheduling/scheduling-dashboard-header.tsx
├─ Delete: components/settings/settings-page-header.tsx
├─ Update: All features to use WorkspacePageIntro directly
├─ Files affected: 8 feature files
└─ Test: pnpm typecheck + lint

Task 3.3: Abstract filter toolbar pattern
├─ Create: components/shared/workspace-filter-toolbar.tsx
├─ Move logic from: invoices-dashboard-toolbar, scheduling-dashboard-toolbar
├─ Update imports: 2 features
└─ Test: Verify toolbar renders correctly

Task 3.4: Consolidate skeleton loaders
├─ Create: components/ui/skeletons/*.tsx (generic)
├─ Delete: Domain-specific skeleton files (15+)
├─ Update: All imports across domains
└─ Test: pnpm typecheck + lint

Task 3.5: Clean up dead code
├─ Delete: 15 unused files (visualizer, catalog, image processing)
├─ Delete: 103 unused exports
├─ Remove: @gradio/client dependency from package.json
├─ Update: lib/visualizer/* if needed
└─ Test: pnpm knip --no-progress (should show 0 unused files)
```

**Expected Result**: No duplicate components, 15+ files removed, leaner codebase

#### Phase 4: OPTIMIZATION & TESTING (1-2 days)

**Goal**: Verify all changes work correctly

```
Task 4.1: Integration testing
├─ Test: All auth redirects work correctly
├─ Test: All capability checks function
├─ Test: All page renders without errors
├─ Test: Component consolidation displays correctly
└─ Files to test: All pages + features

Task 4.2: Run quality gates
├─ Run: pnpm lint
├─ Run: pnpm typecheck
├─ Run: pnpm prisma:validate
├─ Run: pnpm build
├─ Run: pnpm test
├─ Run: pnpm knip --no-progress (expect 0 unused)
└─ Fix: Any issues found

Task 4.3: Performance validation
├─ No lighthouse regressions
├─ Component render performance stable
├─ Bundle size reduction (due to deleted files)
└─ Verify: With pnpm build --analyze

Task 4.4: Documentation
├─ Update: _ARCHITECTURE_AND_UX_ANALYSIS.md with completed changes
├─ Update: Any relevant .agents/docs/ files
└─ Create: PR summary for review
```

**Expected Result**: All tests passing, zero warnings, cleaner bundle

### 6.2 File Change Matrix

**Delete** (19 files)

```
components/visualizer/visualizer-skeletons.tsx
components/billing/manage/invoice-lifecycle-panel.tsx
components/catalog/wrap-images/wrap-gallery-manager.tsx
components/catalog/wrap-images/wrap-image-card.tsx
components/catalog/wrap-images/wrap-image-list.tsx
components/settings/settings-empty-state.tsx
components/catalog/catalog-page-header.tsx
components/billing/invoices-dashboard-header.tsx
components/scheduling/scheduling-dashboard-header.tsx
components/settings/settings-page-header.tsx
lib/cache/cache-keys.ts
lib/cache/visualizer-cache.ts
lib/visualizer/asset-delivery.ts
lib/visualizer/fallback/*.ts (3 files)
lib/visualizer/huggingface/*.ts (2 files)
lib/visualizer/prompting/*.ts
lib/db/selects/visualizer.selects.ts
+ 103 unused exports (scattered across files)
```

**Create** (5 files)

```
components/shared/workspace-filter-toolbar.tsx
components/ui/skeletons/grid-skeleton.tsx
components/ui/skeletons/table-skeleton.tsx
components/ui/skeletons/stats-skeleton.tsx
components/ui/skeletons/index.ts
```

**Modify** (Major Changes to 25+ files)

```
// Auth/authz updates
app/(tenant)/platform/page.tsx (+ all sub-routes)
app/(tenant)/admin/page.tsx (+ all sub-routes)
app/(tenant)/settings/account/page.tsx
app/(tenant)/settings/data/page.tsx
app/(tenant)/billing/page.tsx
app/(tenant)/scheduling/page.tsx
app/(tenant)/visualizer/page.tsx

// Capability renaming (lib/authz + all features/pages)
lib/authz/capabilities.ts
lib/authz/policy.ts
features/billing/**/*.tsx (update imports)
features/scheduling/**/*.tsx (update imports)
features/catalog/**/*.tsx (update imports)

// Component consolidation (features + components)
features/billing/invoices-dashboard-page-feature.tsx
features/scheduling/scheduling-dashboard-page-feature.tsx
features/catalog/catalog-browse-page-feature.tsx
features/settings/profile-settings-page-feature.tsx
features/admin/admin-dashboard-page-feature.tsx
All filter toolbars and headers (update imports)

// Package cleanup
package.json (remove @gradio/client)
```

### 6.3 Dependencies Between Changes

```
Phase 1 (Security) — INDEPENDENT
├─ Can start immediately
└─ No dependencies on other phases

↓ CRITICAL

Phase 2 (Standardization) — DEPENDS ON Phase 1
├─ Requires Phase 1 auth checks to be in place
├─ Capability renaming can start in parallel with Phase 1
└─ Testing ensures no regressions

↓

Phase 3 (Consolidation) — DEPENDS ON Phase 2
├─ Requires stable auth patterns first
├─ Component consolidation independent within phase
└─ Can parallelize file deletions + component creation

↓

Phase 4 (Testing) — DEPENDS ON ALL phases
├─ Runs after all changes applied
├─ Quality gate validation
└─ No more changes after this
```

### 6.4 Risk Mitigations

| Risk                                            | Likelihood | Impact | Mitigation                              |
| ----------------------------------------------- | ---------- | ------ | --------------------------------------- |
| Auth changes break pages                        | Medium     | High   | Comprehensive testing of all routes     |
| Component consolidation breaks existing renders | Low        | Medium | Render tests, visual regression testing |
| Dead code deletion breaks something             | Low        | Low    | Search for all usages before deletion   |
| Capability rename causes type errors            | High       | Low    | TypeScript enforces at compile time     |
| Package removal breaks build                    | Low        | Low    | Run pnpm build before committing        |

---

## 7. SUMMARY & PRIORITIES

### 7.1 Quick Wins (Pre-Implementation)

1. ✅ **Document current patterns** (THIS DOCUMENT) — DONE
2. ✅ **Identify dead code** — knip.out.txt shows 15 unused files
3. ✅ **Identify consolidation opportunities** — 5+ component duplicates

### 7.2 Top 3 Actions for Next Sprint

1. **🔴 CRITICAL**: Add auth checks to platform and admin routes (Phase 1, Task 1.1-1.2)
    - Security vulnerability if not done immediately
    - 2 files modified, 5 lines added total

2. **🔴 CRITICAL**: Standardize capability naming (Phase 2, Task 2.1)
    - Foundation for all other auth improvements
    - 2 files modified, 10+ references updated
    - Drives consistency across 4 domains

3. **🟠 HIGH**: Delete component duplicates (Phase 3, Task 3.1-3.2)
    - Quick win: remove 5 wrapper components
    - 5 files deleted, 8 files updated
    - Immediate maintenance improvement

### 7.3 Metrics for Success

| Metric                          | Before | After | Target  |
| ------------------------------- | ------ | ----- | ------- |
| Unused files                    | 15     | 0     | 0       |
| Unused exports                  | 103+   | 0     | 0       |
| Duplicate components            | 5+     | 0     | 0       |
| Unsecured admin/platform routes | 100%   | 0%    | 0%      |
| Auth check consistency          | 60%    | 100%  | 100%    |
| TypeScript errors               | TBD    | 0     | 0       |
| Lint warnings                   | TBD    | 0     | 0       |
| Bundle size reduction           | —      | ~50KB | Measure |

### 7.4 Owner Assignment Recommendations

| Phase              | Owner                           | Effort   | Duration |
| ------------------ | ------------------------------- | -------- | -------- |
| 1: Security        | Backend-focused dev             | 1 point  | 1 day    |
| 2: Standardization | Type-safe dev (TS expert)       | 3 points | 2 days   |
| 3: Consolidation   | Frontend dev (component expert) | 3 points | 2 days   |
| 4: Testing & QA    | QA + Full stack                 | 2 points | 1 day    |

---

## 8. APPENDIX: DEEP DIVES

### A. Auth/Authz Policy Functions

**Current Functions in `lib/authz/policy.ts`**:

- `hasCapability(context, capability)` → boolean
- `requireCapability(context, capability)` → throws if false
- `requireOwnerOrAdmin(context)` → throws if false
- `requirePlatformAdmin(context)` → throws if false
- `canAccessCustomerOwnedResource(context, customerId)` → boolean
- `requireCustomerOwnedResourceAccess(context, customerId)` → throws if false

**Missing Functions** (should be created):

- `requireBillingAccess(context)` → for billing managers
- `requireSchedulingAccess(context)` → for scheduling managers
- `canAccessPublicCatalog(context)` → for browse-only users

### B. Capability Matrix

```typescript
// Proposed final capability structure
type Capability =
  | 'catalog.read'     // Browse wraps
  | 'catalog.manage'   // Create/edit/publish wraps
  | 'billing.read'     // View invoices
  | 'billing.write'    // Manage invoices
  | 'scheduling.read'  // View bookings
  | 'scheduling.write' // Manage bookings
  | 'visualizer.use'   // Generate previews
  | 'settings.read'    // View settings
  | 'settings.write'   // Modify settings
  | 'admin.access'     // Admin dashboard
  | 'platform.access'  // Platform tools

// Role mapping
{
  owner: ALL capabilities
  admin: ALL capabilities except some platform-specific
  developer: catalog.read, scheduling.read, visualizer.use, platform.access
  user: catalog.read, scheduling.read, visualizer.use
}
```

### C. Component Consolidation Checklist

```
☐ Delete SettingsEmptyState
  ☐ Update: features/settings/account-settings-page-feature.tsx
  ☐ Update: features/settings/data-export-page-feature.tsx
  ☐ Verify: WorkspaceEmptyState renders identically

☐ Delete 5 page header wrappers
  ☐ Update: All 5 feature components to use WorkspacePageIntro directly
  ☐ Verify: No visual changes
  ☐ Test: All pages render

☐ Create WorkspaceFilterToolbar abstraction
  ☐ Extract from: InvoicesDashboardToolbar, SchedulingDashboardToolbar
  ☐ Accept: title, description, children (filters)
  ☐ Update: 2 domains to use it

☐ Consolidate skeleton loaders
  ☐ Create: components/ui/skeletons/generic-*.tsx
  ☐ Delete: 15+ domain-specific skeleton files
  ☐ Update: All imports across domains
```

---

**END OF ANALYSIS DOCUMENT**

This comprehensive plan is ready for implementation. Start with Phase 1 (Security) immediately, then follow the dependency chain through Phases 2-4.
