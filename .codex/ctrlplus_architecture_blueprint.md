# CtrlPlus Server-First Architecture Blueprint

## Purpose

This document defines the target architecture for CtrlPlus using a strict **pages → features → components → shadcn/ui** layering model, backed by **types + schemas + lib + Prisma** as the application contract and server authority.

This is written for **agentic development workflows**, including one-shot refactors, YOLO mode execution, and prompt-driven implementation passes where the agent must make correct structural decisions without improvising a new architecture.

---

# 1. Core mental model

## The stack, in one sentence

- `app/` owns route shells and Next.js file conventions
- `features/` own orchestration and page/view assembly
- `components/` own reusable pure UI blocks
- `components/ui/` owns shadcn primitives only
- `lib/` owns reads, writes, auth, authz, integrations, cache, uploads, and DB boundaries
- `schemas/` own runtime validation
- `types/` own DTO contracts and client/server type boundaries
- `prisma/` owns the canonical data model

## The execution rule

**Never solve a boundary problem by blurring layers.**

If something feels ambiguous, do not stuff it into the nearest file. Instead, classify it:

- route shell problem → `app/`
- orchestration problem → `features/`
- reusable presentational problem → `components/`
- primitive UI problem → `components/ui/`
- server read problem → `lib/fetchers/`
- server write problem → `lib/actions/`
- DB query shape problem → `lib/db/selects/`
- DB mutation primitive problem → `lib/db/transactions/`
- validation problem → `schemas/`
- DTO/type problem → `types/`
- provider boundary problem → `lib/integrations/`
- upload/image/storage problem → `lib/uploads/`

---

# 2. Architectural laws

## Law 1 — `app/` is orchestration-only

`app/**` is for:
- route segments
- route groups
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- thin `page.tsx`
- API `route.ts`

`app/**` is **not** for:
- Prisma access
- business logic
- DTO shaping
- mutation logic
- authz decision trees beyond route gating
- provider SDK logic
- heavy UI composition

## Law 2 — pages are thin

A route `page.tsx` should usually do only these things:
- accept `params` / `searchParams`
- do route-level auth redirect if necessary
- import a feature
- hand off all assembly to the feature

## Law 3 — features own orchestration

`features/**` are the application layer between route shells and reusable UI.

Features may:
- call fetchers
- call server actions indirectly through client subfeatures or forms
- shape screen data from DTOs
- compose reusable components
- place Suspense boundaries
- own route-specific client interactivity
- wire RHF, transitions, polling, optimistic UI

Features must **not** become a dumping ground for generic shared UI.

## Law 4 — components are pure UI blocks

`components/<domain>/**` are reusable building blocks made from shadcn primitives and shared blocks.

Components may:
- render cards, tables, headers, grids, tabs, shells, field groups, charts, panels, empty states
- accept already-shaped data
- accept callbacks from parent orchestration

Components should **not**:
- call Prisma
- enforce authz
- own business mutation semantics
- parse server inputs
- invent cache policy

## Law 5 — `components/ui/**` is shadcn territory only

This layer contains:
- primitive reusable UI
- low-level wrappers around Radix/shadcn patterns
- no domain semantics

Do not place domain blocks in `components/ui/**`.

## Law 6 — all server reads go through fetchers

`lib/fetchers/**` are the read-side authority.

Fetchers are responsible for:
- DB reads
- authz-aware read access
- select reuse
- mapping records into DTOs/view models
- cache semantics for read paths

## Law 7 — all server writes go through actions

`lib/actions/**` are the write-side authority.

Actions are responsible for:
1. authenticate
2. authorize
3. parse input with schema
4. execute transaction or write logic
5. write audit logs if needed
6. revalidate cache / paths
7. return typed result or redirect

## Law 8 — schemas are the runtime contract

All server inputs must be validated using Zod schemas from `schemas/**`.

Client validation can mirror server validation, but it never replaces it.

## Law 9 — DTOs live in `types/**`

Transport-safe application contracts live in `types/**`.

All DTO timestamps should use:

```ts
export type Timestamp = string
```

Browser-only types belong in `*.client.types.ts`.

## Law 10 — Prisma stays behind lib boundaries

Prisma is canonical, but Prisma objects do not flow directly into UI.

Use:
- `lib/db/selects/*` for query shapes
- `lib/fetchers/*` for DB reads and DTO mapping
- `lib/db/transactions/*` for reusable write primitives
- `lib/actions/*` for mutation orchestration

---

# 3. Canonical top-level architecture tree

```txt
app/                # route shells only
features/           # orchestration layer
components/         # pure reusable UI blocks
components/ui/      # shadcn primitives only
lib/                # server authority: reads, writes, auth, db, uploads, integrations
schemas/            # zod runtime contracts
types/              # dto contracts and client/server type boundaries
prisma/             # canonical data model and migrations
```

---

# 4. Canonical `app/` tree with comments

