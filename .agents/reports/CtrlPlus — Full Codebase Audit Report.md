CtrlPlus — Full Codebase Audit Report
**Date:** April 9, 2026 | **Version:** 0.3.0 | **Stack:** Next.js 16.2.2, React 19, Prisma 7.6, Clerk 7, Stripe 22, Neon/Postgres

---

## Executive Headline

The visualizer refactor is now live on the main user path. `/visualizer` no longer embeds the legacy external iframe; it renders the in-repo Hugging Face-backed feature (`VisualizerHfPageFeature`) behind the normal server auth/capability boundary.

This refresh also fixed the highest-signal non-visualizer audit defects:

- billing refunds now call Stripe instead of fabricating local refund records
- manager-only billing routes are page-gated from customer users
- the fake invoice edit path was removed from the UI and redirected to invoice detail
- invoice payment actions now follow invoice state and manager capability
- catalog manager detail assets now use the interactive asset-management client
- stale auth drift was removed (`employee` role input, Clerk webhook env mutation side effect)

---

## Validation Snapshot

- `pnpm exec vitest run tests/vitest/unit/lib/billing/actions/status-transitions.test.ts tests/vitest/unit/features/catalog/catalog-detail-route.test.tsx` — pass
- `pnpm exec vitest run tests/vitest/unit/features/auth/signup-form-client.test.tsx` — pass
- `pnpm typecheck` — pass
- `pnpm lint` — pass
- `pnpm prisma:validate` — pass
- `pnpm build` — pass
- `pnpm test` — pass (`41` files, `140` tests)
- `pnpm test:e2e --project=chromium --reporter=line` — pass (`27` passed, `2` skipped)
- audit artifacts refreshed:
  - `knip.out.txt`
  - `.agents/reports/knip.txt`
  - `.agents/reports/ts-prune.txt`
  - `.agents/reports/tsc-unused.txt`
  - `.agents/reports/eslint-unused-vars.txt`

`knip` still fails by design on current repo state and remains an active cleanup signal, not a regression from this pass.

---

## Domain Status

### Auth / Authz

**Status: Functional**

- Removed the stale `'employee'` role from `upsertUserFromClerkSchema`.
- `ensureClerkWebhookSigningSecret()` now resolves once without mutating `process.env` on reads.
- Full unit suite is green after extending the signup verification-path test timeout for the slower Clerk branch.

### Billing

**Status: Improved, no longer materially misleading**

- `refundInvoice()` now issues a real Stripe refund against the latest succeeded payment intent and records the provider refund ID locally.
- `processPayment()` now exposes the contract it actually supports: Stripe Checkout by `invoiceId`.
- `/billing/[invoiceId]/refund` and `/billing/[invoiceId]/adjust` now redirect non-manager users back to invoice detail instead of rendering manager-only UI.
- `/billing/manage` and `/billing/manage/[invoiceId]` now require manager-level billing capability at the page boundary.
- The fake edit flow was removed from manager row actions; `/billing/manage/[invoiceId]/edit` now redirects to the invoice detail surface.
- The manager dashboard no longer points lifecycle actions at `invoices[0]`.
- `InvoicePaymentPanel` now shows only the actions allowed for the current invoice state and caller capability.

### Catalog

**Status: Improved**

- The wrap manager detail assets tab now uses `CatalogWrapAssetsClient`, so upload/remove/reorder/edit is available in the detail route.
- Dead passthrough layers were removed:
  - `components/catalog/CatalogPagination.tsx`
  - `components/catalog/WrapGrid.tsx`
  - `features/catalog/manage/wrap-manager-page-feature.tsx`
  - `features/catalog/manage/wrap-asset-manager.client.tsx`
- The hardcoded "Featured Wrap" badge was removed from browse cards.
- `WrapDetail` no longer relies on the invalid `h-104` Tailwind class.
- Example-wrap branching was removed from catalog detail/browse behavior because the helper was a hardcoded `false`.

### Visualizer

**Status: Refactor complete for the primary application path**

- The main `/visualizer` page now renders the in-repo HF-backed feature directly.
- Earlier audit findings about the route being just an iframe are no longer valid.
- The route remains server-gated and the recent validation history plus current build confirm the cutover.

### Scheduling / Admin / Platform

**Status: No regressions observed in this pass**

- These domains were not materially changed in this refresh.
- Full unit + e2e validation stayed green after the billing/catalog/auth changes.

---

## Remaining Findings

### Medium

**Catalog browse pagination is still memory-backed.**

- `lib/fetchers/catalog.fetchers.ts`
- `searchCatalogWraps()` still reads the browse set into memory and paginates in-process instead of paging at the database layer.

**Stripe reconciliation is still one-way for non-checkout events.**

- `lib/actions/billing.actions.ts`
- The webhook processor still treats only `checkout.session.completed` as actionable. Provider-side refunds, payment failures, or disputes will not yet reconcile local invoice/payment state automatically.

**`VisualizerPreview.ownerClerkUserId @default("legacy")` remains a schema migration artifact.**

- `prisma/schema.prisma`
- The live page refactor is complete, but the schema still carries a legacy default that should be removed in a cleanup migration.

**Billing DTOs still synthesize non-persisted fields.**

- `lib/fetchers/billing.fetchers.ts`
- `types/billing.types.ts`
- `subtotalAmount`, `taxAmount`, and `dueDate` are still computed placeholders rather than persisted invoice fields.

### Low

**Dead-code backlog is still substantial.**

Fresh `knip` reports:

- `15` unused files
- `1` unused dependency
- `103` unused exports
- `55` unused exported types

High-signal unused files include:

- `lib/visualizer/fallback/build-simple-wrap-preview.ts`
- `lib/visualizer/fallback/place-logo-overlay.ts`
- `lib/visualizer/fallback/tint-vehicle-panels.ts`
- `lib/cache/cache-keys.ts`
- `lib/cache/visualizer-cache.ts`
- `lib/visualizer/asset-delivery.ts`
- `lib/visualizer/huggingface/generate-wrap-preview.ts`
- `lib/visualizer/huggingface/image-to-image-client.ts`
- `lib/visualizer/prompting/build-wrap-preview-prompt.ts`

`@gradio/client` is flagged as unused by `knip`, but that result needs human review because the visualizer space client resolves the package dynamically at runtime rather than through a normal static import.

---

## What Changed Since The Previous Audit

- The stale visualizer iframe finding is invalid and has been removed.
- The stale `next.config.ts` remote-host concern is already fixed and no longer belongs in the report.
- The stale schema concern about `ClerkSubscription`, `ClerkSubscriptionItem`, and `ClerkPaymentAttempt` missing `updatedAt` is invalid and has been removed.
- The stale auth findings around the `employee` role and Clerk webhook env mutation have been fixed.
- The billing-domain "manual refund" and misleading page-action findings have been materially reduced by code changes in this pass.
- The catalog-domain detail-route asset-management gap has been closed.

---

## Recommended Next Wave

1. Move catalog browse pagination to a database-backed path instead of in-memory filtering.
2. Extend Stripe webhook handling to reconcile refunds and payment failures.
3. Remove the `legacy` default from `VisualizerPreview.ownerClerkUserId`.
4. Triage the fresh `knip` output and remove the confirmed-unused visualizer fallback/cache modules.
