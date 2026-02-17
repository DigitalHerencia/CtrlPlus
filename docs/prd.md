# PRD.md

## Product name

**CTRL+** — multi-tenant vehicle wrap catalog, visualizer, scheduling, invoicing, and payments.

### Tagline

**Command Your Brand** - Print + Tint + Signage (915)999-2191

## Summary

A multi-tenant website for a small home-based vehicle wrap business in El Paso, Texas. Customers can browse wrap designs, visualize a wrap on their vehicle (via upload or fast alternative), schedule drop-off and pick-up, and pay an invoice via Stripe in a single guided session. Admins manage wrap inventory, schedules, invoices, and fulfillment.

## Goals

* Convert browsing into booked+paid appointments with minimal friction.
* Make “visualize it on my car” the main differentiator.
* Ensure tenant isolation (subdomain-based) for future franchising/expansion.
* Secure, performant, tested, and maintainable with modern Next.js conventions.

## Non-goals (v1)

* Complex multi-location routing optimization.
* Full CAD-grade wrap rendering. We need “good enough to sell,” fast.
* Marketplace for third-party designers (future).

## Personas

* **Customer**: wants quick visual confirmation, easy scheduling, transparent price, quick payment.
* **Tenant Admin (Owner/Staff)**: manages wrap catalog, availability, invoices, job pipeline.
* **Super Admin (Platform)**: manages tenants, billing settings, feature flags (optional in v1 but keep hooks).

## Core features

### 1) Wrap catalog + browsing

* Browse wrap designs by categories (color, style, theme, finish), vehicle type compatibility, popularity.
* Design detail page: gallery, finish options, approximate price range, estimated install duration.
* “Try on my vehicle” CTA.

### 2) Wrap visualizer / simulation (key feature)

**Primary UX:** customer chooses a wrap design, then visualizes on their vehicle and proceeds to schedule.

**Two supported methods (v1):**

1. **Upload-based preview (recommended baseline)**

   * User uploads a vehicle photo (front/side/3-quarter).
   * System produces a composited preview with the selected wrap overlay.
   * Constraints: fast (<10–20s typical), good-enough alignment, cached results.

2. **Model-based preview (fallback/fast path)**

   * If user doesn’t upload: select vehicle make/model/year + color.
   * Use a stock template image or simplified silhouette render to preview wrap.
   * Faster and more reliable; less personal but keeps funnel moving.

**Acceptance bar (v1):**

* Preview must look plausible and sellable (not perfect).
* Must not block scheduling; user can proceed even if preview fails (graceful fallback).

### 3) Scheduling: drop-off + pick-up planning

* Customer selects:

  * vehicle details (type, make/model/year, notes),
  * desired wrap,
  * drop-off date/time window,
  * pick-up date/time window (computed from estimated install duration + business rules).
* Business rules:

  * working hours, buffer times, blackout dates, capacity limits (e.g., max concurrent jobs).
  * optionally require deposit before confirming (configurable per tenant).
* Confirmation includes calendar summary and reminders (email optional in v1; hooks included).

### 4) Invoicing + Stripe payments (single session)

* Quote/invoice generated from selected wrap + vehicle type + optional add-ons.
* Stripe Checkout or Payment Intents (choose one; Checkout simplest v1).
* Post-payment:

  * webhook confirms payment and updates invoice + booking status.
  * customer sees receipt and appointment summary.

### 5) Admin console (tenant-scoped)

* Manage wrap catalog (CRUD): designs, tags, pricing rules, images.
* Manage availability: working hours, blackout days, capacity.
* Manage bookings: status pipeline (Requested → Confirmed → In Progress → Ready → Completed).
* Manage invoices: issue, resend link, mark as paid (if offline), refunds (future).
* Manage customers: view history.

## User flows

### Flow A: Browse → Visualize → Schedule → Pay

1. Visit tenant site (subdomain).
2. Browse wraps.
3. Select wrap → “Visualize”.
4. Upload photo OR select vehicle model template.
5. Preview generated; user proceeds.
6. Select drop-off + pick-up windows.
7. Confirm details; invoice shown.
8. Pay via Stripe.
9. Confirmation page + email hook.

### Flow B: Visualize fails → fallback template → continue

* If upload preview errors/timeouts, offer template-based preview immediately and continue to scheduling.

### Flow C: Admin creates invoice for walk-in

* Admin enters booking details, issues invoice link, customer pays.

## Data & objects (product-level)

* Tenant
* User (Clerk)
* CustomerProfile
* WrapDesign
* WrapPreview (generated artifacts)
* Booking
* AvailabilityRules / Capacity
* Invoice
* Payment (Stripe references)
* AuditEvent

## Success metrics

* % sessions reaching visualizer
* Visualizer completion rate
* Booking conversion rate
* Paid booking rate
* Time-to-preview
* Admin time saved per invoice/booking

## Risks & mitigations

* **Visualizer quality/performance**: keep fallback path; cache previews; keep render bounded and async-friendly.
* **Scheduling complexity**: start with simple capacity rules; expand later.
* **Stripe/webhook reliability**: idempotent webhook handling; audit logs.
* **Multi-tenancy security**: strict tenant scoping in every query/action; server-side checks only.

## Release plan (milestones)

1. Tenant + auth + base shell + catalog read-only
2. Visualizer v1 (upload + template fallback) + caching
   * Performance validation work item: benchmark `app/(tenant)/wraps/page.tsx` under production-like load and fail if p95/p99 SLA thresholds regress.
   * Require PRs touching wraps listing path to report baseline vs post-change p95/p99.
3. Scheduling v1 + booking creation
   * Performance validation work item: benchmark visualizer server actions (`create-template-preview-action`, `create-upload-preview-action`) with template/upload workload mix and 15-minute p95 window.
   * Require fallback-success and latency SLA checks to be blocking acceptance criteria.
4. Invoicing + Stripe Checkout + webhook finalize
5. Admin console CRUD + operational views
6. Hardening: testing, perf, security reviews, CI/CD polish
7. Observability maturity: standardized latency dashboards and CI regression artifacts
8. Platform governance: dedicated performance instrumentation issue tracking and enforcement