```txt
app/
├─ (auth)/                          # public auth route group
│  ├─ layout.tsx                    # auth shell layout
│  ├─ loading.tsx                   # auth shell skeleton
│  ├─ error.tsx                     # auth boundary fallback
│  ├─ not-found.tsx                 # auth route 404
│  ├─ sign-in/
│  │  └─ [[...sign-in]]/
│  │     └─ page.tsx                # thin page -> features/auth/sign-in-page-feature
│  └─ sign-up/
│     └─ [[...sign-up]]/
│        └─ page.tsx                # thin page -> features/auth/sign-up-page-feature
│
├─ (tenant)/                        # authenticated application shell
│  ├─ layout.tsx                    # tenant app chrome, nav, sidebar, auth gate
│  ├─ loading.tsx                   # tenant shell skeleton
│  ├─ error.tsx                     # tenant route-group fallback
│  │
│  ├─ dashboard/
│  │  └─ page.tsx                   # thin page -> features/dashboard/tenant-dashboard-page-feature
│  │
│  ├─ catalog/
│  │  ├─ loading.tsx                # gallery route skeleton
│  │  ├─ error.tsx                  # catalog route error boundary
│  │  ├─ not-found.tsx              # wrap not found fallback
│  │  ├─ page.tsx                   # wraps gallery page -> features/catalog/catalog-gallery-page-feature
│  │  ├─ [wrapId]/
│  │  │  └─ page.tsx                # wrap detail -> features/catalog/catalog-wrap-detail-page-feature
│  │  └─ manage/
│  │     ├─ loading.tsx             # manager dashboard skeleton
│  │     ├─ error.tsx               # manager error boundary
│  │     ├─ page.tsx                # wrap manager dashboard -> features/catalog/manage/catalog-manager-page-feature
│  │     ├─ new/
│  │     │  └─ page.tsx             # create wrap -> features/catalog/manage/new-wrap-page-feature
│  │     └─ [wrapId]/
│  │        ├─ page.tsx             # manager wrap detail / command surface
│  │        └─ edit/
│  │           └─ page.tsx          # edit wrap -> features/catalog/manage/edit-wrap-page-feature
│  │
│  ├─ visualizer/
│  │  ├─ loading.tsx                # workspace shell skeleton
│  │  ├─ error.tsx                  # visualizer boundary fallback
│  │  ├─ not-found.tsx              # preview/upload not found fallback
│  │  ├─ page.tsx                   # visualizer workspace -> features/visualizer/visualizer-workspace-page-feature
│  │  ├─ previews/
│  │  │  ├─ page.tsx                # preview gallery -> features/visualizer/previews/preview-gallery-page-feature
│  │  │  ├─ new/
│  │  │  │  └─ page.tsx             # dedicated new preview flow
│  │  │  └─ [previewId]/
│  │  │     ├─ page.tsx             # preview detail -> features/visualizer/previews/preview-detail-page-feature
│  │  │     └─ edit/
│  │  │        └─ page.tsx          # edit preview metadata/settings
│  │  └─ uploads/
│  │     ├─ page.tsx                # uploads gallery -> features/visualizer/uploads/upload-gallery-page-feature
│  │     └─ [uploadId]/
│  │        └─ page.tsx             # uploaded image detail -> features/visualizer/uploads/upload-detail-page-feature
│  │
│  ├─ scheduling/
│  │  ├─ loading.tsx                # bookings dashboard skeleton
│  │  ├─ error.tsx                  # scheduling route error boundary
│  │  ├─ not-found.tsx              # booking not found
│  │  ├─ page.tsx                   # user bookings dashboard -> features/scheduling/scheduling-dashboard-page-feature
│  │  ├─ new/
│  │  │  └─ page.tsx                # new booking -> features/scheduling/new-booking-page-feature
│  │  ├─ [bookingId]/
│  │  │  ├─ page.tsx                # booking detail -> features/scheduling/booking-detail-page-feature
│  │  │  └─ edit/
│  │  │     └─ page.tsx             # edit booking -> features/scheduling/edit-booking-page-feature
│  │  └─ manage/
│  │     ├─ loading.tsx             # admin manager shell skeleton
│  │     ├─ error.tsx               # admin manager boundary
│  │     ├─ page.tsx                # all-bookings manager -> features/scheduling/manage/bookings-manager-page-feature
│  │     ├─ new/
│  │     │  └─ page.tsx             # create admin-managed booking
│  │     └─ [bookingId]/
│  │        ├─ page.tsx             # admin booking detail / command view
│  │        └─ edit/
│  │           └─ page.tsx          # admin booking edit/lifecycle flow
│  │
│  ├─ invoices/
│  │  ├─ loading.tsx                # invoice dashboard skeleton
│  │  ├─ error.tsx                  # invoice route error boundary
│  │  ├─ not-found.tsx              # invoice not found
│  │  ├─ page.tsx                   # user invoice dashboard -> features/invoices/invoices-dashboard-page-feature
│  │  ├─ [invoiceId]/
│  │  │  ├─ page.tsx                # invoice detail -> features/invoices/invoice-detail-page-feature
│  │  │  ├─ pay/
│  │  │  │  └─ page.tsx             # invoice payment flow
│  │  │  ├─ refund/
│  │  │  │  └─ page.tsx             # refund request flow
│  │  │  └─ adjust/
│  │  │     └─ page.tsx             # discount/adjustment request flow
│  │  └─ manage/
│  │     ├─ loading.tsx             # invoice manager skeleton
│  │     ├─ error.tsx               # invoice manager boundary
│  │     ├─ page.tsx                # admin invoice manager -> features/invoices/manage/invoice-manager-page-feature
│  │     ├─ new/
│  │     │  └─ page.tsx             # issue invoice
│  │     └─ [invoiceId]/
│  │        ├─ page.tsx             # admin invoice detail / operations view
│  │        └─ edit/
│  │           └─ page.tsx          # admin invoice edit flow
│  │
│  ├─ admin/
│  │  ├─ layout.tsx                 # optional admin subnav shell
│  │  ├─ loading.tsx                # admin dashboard skeleton
│  │  ├─ error.tsx                  # admin dashboard boundary
│  │  └─ page.tsx                   # admin dashboard -> features/admin/admin-dashboard-page-feature
│  │
│  └─ platform/
│     ├─ layout.tsx                 # optional platform subnav shell
│     ├─ loading.tsx                # platform dashboard skeleton
│     ├─ error.tsx                  # platform dashboard boundary
│     └─ page.tsx                   # platform/dev dashboard -> features/platform/platform-dashboard-page-feature
│
├─ api/
│  ├─ clerk/
│  │  └─ webhook/
│  │     └─ route.ts                # Clerk webhook handler; uses lib/integrations + auth actions
│  └─ stripe/
│     └─ webhook/
│        └─ route.ts                # Stripe webhook handler; uses billing/platform boundaries
│
├─ layout.tsx                       # root html/body/providers shell
├─ loading.tsx                      # root instant nav fallback
├─ error.tsx                        # global recoverable error boundary
├─ not-found.tsx                    # global 404
├─ page.tsx                         # public marketing/landing route
├─ globals.css                      # global styles and tokens
└─ favicon.ico
```

