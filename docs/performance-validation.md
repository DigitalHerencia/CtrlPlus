# Performance Validation Plan

This document defines the canonical performance validation method for Milestones 2 and 3 deliverables.

## Scope

- `app/(tenant)/wraps/page.tsx` server-rendered listing path.
- Visualizer server actions:
  - `lib/server/actions/visualizer/create-template-preview-action.ts`
  - `lib/server/actions/visualizer/create-upload-preview-action.ts`

## Measurement Method

### 1) Workload Shape

#### Wraps page (`app/(tenant)/wraps/page.tsx`)

- Dataset:
  - 1 tenant
  - 500 wrap designs
  - 80% active inventory
- Request mix:
  - 60% default listing (`/wraps`)
  - 30% filtered listing (`finish=matte&vehicleType=suv`)
  - 10% search listing (`search=carbon`)
- Traffic profile:
  - 10 concurrent virtual users
  - 50 warmup requests
  - 400 measured requests

#### Visualizer actions

- Template action load:
  - 300 requests, 15 concurrency
  - 30 distinct vehicle templates
- Upload action load:
  - 120 requests, 5 concurrency
  - upload distribution: p50 4MB, p95 10MB
  - 15% forced fallback trigger rate
- Shared warmup:
  - 40 warmup requests before collecting metrics

### 2) Environment Assumptions

- Next.js production build on Node.js 20.
- Staging-like Neon Postgres in the same region as app execution.
- Equivalent deployment sizing to Vercel preview.
- Cache handling:
  - collect cold-cache run first,
  - then collect warm-cache run with expected caches primed.
- Image pipeline/storage config must match staging defaults.

### 3) Percentile Calculation Window

- Wraps page: p95 and p99 from a sliding window of the 400 measured requests (warmup excluded).
- Visualizer actions: rolling 15-minute p95 from per-action histograms (warmup excluded).
- Units: milliseconds.

## SLA Thresholds (Blocking)

- Wraps page warm-cache:
  - p95 <= 900ms
  - p99 <= 1200ms
- Visualizer actions:
  - template action p95 <= 1000ms
  - upload action p95 <= 20000ms
  - fallback success rate >= 99%

Any threshold breach fails acceptance for the associated issue/PR.

## Harness Commands

- `pnpm perf:wraps-page`
- `pnpm perf:visualizer-actions`
- `pnpm perf:assert`

`pnpm perf:assert` must fail CI when:

1. baseline artifacts are missing,
2. current run artifacts are missing,
3. SLA thresholds are exceeded,
4. regression budget is exceeded.

## Artifact Contract

- `tests/perf/results/wraps-page-baseline.json`
- `tests/perf/results/wraps-page-current.json`
- `tests/perf/results/visualizer-baseline.json`
- `tests/perf/results/visualizer-current.json`

## PR Reporting Requirement

Every PR that touches wraps listing or visualizer execution paths must report:

- baseline metrics,
- post-change metrics,
- absolute and percent delta,
- pass/fail status against SLA thresholds.
