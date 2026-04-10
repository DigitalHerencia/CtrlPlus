---
goal: Replace legacy visualizer preview/upload pipeline with a server-action + fetcher based Hugging Face Space configurator UI in the website visualizer domain.
version: 1.0
date_created: 2026-04-09
last_updated: 2026-04-09
owner: visualizer
status: In Progress
tags: [visualizer, huggingface, nextjs, server-actions, fetchers, refactor]
---

# Visualizer HF Space Integration Plan

## 1) Integration architecture (no `app/api/visualizer/**` routes)

### Objective

Render and control the new vehicle/wrap configurator natively in website UI, while generation is executed by the Hugging Face Space (`CannaTech/CtrlPlus`) through server actions and fetchers.

### Request/response pipe

1. **RSC page load** (`app/(tenant)/visualizer/page.tsx`)
    - auth + capability guard (`visualizer.use`)
    - fetch initial catalog data via `lib/fetchers/visualizer.fetchers.ts`
2. **Client interactions**
    - make/model/year/trim dropdown changes are local-state driven from preloaded indexes
    - wrap description panel updates instantly from preloaded wrap metadata
3. **Generate click**
    - calls `lib/actions/visualizer.actions.ts::generateVisualizerHfPreviewAction`
    - server action validates with Zod in `schemas/visualizer.schemas.ts`
    - server action calls `lib/visualizer/huggingface/space-client.ts` using `@gradio/client` against `api_name=/generate_wrap_preview`
    - action returns `{ imageUrl, promptUsed }` and does not use route handlers
4. **UI render**
    - result image shown directly in visualizer page
    - prompt shown in read-only panel

### Why this architecture

- Aligns with repo rules: reads in fetchers, writes/mutations in actions.
- Avoids custom API route handlers and polling complexity.
- Matches user request for redesigned visualizer UX.

## 2) Current visualizer inventory (to be replaced)

### Routes

- `app/(tenant)/visualizer/page.tsx` (currently iframe)
- legacy route tree under `app/(tenant)/visualizer/previews/**` and `uploads/**`
- legacy API handlers under `app/api/visualizer/**`

### Domain logic

- `lib/actions/visualizer.actions.ts` (upload+preview lifecycle, background processing)
- `lib/fetchers/visualizer.fetchers.ts` and `lib/fetchers/visualizer.mappers.ts`
- `lib/db/selects/visualizer.selects.ts`
- `lib/cache/visualizer-cache.ts`
- `lib/cache/cache-keys.ts` (visualizer key helper)
- `lib/visualizer/{asset-delivery,signed-asset-urls,preprocessing,prompting,fallback}`

### UI stack

- `features/visualizer/**` (workspace, poller, previews/uploads feature pages)
- `components/visualizer/**` (preview/upload tables/cards/forms/canvas)

### Contracts

- `types/visualizer.types.ts`
- `schemas/visualizer.schemas.ts`

### Tests

- visualizer action tests and visualizer API route tests under `tests/vitest/unit/lib/visualizer/**` and `tests/vitest/unit/test/api/visualizer-*.test.ts`

## 3) Delete / Reuse / Adapt / Build strategy

### Delete

- Legacy visualizer preview/upload subroutes (`previews/**`, `uploads/**`)
- Legacy visualizer API route handlers (`app/api/visualizer/**`)
- Legacy visualizer UI components/features for upload/preview lifecycle
- Old preprocessing/fallback/signed URL modules tied to that lifecycle
- Legacy tests for deleted APIs/flows

### Reuse

- auth/session + capability checks
- existing Hugging Face Space client dependency (`@gradio/client`)
- basic visualizer top-level route shell and style language

### Adapt

- `lib/visualizer/huggingface/space-client.ts` to call the dropdown-based Space endpoint directly
- `lib/actions/visualizer.actions.ts` to expose only the new generate action
- `lib/fetchers/visualizer.fetchers.ts` to serve fast in-memory indexed vehicle/wrap catalog for UI
- `types/visualizer.types.ts` and `schemas/visualizer.schemas.ts` for new request/result shapes
- platform visualizer tools messaging to reflect HF configurator operations

### Build from scratch

- New `features/visualizer/visualizer-hf-page-feature.tsx`
- New `components/visualizer/visualizer-hf-configurator.client.tsx`
- New catalog index utility for instant dependent dropdown options

## 4) Implementation phases

1. Build new fetcher/action/type/schema stack for HF dropdown configurator.
2. Build new visualizer page UI feature/components.
3. Remove legacy visualizer previews/uploads/API/poller/preview pipeline files.
4. Update governance docs (`/.agents/instructions` + domain status JSON).
5. Update Prisma model comments/status (no migration if runtime tables remain tolerated).
6. Replace tests with new action/fetcher/UI unit coverage and run quality gates.

## 5) Prisma and migration decision

- **Decision**: keep existing `VisualizerUpload` and `VisualizerPreview` models for now (no migration this pass) to avoid breaking unrelated analytics/admin reports and because the new HF flow does not require schema writes.
- **Action**: mark models as legacy/deprecated in schema comments and add follow-up migration note for cleanup when platform/report dependencies are removed.

## 6) Quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm prisma:validate`
- `pnpm test`

(Optional in this pass unless asked): `pnpm build`, `pnpm test:e2e --project=chromium --reporter=line`