---

# 5. Canonical `features/` tree with comments

```txt
features/
├─ auth/
│  ├─ sign-in-page-feature.tsx                # server feature for sign-in page composition
│  ├─ sign-up-page-feature.tsx                # server feature for sign-up page composition
│  ├─ sign-in-form.client.tsx                 # RHF + transitions + submit orchestration
│  └─ sign-up-form.client.tsx                 # RHF + transitions + submit orchestration
│
├─ dashboard/
│  └─ tenant-dashboard-page-feature.tsx       # authenticated app home dashboard feature
│
├─ catalog/
│  ├─ catalog-gallery-page-feature.tsx        # gallery page server orchestration
│  ├─ catalog-wrap-detail-page-feature.tsx    # wrap detail server orchestration
│  ├─ catalog-wrap-detail-tabs.client.tsx     # client-side tabs / detail interactions
│  ├─ catalog-filters.client.tsx              # URL-driven filters, search, sort
│  ├─ catalog-pagination.client.tsx           # pagination interactivity
│  └─ manage/
│     ├─ catalog-manager-page-feature.tsx     # admin command-and-control wraps manager
│     ├─ catalog-manager-toolbar.client.tsx   # search, filters, tabs, actions
│     ├─ catalog-manager-table.client.tsx     # interactive table state
│     ├─ catalog-manager-bulk-actions.client.tsx
│     ├─ catalog-manager-search.client.tsx
│     ├─ new-wrap-page-feature.tsx            # server page orchestration for create flow
│     ├─ edit-wrap-page-feature.tsx           # server page orchestration for edit flow
│     ├─ wrap-editor-form.client.tsx          # RHF container; calls catalog actions
│     ├─ wrap-gallery-manager.client.tsx      # client image ordering / management UX
│     ├─ wrap-image-upload.client.tsx         # upload UX orchestration
│     ├─ wrap-publish-controls.client.tsx     # publish/unpublish + readiness UX
│     └─ wrap-asset-readiness.client.tsx      # readiness state UX
│
├─ visualizer/
│  ├─ visualizer-workspace-page-feature.tsx   # main workspace server assembly
│  ├─ visualizer-workspace-shell.client.tsx   # client shell for tool panels / tabs / status
│  ├─ visualizer-controls.client.tsx          # generate / regenerate / select actions
│  ├─ visualizer-settings-panel.client.tsx    # client-side workspace settings state
│  ├─ visualizer-generation-toolbar.client.tsx
│  ├─ visualizer-preview-poller.client.tsx    # status-driven polling loop
│  ├─ previews/
│  │  ├─ preview-gallery-page-feature.tsx     # previews list server feature
│  │  ├─ preview-detail-page-feature.tsx      # single preview detail server feature
│  │  ├─ preview-gallery-filters.client.tsx
│  │  ├─ preview-gallery-table.client.tsx
│  │  ├─ preview-detail-tabs.client.tsx
│  │  ├─ new-preview-page-feature.tsx
│  │  ├─ edit-preview-page-feature.tsx
│  │  └─ preview-editor-form.client.tsx
│  └─ uploads/
│     ├─ upload-gallery-page-feature.tsx      # uploads list server feature
│     ├─ upload-detail-page-feature.tsx       # upload detail server feature
│     ├─ upload-gallery-filters.client.tsx
│     ├─ upload-gallery-table.client.tsx
│     ├─ upload-detail-tabs.client.tsx
│     ├─ upload-manager.client.tsx
│     └─ upload-actions.client.tsx
│
├─ scheduling/
│  ├─ scheduling-dashboard-page-feature.tsx   # user bookings dashboard
│  ├─ scheduling-dashboard-filters.client.tsx
│  ├─ scheduling-dashboard-table.client.tsx
│  ├─ new-booking-page-feature.tsx
│  ├─ booking-detail-page-feature.tsx
│  ├─ edit-booking-page-feature.tsx
│  ├─ booking-form.client.tsx                 # RHF booking flow
│  ├─ booking-calendar.client.tsx             # calendar/time selection UI logic
│  ├─ booking-slot-picker.client.tsx          # slot selection interactivity
│  ├─ booking-detail-tabs.client.tsx
│  └─ manage/
│     ├─ bookings-manager-page-feature.tsx    # admin bookings manager
│     ├─ bookings-manager-toolbar.client.tsx
│     ├─ bookings-manager-table.client.tsx
│     ├─ bookings-manager-filters.client.tsx
│     ├─ bookings-manager-bulk-actions.client.tsx
│     ├─ new-managed-booking-page-feature.tsx
│     ├─ edit-managed-booking-page-feature.tsx
│     ├─ managed-booking-form.client.tsx
│     ├─ booking-status-actions.client.tsx
│     └─ booking-notification-controls.client.tsx
│
├─ invoices/
│  ├─ invoices-dashboard-page-feature.tsx     # user invoices dashboard
│  ├─ invoices-dashboard-filters.client.tsx
│  ├─ invoices-dashboard-table.client.tsx
│  ├─ invoice-detail-page-feature.tsx
│  ├─ invoice-detail-tabs.client.tsx
│  ├─ invoice-pay-page-feature.tsx
│  ├─ invoice-pay-form.client.tsx
│  ├─ invoice-refund-page-feature.tsx
│  ├─ invoice-refund-form.client.tsx
│  ├─ invoice-adjust-page-feature.tsx
│  ├─ invoice-adjust-form.client.tsx
│  └─ manage/
│     ├─ invoice-manager-page-feature.tsx     # admin invoice operations dashboard
│     ├─ invoice-manager-toolbar.client.tsx
│     ├─ invoice-manager-table.client.tsx
│     ├─ invoice-manager-filters.client.tsx
│     ├─ invoice-manager-bulk-actions.client.tsx
│     ├─ new-invoice-page-feature.tsx
│     ├─ edit-invoice-page-feature.tsx
│     ├─ invoice-editor-form.client.tsx
│     ├─ invoice-lifecycle-actions.client.tsx
│     └─ invoice-notification-controls.client.tsx
│
├─ admin/
│  ├─ admin-dashboard-page-feature.tsx        # admin dashboard assembly
│  ├─ admin-kpi-grid-feature.tsx
│  ├─ admin-activity-panel-feature.tsx
│  └─ admin-quick-actions.client.tsx
│
└─ platform/
   ├─ platform-dashboard-page-feature.tsx     # platform/dev dashboard assembly
   ├─ platform-health-overview-feature.tsx
   ├─ platform-webhook-monitor-feature.tsx
   ├─ platform-job-tools-feature.tsx
   ├─ platform-db-tools-feature.tsx
   ├─ platform-visualizer-tools-feature.tsx
   └─ platform-actions.client.tsx
```

