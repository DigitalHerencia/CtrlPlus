# Prompt: Unify Catalog Asset Role Resolution

**Objective:** Replace all `images[0]` fallbacks with explicit asset role resolution across catalog components, fetchers, and features.

**Context:**
- Asset roles are defined in `types/catalog.types.ts` as `AssetRole = "hero" | "gallery" | "visualizer_texture" | "visualizer_mask_hint" | "swatch"`
- Current code uses brittle `images[0]` to assume roles (e.g., first image is hero)
- This causes bugs when image order changes or roles are mixed
- Goal: Make role selection deterministic and explicit

**Scope:**
This refactor affects:
- `lib/fetchers/catalog/*.ts` - DTO mapping
- `components/catalog/*.tsx` - UI rendering
- `features/catalog/*.tsx` - Feature composition

**Acceptance Criteria:**

1. **No more `images[0]` references**
   - Search codebase: `grep -r "images\[0\]"` should return 0 results in catalog
   - Replacements use explicit role resolution

2. **Explicit role selection everywhere**
   - Example (Before): `<img src={wrap.images[0].url} />`
   - Example (After): `<img src={wrap.heroImage?.url} />`
   - Hero image always resolved by `images.find(img => img.kind === 'hero')`
   - Gallery images always filtered by `images.filter(img => img.kind === 'gallery')`

3. **DTOs reflect explicit roles**
   - `WrapListDTO.heroUrl: string | null` (not `images: []`)
   - `WrapDetailDTO.images: WrapImageDTO[]` (for manager UI only)
   - `WrapDetailDTO.visualizerTexture: WrapImageDTO | null` (for visualizer handoff)

4. **Fetchers return resolved roles**
   - `getCatalogWraps()` returns `WrapListDTO[]` with `heroUrl` pre-resolved
   - `getWrapDetail()` returns `WrapDetailDTO` with `hero`, `gallery`, and `visualizer_texture` resolved
   - `getWrapAssets(wrapId, role?)` returns assets filtered by role

5. **Components accept pre-resolved data**
   - `WrapCard` prop: `wrap: WrapListDTO` (has `heroUrl`)
   - `WrapDetail` prop: `wrap: WrapDetailDTO` (has `visualizerTexture`)
   - Avoid component-level role filtering

6. **E2E test passes**
   - Create wrap with hero + gallery + texture images
   - Verify: grid shows hero, detail shows gallery, visualizer selector shows texture
   - Reorder images, verify roles still correct (order doesn't affect role)

**Implementation Steps:**

1. **Audit Phase**
   - Search for all `images[0]` references in catalog code
   - Document what role each reference assumes
   - List affected components/fetchers

2. **Schema Update**
   - Update `WrapDetailDTO` and `WrapListDTO` in `types/catalog.types.ts`
   - Add explicit fields: `heroUrl`, `heroImage`, `gallery`, `visualizerTexture`

3. **Fetcher Refactor**
   - Update `getCatalogWraps()` to resolve hero image
   - Update `getWrapDetail()` to resolve all roles
   - Update `getWrapAssets(wrapId, role?)` to filter by role

4. **Component Updates**
   - `WrapCard: wrap.heroUrl (not images[0])`
   - `WrapDetail: wrap.gallery (filtered by role)`
   - `WrapImageManager: keep showing all images, but display role + ordering UI`

5. **Testing**
   - Unit tests: role resolution functions
   - E2E test: full catalog flow with role verification

**Related Files:**
- `lib/catalog/fetchers/catalog.ts`
- `lib/fetchers/catalog.ts`
- `types/catalog.types.ts`
- `schemas/catalog.schemas.ts`
- `components/catalog/WrapCard.tsx`
- `components/catalog/WrapDetail.tsx`
- `components/catalog/WrapImageManager.tsx`
- `features/catalog/CatalogBrowse.tsx`
- `features/catalog/CatalogDetail.tsx`

**Related Contracts:**
- `contracts/naming.yaml` - Component naming conventions
- `contracts/mutations.yaml` - Audit & mutation pipeline
- `contracts/domain-boundaries.yaml` - Catalog domain owns assets
- `instructions/catalog.instructions.md` - Catalog domain patterns

**Success Metric:**
- ✅ `grep -r "images\[0\]"` returns 0 results
- ✅ All role-dependent renders use explicit role selection
- ✅ E2E test: create → add images → verify roles
- ✅ No regression in catalog browse/detail views

**Estimated Effort:**
- 1-2 hours of implementation + testing
- High confidence (low risk, clear acceptance criteria)

**Notes:**
- This is prerequisite for visualizer refactor (visualizer needs to read wrap.visualizerTexture)
- This work enables future multi-image features (e.g., hero rotation, gallery pagination)
- No breaking changes to public API (wrap responses change shape but no behavior changes)