## Feature responsibilities

A feature may:
- import fetchers
- import types and schemas
- import components
- place Suspense boundaries
- coordinate multiple components into one route experience
- own route-specific client containers (`*.client.tsx`)

A feature should **not**:
- become a generic shared component library
- call Prisma directly
- own provider SDK configuration
- replace schema validation with client assumptions
- hide authz or cache invalidation inside UI blocks

---

# 6. Canonical `components/` tree with comments

```txt
components/
├─ auth/
│  ├─ auth-shell.tsx                         # auth page shell block
│  ├─ sign-in-form-fields.tsx                # pure field group
│  ├─ sign-up-form-fields.tsx                # pure field group
│  └─ auth-side-panel.tsx                    # side illustration / marketing panel
│
├─ dashboard/
│  ├─ tenant-dashboard-hero.tsx             # hero / headline block
│  ├─ tenant-dashboard-grid.tsx             # dashboard layout grid
│  ├─ tenant-dashboard-card.tsx             # summary card
│  └─ tenant-dashboard-links.tsx            # quick links/actions
│
├─ catalog/
│  ├─ catalog-page-header.tsx               # gallery page heading block
│  ├─ catalog-toolbar.tsx                   # search/filter/sort shell
│  ├─ catalog-filter-bar.tsx                # reusable filter UI block
│  ├─ catalog-sort-select.tsx               # sort control
│  ├─ catalog-pagination.tsx                # pagination UI only
│  ├─ wrap-gallery-grid.tsx                 # wrap cards grid
│  ├─ wrap-gallery-card.tsx                 # hero image + summary card
│  ├─ wrap-hero-card.tsx                    # featured wrap card
│  ├─ wrap-status-badge.tsx
│  ├─ wrap-detail-header.tsx                # detail hero/header
│  ├─ wrap-detail-carousel.tsx              # image carousel block
│  ├─ wrap-detail-summary.tsx               # pricing/details summary block
│  ├─ wrap-detail-specs.tsx                 # metadata/specs block
│  ├─ wrap-detail-tabs.tsx                  # tabs shell only
│  ├─ wrap-related-grid.tsx                 # related wraps block
│  ├─ wrap-form/
│  │  ├─ wrap-form-shell.tsx                # layout shell for wrap forms
│  │  ├─ wrap-form-fields.tsx               # common wrap fields
│  │  ├─ wrap-pricing-fields.tsx
│  │  ├─ wrap-details-fields.tsx
│  │  ├─ wrap-category-fields.tsx
│  │  ├─ wrap-publish-fields.tsx
│  │  └─ wrap-form-actions.tsx
│  ├─ wrap-images/
│  │  ├─ wrap-gallery-manager.tsx           # image manager block
│  │  ├─ wrap-image-carousel-manager.tsx
│  │  ├─ wrap-image-uploader.tsx
│  │  ├─ wrap-image-card.tsx
│  │  ├─ wrap-image-list.tsx
│  │  └─ wrap-image-actions.tsx
│  └─ manage/
│     ├─ catalog-manager-header.tsx         # manager page header
│     ├─ catalog-manager-toolbar.tsx        # manager toolbar block
│     ├─ catalog-manager-table.tsx          # table block only
│     ├─ catalog-manager-row-actions.tsx
│     ├─ catalog-manager-stats.tsx
│     ├─ catalog-command-panel.tsx
│     └─ wrap-asset-readiness-panel.tsx
│
├─ visualizer/
│  ├─ workspace/
│  │  ├─ visualizer-workspace-header.tsx    # workspace heading block
│  │  ├─ visualizer-workspace-layout.tsx    # multi-panel layout shell
│  │  ├─ visualizer-controls-panel.tsx      # controls block
│  │  ├─ visualizer-settings-card.tsx       # settings UI card
│  │  ├─ visualizer-generation-actions.tsx  # action buttons block
│  │  ├─ visualizer-preview-canvas.tsx      # output display block
│  │  ├─ visualizer-status-panel.tsx        # status + retry UI
│  │  └─ visualizer-empty-state.tsx
│  ├─ previews/
│  │  ├─ preview-gallery-header.tsx
│  │  ├─ preview-gallery-toolbar.tsx
│  │  ├─ preview-gallery-grid.tsx
│  │  ├─ preview-gallery-table.tsx
│  │  ├─ preview-card.tsx
│  │  ├─ preview-status-badge.tsx
│  │  ├─ preview-detail-header.tsx
│  │  ├─ preview-detail-canvas.tsx
│  │  ├─ preview-detail-metadata.tsx
│  │  ├─ preview-detail-tabs.tsx
│  │  └─ preview-actions.tsx
│  ├─ uploads/
│  │  ├─ upload-gallery-header.tsx
│  │  ├─ upload-gallery-toolbar.tsx
│  │  ├─ upload-gallery-grid.tsx
│  │  ├─ upload-gallery-table.tsx
│  │  ├─ upload-card.tsx
│  │  ├─ upload-detail-header.tsx
│  │  ├─ upload-detail-preview.tsx
│  │  ├─ upload-detail-metadata.tsx
│  │  └─ upload-actions-panel.tsx
│  └─ forms/
│     ├─ preview-form-shell.tsx
│     ├─ preview-form-fields.tsx
│     ├─ preview-settings-fields.tsx
│     ├─ upload-form-shell.tsx
│     ├─ upload-form-fields.tsx
│     └─ upload-dropzone.tsx
│
├─ scheduling/
│  ├─ scheduling-dashboard-header.tsx
│  ├─ scheduling-dashboard-toolbar.tsx
│  ├─ scheduling-dashboard-table.tsx
│  ├─ scheduling-dashboard-stats.tsx
│  ├─ booking-card.tsx
│  ├─ booking-status-badge.tsx
│  ├─ booking-detail-header.tsx
│  ├─ booking-detail-summary.tsx
│  ├─ booking-detail-timeline.tsx
│  ├─ booking-detail-tabs.tsx
│  ├─ booking-form/
│  │  ├─ booking-form-shell.tsx
│  │  ├─ booking-form-fields.tsx
│  │  ├─ booking-date-fields.tsx
│  │  ├─ booking-contact-fields.tsx
│  │  ├─ booking-notes-fields.tsx
│  │  ├─ booking-calendar.tsx
│  │  ├─ booking-slot-picker.tsx
│  │  └─ booking-form-actions.tsx
│  └─ manage/
│     ├─ bookings-manager-header.tsx
│     ├─ bookings-manager-toolbar.tsx
│     ├─ bookings-manager-table.tsx
│     ├─ bookings-manager-row-actions.tsx
│     ├─ bookings-manager-stats.tsx
│     ├─ booking-command-panel.tsx
│     ├─ booking-notification-panel.tsx
│     └─ booking-lifecycle-panel.tsx
│
├─ invoices/
│  ├─ invoices-dashboard-header.tsx
│  ├─ invoices-dashboard-toolbar.tsx
│  ├─ invoices-dashboard-table.tsx
│  ├─ invoices-dashboard-stats.tsx
│  ├─ invoice-status-badge.tsx
│  ├─ invoice-summary-card.tsx
│  ├─ invoice-detail-header.tsx
│  ├─ invoice-detail-summary.tsx
│  ├─ invoice-line-items-table.tsx
│  ├─ invoice-payment-panel.tsx
│  ├─ invoice-detail-tabs.tsx
│  ├─ invoice-form/
│  │  ├─ invoice-form-shell.tsx
│  │  ├─ invoice-form-fields.tsx
│  │  ├─ invoice-line-item-fields.tsx
│  │  ├─ invoice-adjustment-fields.tsx
│  │  ├─ invoice-discount-fields.tsx
│  │  ├─ invoice-notification-fields.tsx
│  │  └─ invoice-form-actions.tsx
│  └─ manage/
│     ├─ invoice-manager-header.tsx
│     ├─ invoice-manager-toolbar.tsx
│     ├─ invoice-manager-table.tsx
│     ├─ invoice-manager-row-actions.tsx
│     ├─ invoice-manager-stats.tsx
│     ├─ invoice-command-panel.tsx
│     ├─ invoice-lifecycle-panel.tsx
│     └─ invoice-notification-panel.tsx
│
├─ admin/
│  ├─ admin-page-header.tsx
│  ├─ admin-kpi-grid.tsx
│  ├─ admin-kpi-card.tsx
│  ├─ admin-chart-panel.tsx
│  ├─ admin-activity-feed.tsx
│  ├─ admin-quick-links.tsx
│  └─ admin-action-panel.tsx
│
├─ platform/
│  ├─ platform-page-header.tsx
│  ├─ platform-kpi-grid.tsx
│  ├─ platform-kpi-card.tsx
│  ├─ platform-health-panel.tsx
│  ├─ platform-webhook-panel.tsx
│  ├─ platform-db-tools-panel.tsx
│  ├─ platform-job-tools-panel.tsx
│  ├─ platform-visualizer-tools-panel.tsx
│  ├─ platform-user-tools-panel.tsx
│  └─ platform-action-panel.tsx
│
├─ shared/
│  ├─ app-page-header.tsx                    # generic page heading block
│  ├─ app-page-shell.tsx                     # generic page shell block
│  ├─ app-section.tsx
│  ├─ empty-state.tsx
│  ├─ search-input.tsx
│  ├─ filter-bar.tsx
│  ├─ pagination-controls.tsx
│  ├─ status-badge.tsx
│  ├─ kpi-card.tsx
│  ├─ stats-grid.tsx
│  ├─ command-toolbar.tsx
│  ├─ detail-header.tsx
│  ├─ detail-metadata-list.tsx
│  ├─ form-section.tsx
│  ├─ form-actions-row.tsx
│  ├─ upload-dropzone.tsx
│  ├─ image-carousel.tsx
│  ├─ data-table-shell.tsx
│  ├─ row-actions-menu.tsx
│  ├─ confirm-action-dialog.tsx
│  ├─ side-panel.tsx
│  ├─ tenant-sidebar.tsx
│  ├─ tenant-nav-config.ts
│  ├─ logo-mark.tsx
│  ├─ logo-icon.tsx
│  ├─ site-header.tsx
│  └─ site-footer.tsx
│
└─ ui/
   ├─ accordion.tsx                         # shadcn primitive
   ├─ alert-dialog.tsx
   ├─ badge.tsx
   ├─ breadcrumb.tsx
   ├─ button.tsx
   ├─ card.tsx
   ├─ chart.tsx
   ├─ checkbox.tsx
   ├─ collapsible.tsx
   ├─ dialog.tsx
   ├─ drawer.tsx
   ├─ dropdown-menu.tsx
   ├─ field.tsx
   ├─ form.tsx
   ├─ input.tsx
   ├─ label.tsx
   ├─ navigation-menu.tsx
   ├─ popover.tsx
   ├─ progress.tsx
   ├─ scroll-area.tsx
   ├─ select.tsx
   ├─ separator.tsx
   ├─ sheet.tsx
   ├─ sidebar.tsx
   ├─ skeleton.tsx
   ├─ table.tsx
   ├─ tabs.tsx
   ├─ textarea.tsx
   ├─ toast.tsx
   └─ tooltip.tsx
```

## Component responsibilities

### `components/<domain>/**`
Use for reusable domain blocks:
- grids
- cards
- tables
- page headers
- status badges
- detail blocks
- tabs shells
- field groups
- stats panels
- manager panels

### `components/shared/**`
Use for cross-domain reusable blocks:
- page shells
- pagination controls
- search input
- data table shell
- empty states
- form section wrappers
- confirm dialogs
- nav blocks

### `components/ui/**`
Use only for shadcn/radix primitives or near-primitives.

---

# 7. Canonical `lib/` tree with roles and boundaries

```txt
lib/
├─ actions/                     # server mutations only
│  ├─ auth.actions.ts
│  ├─ scheduling.actions.ts
│  ├─ billing.actions.ts
│  ├─ settings.actions.ts
│  ├─ admin.actions.ts
│  ├─ catalog.actions.ts
│  ├─ visualizer.actions.ts
│  └─ platform.actions.ts
│
├─ fetchers/                    # server reads only
│  ├─ auth.fetchers.ts
│  ├─ scheduling.fetchers.ts
│  ├─ billing.fetchers.ts
│  ├─ settings.fetchers.ts
│  ├─ admin.fetchers.ts
│  ├─ catalog.fetchers.ts
│  ├─ catalog.mappers.ts       # read-model/DTO mapping helpers for catalog
│  ├─ visualizer.fetchers.ts
│  ├─ visualizer.mappers.ts    # read-model/DTO mapping helpers for visualizer
│  └─ platform.fetchers.ts
│
├─ auth/                        # identity and session helpers
│  ├─ session.ts
│  ├─ identity.ts
│  ├─ redirect.ts
│  └─ clerk.ts
│
├─ authz/                       # policy and guard boundary
│  ├─ guards.ts
│  ├─ policy.ts
│  └─ capabilities.ts
│
├─ db/
│  ├─ prisma.ts                 # Prisma client; do not import in UI layers
│  ├─ selects/                  # static select objects only
│  │  ├─ admin.selects.ts
│  │  ├─ auth.selects.ts
│  │  ├─ billing.selects.ts
│  │  ├─ catalog.selects.ts
│  │  ├─ platform.selects.ts
│  │  ├─ scheduling.selects.ts
│  │  ├─ settings.selects.ts
│  │  └─ visualizer.selects.ts
│  └─ transactions/             # reusable DB write primitives
│     ├─ admin.transactions.ts
│     ├─ auth.transactions.ts
│     ├─ billing.transactions.ts
│     ├─ catalog.transactions.ts
│     ├─ platform.transactions.ts
│     ├─ scheduling.transactions.ts
│     ├─ settings.transactions.ts
│     └─ visualizer.transactions.ts
│
├─ cache/
│  ├─ cache-keys.ts             # cache key construction
│  ├─ revalidate-tags.ts        # cache/path invalidation helpers
│  └─ unstable-cache.ts         # cache wrappers if used
│
├─ integrations/                # provider adapters only
│  ├─ blob.ts                   # storage abstraction boundary
│  ├─ clerk.ts                  # Clerk adapter/webhook helpers
│  ├─ cloudinary.ts             # legacy/provider-specific storage adapter
│  ├─ huggingface.ts            # inference adapter boundary
│  └─ stripe.ts                 # Stripe client + env helpers
│
├─ uploads/                     # file/image/storage orchestration
│  ├─ file-validation.ts
│  ├─ image-processing.ts
│  └─ storage.ts
│
├─ utils/                       # generic stateless helpers only
│  ├─ assertions.ts
│  ├─ cn.ts
│  ├─ currency.ts
│  ├─ dates.ts
│  ├─ pagination.ts
│  └─ search-params.ts
│
└─ constants/
   ├─ app.ts                    # app constants, defaults, routes
   ├─ permissions.ts
   └─ statuses.ts
```

## Observed and enforced realities from the existing codebase

### `lib/actions/*`
These files already act as server mutation boundaries and consistently show the intended pattern:
- session/auth requirement
- authz guard/policy use
- Zod parse
- Prisma write/transaction
- audit log write
- cache revalidation
- typed DTO result

### `lib/fetchers/*`
These files already act as read authority and include:
- `server-only`
- authz-aware access
- shared select usage
- DTO creation helpers
- list/detail read flows

### `lib/db/selects/*`
These are the right place for Prisma select objects and should remain static.

### `lib/db/transactions/*`
These are the right place for reusable DB write primitives such as slot-capacity checks or transactional upserts.

### `lib/integrations/*`
Provider boundaries are already mostly correct:
- Stripe is isolated
- Hugging Face is isolated
- storage/provider logic is isolated

### `lib/uploads/*`
The visualizer and catalog asset flows depend on keeping upload validation, image normalization, and persistence outside UI.

---

# 8. `types/`, `schemas/`, and `prisma/` design rules

## `types/`

Use `types/` for:
- DTOs
- shared application contracts
- API response/input types
- server-safe read/write result shapes
- `Timestamp = string`

Use `*.client.types.ts` for:
- `File`
- `Blob`
- `FormData`
- browser event types
- drag/drop types
- client-only upload state contracts

## `schemas/`

Use `schemas/` for:
- Zod schemas
- runtime parsing and validation
- schema-derived infer types
- shared validation across RHF + server action

Do not place server mutation semantics in schemas.

## `prisma/`

`prisma/schema.prisma` is the canonical domain model.

The application stack implied by the existing codebase includes at least these major domain entities:
- user / auth / membership / role context
- website settings
- bookings and booking reservations
- invoices and payments
- wrap catalog, images, categories, mappings
- visualizer previews and associated media
- webhook event persistence and audit logs
- availability rules and scheduling capacity

The UI must consume DTOs shaped from these entities, not raw Prisma records.

---

# 9. Route → feature → component → UI flow

## Standard flow

```txt
app/(tenant)/catalog/[wrapId]/page.tsx
  -> features/catalog/catalog-wrap-detail-page-feature.tsx
    -> features/catalog/catalog-wrap-detail-tabs.client.tsx   # only if interactive
    -> components/catalog/wrap-detail-header.tsx
    -> components/catalog/wrap-detail-carousel.tsx
    -> components/catalog/wrap-detail-summary.tsx
    -> components/catalog/wrap-detail-tabs.tsx
      -> components/ui/card.tsx
      -> components/ui/tabs.tsx
      -> components/ui/button.tsx
```

## Standard list/manager flow

```txt
app/(tenant)/scheduling/manage/page.tsx
  -> features/scheduling/manage/bookings-manager-page-feature.tsx
    -> features/scheduling/manage/bookings-manager-toolbar.client.tsx
    -> features/scheduling/manage/bookings-manager-table.client.tsx
    -> components/scheduling/manage/bookings-manager-header.tsx
    -> components/scheduling/manage/bookings-manager-toolbar.tsx
    -> components/scheduling/manage/bookings-manager-table.tsx
      -> components/shared/data-table-shell.tsx
      -> components/ui/table.tsx
      -> components/ui/input.tsx
      -> components/ui/select.tsx
      -> components/ui/button.tsx
```

## Standard form flow

```txt
app/(tenant)/catalog/manage/[wrapId]/edit/page.tsx
  -> features/catalog/manage/edit-wrap-page-feature.tsx
    -> features/catalog/manage/wrap-editor-form.client.tsx
      -> uses RHF + zod resolver
      -> submits to lib/actions/catalog.actions.ts
    -> components/catalog/wrap-form/wrap-form-shell.tsx
    -> components/catalog/wrap-form/wrap-form-fields.tsx
    -> components/catalog/wrap-images/wrap-image-uploader.tsx
      -> components/ui/form.tsx
      -> components/ui/field.tsx
      -> components/ui/input.tsx
      -> components/ui/button.tsx
      -> components/ui/card.tsx
```

---

# 10. File-by-file mental model by layer

## `app/`

### `page.tsx`
Thin route entry.

### `layout.tsx`
Persistent shell/layout.

### `loading.tsx`
Instant route-segment loading UI.

### `error.tsx`
Recoverable error boundary.

### `not-found.tsx`
Entity-not-found boundary.

### `route.ts`
HTTP / webhook boundary only.

## `features/`

### `*-page-feature.tsx`
Server route orchestration module.

### `*.client.tsx`
Interactive route-local orchestration.

### `*-poller.client.tsx`
Long-running or status-based client loops.

## `components/`

### `*-header.tsx`
Route or section heading block.

### `*-toolbar.tsx`
UI-only toolbar layout block.

### `*-table.tsx`
Table rendering block.

### `*-grid.tsx`
Card/grid layout block.

### `*-tabs.tsx`
Tabs presentation shell.

### `*-form-shell.tsx`
Shared form layout wrapper.

### `*-form-fields.tsx`
Reusable field groups only.

## `components/ui/`

Primitive composables only.

---

# 11. Loading, Suspense, caching, and RHF rules

## Route loading

Use `app/**/loading.tsx` for:
- immediate navigation feedback
- shell-level skeletons
- segment-level streaming compatibility

### Good skeletons
- dashboard cards
- table shells
- filter bars
- detail page header + card skeletons
- preview canvas skeletons

## Manual Suspense

Use inside `features/**` to split expensive subregions:
- dashboard metrics vs recent activity
- preview canvas vs generation status
- wrap gallery vs side filters
- invoice detail vs payment/history panel

## Caching

Cache ownership belongs on the read side.

- fetchers define read semantics
- cache TTL/tag behavior belongs with fetchers or shared cache helpers
- actions invalidate by tag/path after successful mutation

## RHF

RHF belongs in `features/**/**/*.client.tsx` form containers.

RHF handles:
- form state
- field registration
- client validation feedback
- pending UX

Server actions handle:
- authoritative validation
- auth/authz
- writes
- side effects
- cache invalidation

Field groups in `components/**` do not own mutation logic.

---

# 12. Domain notes from the actual codebase

## Catalog

The current codebase already shows the correct catalog split:
- fetchers for wrap reads
- mappers for read-model shaping and readiness logic
- actions for wrap CRUD, categories, images, publish state
- storage/image-processing integration for media

The target UI shape is:
- customer gallery + wrap detail
- admin manager + image/publish tooling

## Visualizer

The current codebase already shows the correct visualizer server authority:
- preview generation remains server-side
- wrap selection is catalog-backed
- image normalization and persistence live in uploads/integrations
- cache keys and fallback behavior belong below UI

The UI should be explicitly status-driven:
- workspace controls
- preview gallery
- preview detail
- uploads gallery/detail
- polling and retry behavior in client feature containers

## Scheduling

The current codebase already shows:
- slot reservation with transaction isolation
- booking capacity checks in DB transactions
- invoice creation handoff after booking creation
- booking lifecycle actions and reservation cleanup

The UI split should remain:
- user dashboard
- booking detail/edit/new
- admin manager for all bookings

## Invoices / billing

The current codebase already shows:
- Stripe checkout session orchestration
- invoice creation/ensure flow
- webhook processing and idempotency concerns
- invoice state transitions and payment confirmation

The UI split should remain:
- user invoices dashboard/detail/pay/refund/adjust
- admin invoice manager/issue/edit/lifecycle tools

## Admin

The current codebase admin actions already center around cross-domain actions such as creating invoices and confirming appointments.

Admin UI should stay dashboard-first:
- KPIs
- action panels
- links into catalog/scheduling/invoices

## Platform

The current codebase platform actions already focus on operational maintenance:
- stale webhook lock cleanup
- replaying Stripe webhook failures
- preview pruning
- operational audit logging

Platform UI should stay ops/dev-tool first.

---

# 13. Boundaries cheat sheet

## Allowed imports

### `app/**`
Can import:
- `features/**`
- `next/*`
- route-safe auth redirect helpers if necessary

Should not import:
- Prisma
- DB selects
- transactions
- provider SDKs

### `features/**`
Can import:
- `components/**`
- `lib/fetchers/**`
- `types/**`
- `schemas/**` when needed
- client feature siblings

Should not import:
- Prisma directly
- provider SDKs directly

### `components/**`
Can import:
- `components/ui/**`
- `components/shared/**`
- `lib/utils/**`
- `types/**`

Should not import:
- Prisma
- fetchers
- transactions
- authz decisions

### `components/ui/**`
Can import:
- React
- class utilities
- Radix/shadcn dependencies

Should not import:
- domain types
- server modules
- fetchers/actions

### `lib/actions/**`
Can import:
- auth/authz
- schemas
- fetchers (sparingly for post-write readback)
- DB transactions
- cache helpers
- integrations
- uploads
- types

### `lib/fetchers/**`
Can import:
- auth/authz
- DB selects
- mappers
- types
- cache helpers

---

# 14. Naming conventions

## Features
- `*-page-feature.tsx`
- `*.client.tsx`
- `*-poller.client.tsx`
- `*-toolbar.client.tsx`
- `*-form.client.tsx`

## Components
- `*-header.tsx`
- `*-toolbar.tsx`
- `*-table.tsx`
- `*-grid.tsx`
- `*-card.tsx`
- `*-panel.tsx`
- `*-tabs.tsx`
- `*-form-shell.tsx`
- `*-form-fields.tsx`
- `*-actions.tsx`

## Types
- `*.types.ts`
- `*.client.types.ts`
- explicit `Dto`, `Input`, `Result`, `View`, `Model` naming where useful

## Schemas
- `*.schemas.ts`
- `verbEntitySchema` or `entityPurposeSchema`

---

# 15. One-shot execution rules for agents

## When refactoring a route

1. thin the route page first
2. create or update the page feature
3. move orchestration into the feature
4. split interactivity into `*.client.tsx`
5. extract reusable rendering into components
6. keep primitives in shadcn/ui only
7. verify fetchers/actions/schemas/types contracts
8. preserve authz and cache invalidation server-side

## When creating a new flow

1. define route shape in `app/`
2. create feature entrypoint
3. define DTOs and schemas if missing
4. create/update fetchers and actions
5. create domain components and shared blocks
6. use RHF only in feature client container
7. add loading/error/not-found where the route needs it
8. add tests by layer

## When touching forms

1. put client form container in `features/**`
2. put reusable field groups in `components/**`
3. parse with the same schema on the server
4. keep side effects in actions
5. return typed action results

## When touching data tables

1. use URL-driven search/filter/pagination when possible
2. parse `searchParams` centrally
3. shape rows in fetchers/features, not components
4. keep table interaction state in feature client containers
5. keep table rendering block reusable

## When touching visualizer

1. keep generation server-authoritative
2. keep provider adapters below UI
3. keep image normalization in uploads
4. keep preview ownership checks server-side
5. prefer status-driven UX over fake immediacy

---

# 16. Validation checklist

## Route / page checklist
- [ ] `page.tsx` is thin
- [ ] no Prisma in `app/**`
- [ ] proper `loading.tsx` exists for major sections
- [ ] `error.tsx` exists where recoverable domain failures matter
- [ ] `not-found.tsx` exists where entity lookup is common

## Feature checklist
- [ ] page feature owns orchestration
- [ ] client-only interactivity split into `*.client.tsx`
- [ ] Suspense used for expensive subsections when justified
- [ ] feature does not become generic shared UI

## Component checklist
- [ ] component is reusable and mostly presentational
- [ ] no Prisma / provider logic
- [ ] no authz logic
- [ ] no direct server mutation authority embedded in pure UI blocks

## Forms checklist
- [ ] RHF lives in feature client container
- [ ] reusable fields live in components
- [ ] schema validates on server action
- [ ] action handles mutation + cache invalidation

## Read/write boundary checklist
- [ ] reads go through fetchers
- [ ] writes go through actions
- [ ] selects are static only
- [ ] transactions are reusable DB write primitives only

## Type/schema checklist
- [ ] DTOs live in `types/**`
- [ ] browser-only types live in `*.client.types.ts`
- [ ] schemas live in `schemas/**`
- [ ] timestamps use `Timestamp`

## Platform integrity checklist
- [ ] auth/authz remain server-side
- [ ] provider env reads stay in integrations
- [ ] upload/image processing stays in uploads
- [ ] cache invalidation occurs after successful mutations
- [ ] audit logging remains in server mutations where appropriate

---

# 17. Anti-patterns to reject immediately

- fat `page.tsx` files
- Prisma imported into pages, features, or components
- RHF field groups that own business logic
- shared UI blocks importing server actions or fetchers directly
- domain blocks placed in `components/ui/**`
- server DTOs containing browser-only types
- cache policy invented ad hoc in page or component layers
- authz enforced only in UI
- provider SDK logic leaking into features/components
- visualizer generation authority moved into the client
- duplicated route semantics like unnecessary `/dashboard` or `/workspace` nesting when the parent already means that thing

---

# 18. Final summary

The architecture is simple when enforced correctly:

## `app/`
route shell

## `features/`
orchestration

## `components/`
reusable UI blocks

## `components/ui/`
shadcn primitives

## `lib/`
server truth

## `schemas/`
runtime validation

## `types/`
contracts

## `prisma/`
canonical data model

Everything that follows should reinforce this stack instead of cutting across it.

If an agent cannot classify a change into one of these layers, the agent should stop inventing and reclassify the responsibility before touching code.

