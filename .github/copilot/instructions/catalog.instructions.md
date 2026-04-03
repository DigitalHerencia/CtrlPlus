---
description: 'Catalog domain patterns. Use when working on wrap storefront, asset management, publish workflows, or catalog components in lib/fetchers/catalog.fetchers.ts, lib/fetchers/catalog.mappers.ts, lib/actions/catalog.actions.ts, features/catalog/**, app/(tenant)/catalog/**, or components/catalog/**.'
applyTo: 'lib/fetchers/catalog*.ts, lib/actions/catalog.actions.ts, features/catalog/**, app/(tenant)/catalog/**, components/catalog/**'
---

# Catalog Domain Instructions

The catalog is the authoritative wrap storefront and asset management system. It controls wrap discovery, detail presentation, and all assets used by the visualizer.

## Core Principle

**Asset roles are explicit and deterministic.**

Never use `images[0]` to assume an asset role. Always resolve roles explicitly:

- `hero` - customer-facing thumbnail/showcase
- `gallery` - supplementary images
- `visualizer_texture` - wrap texture for AI compositing
- `visualizer_mask_hint` - optional segmentation hint
- `swatch` - compact grid thumbnail

## Domain Entities

### Wrap

- `id`, `name`, `description` (nullable), `price` (cents), `installationMinutes` (nullable)
- `isHidden` - publishing toggle; default `true` (hidden until owner publishes)
- `sortRank` - curated ordering (lower = display first)
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)

Related: `WrapImage[]`, `WrapCategory[]` through junction table

### WrapImage

Represents a single asset with explicit role metadata.

- `id`, `wrapId`, `url`, `kind` (hero|gallery|visualizer_texture|visualizer_mask_hint|swatch)
- `isActive` - whether this specific image is currently used (allows disabling without deletion)
- `version` - version counter for cache invalidation
- `contentHash` - SHA256 or similar for integrity checking
- `displayOrder` - ordering within role (e.g., gallery[0], gallery[1])
- Optional: `altText`, `contentType`, `bytes`, `width`, `height`, `provider` (cloudinary|local), `providerId`

Rules:

- Each role can have multiple images (e.g., hero can rotate, gallery has many)
- Only **one `visualizer_texture` can be active per wrap**
- `isActive` allows rollback without data loss

### WrapCategory

M2M relationship for categorization and discovery.

- Owned by wrap (via junction table)
- Allows filtering and taxonomization
- Must validate: category exists and is active

## Fetchers: `lib/fetchers/catalog.fetchers.ts` + `lib/fetchers/catalog.mappers.ts`

### `getCatalogWraps()`

List wraps for customer browsing.

```typescript
export async function getCatalogWraps(filters?: CatalogFilters): Promise<WrapListDTO[]> {
  // Returns only non-hidden, non-deleted wraps
  // Ordered by sortRank, then createdAt
  // Each includes: id, name, heroUrl (resolved), price
}
```

Related:

- Filters: name search, category, price range
- Returns: `WrapListDTO[]` (minimal for grid display)
- Cache tag: `catalog:wraps`

### `getWrapDetail(wrapId)`

Fetch wrap detail with all assets.

```typescript
export async function getWrapDetail(wrapId: string): Promise<WrapDetailDTO> {
  // Validates wrap exists and is published (or user is owner/admin)
  // Returns full detail: all asset roles, categories, pricing
  // Includes resolved visualizer_texture for preview button routing
}
```

Related:

- Auth: authenticated route; owner/admin can include hidden wraps
- Returns: `WrapDetailDTO` (full catalog + visualizer asset data)
- Cache tag: `catalog:wrap:${wrapId}`

### `getWrapsByCategory(categoryId)`

Filter wraps by category.

```typescript
export async function getWrapsByCategory(categoryId: string): Promise<WrapListDTO[]> {
  // List wraps in a specific category, published only
  // Supports pagination
}
```

### `getWrapAssets(wrapId, role?)`

Fetch asset images for a wrap, optionally filtered by role.

```typescript
export async function getWrapAssets(
  wrapId: string,
  role?: AssetRole
): Promise<WrapImageDTO[]> {
  // Returns active assets only
  // Can filter by single role or return all
  // Ordered by displayOrder
}
```

## Actions: `lib/actions/catalog/`

All follow the 6-step pipeline: authenticate → authorize → validate → mutate → audit → return.

### `createWrap(input)`

Owner-only. Create a new wrap.

```typescript
export async function createWrap(
  input: CreateWrapInput
): Promise<WrapDetailDTO> {
  // Validate: name, priceCents, categoryIds
  // Create with isHidden: true (not published)
  // Returns detail for manager view
}
```

Input:

- `name` (1-120 chars)
- `description` (nullable, ≤500 chars)
- `priceCents` (int > 0)
- `installationMinutes` (nullable, int ≥0)
- `categoryIds` (string[], max 50)

### `updateWrap(input)`

Owner-only. Update wrap metadata.

```typescript
export async function updateWrap(
  input: UpdateWrapInput
): Promise<WrapDetailDTO> {
  // Update: name, description, priceCents, installationMinutes, categoryIds
  // Does NOT update assets (separate action)
  // Invalidates catalog:wrap:${wrapId}
}
```

### `publishWrap(wrapId)`

Owner-only. Publish a wrap (set isHidden: false).

**Validation (must pass ALL):**

- Wrap has active `hero` asset
- Wrap has active `visualizer_texture` asset
- `categoryIds` is not empty (recommended, not required)

```typescript
export async function publishWrap(wrapId: string): Promise<WrapDetailDTO> {
  // Validate publish readiness
  // Set isHidden: false
  // Audit: wrap.published
  // Invalidate: catalog:wraps, catalog:wrap:${wrapId}
}
```

### `addWrapImage(input)`

Owner-only. Upload and attach an image asset.

```typescript
export async function addWrapImage(
  input: AddWrapImageInput
): Promise<WrapImageDTO> {
  // Upload file to storage (Cloudinary or local)
  // Create WrapImage row with role, provider, providerId
  // If role is visualizer_texture: deactivate others (single active)
  // If role is hero: deactivate previous if exists (single active hero)
  //   (gallery and swatch can have multiple actives)
  // Invalidate: catalog:wrap:${wrapId}
}
```

Input:

- `wrapId` (string)
- `role` (AssetRole)
- `isActive` (boolean)
- `file` (FormData or presigned upload)
- `altText` (optional)

Output: `WrapImageDTO` with provider metadata.

### `updateWrapImage(input)`

Owner-only. Update image metadata or role assignment.

```typescript
export async function updateWrapImage(
  input: UpdateWrapImageInput
): Promise<WrapImageDTO> {
  // Update: altText, displayOrder, kind (role), isActive
  // If kind changes: may need to deactivate other assets
  // Invalidate: catalog:wrap:${wrapId}
}
```

### `deleteWrapImage(imageId)`

Owner-only. Soft-delete an image asset.

```typescript
export async function deleteWrapImage(imageId: string): Promise<void> {
  // Soft-delete (set deletedAt)
  // Clean up storage if provider is configured
  // Invalidate wrap cache
}
```

### `setWrapCategories(input)`

Owner-only. Update wrap's category mappings.

```typescript
export async function setWrapCategories(
  input: SetWrapCategoriesInput
): Promise<WrapDetailDTO> {
  // Atomically replace category mappings (delete old, insert new)
  // Validate: all categoryIds exist and are active
  // Invalidate: catalog:wraps, catalog:wrap:${wrapId}
}
```

## Types: `types/catalog.types.ts`

### DTOs (Data Transfer Objects)

```typescript
export interface WrapListDTO {
  id: string;
  name: string;
  description: string | null;
  price: number; // cents
  heroUrl: string | null; // Resolved hero image URL
  sortRank: number;
}

export interface WrapDetailDTO extends WrapListDTO {
  installationMinutes: number | null;
  isHidden: boolean;
  categoryIds: string[];
  images: WrapImageDTO[];
  visualizerTexture: WrapImageDTO | null; // Resolved single texture
}

export interface WrapImageDTO {
  id: string;
  wrapId: string;
  url: string;
  kind: AssetRole;
  isActive: boolean;
  version: number;
  contentHash: string;
  displayOrder: number;
  altText: string | null;
  provider: string | null;
  providerId: string | null;
}

export type AssetRole = "hero" | "gallery" | "visualizer_texture" | "visualizer_mask_hint" | "swatch";
```

## Schemas: `schemas/catalog.schemas.ts`

```typescript
export const createWrapSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullable(),
  priceCents: z.number().int().positive(),
  installationMinutes: z.number().int().nonnegative().nullable(),
  categoryIds: z.array(z.string()).max(50),
});

export const updateWrapSchema = createWrapSchema.partial();

export const addWrapImageSchema = z.object({
  wrapId: z.string(),
  role: z.enum(["hero", "gallery", "visualizer_texture", "visualizer_mask_hint", "swatch"]),
  isActive: z.boolean(),
  altText: z.string().optional(),
});
```

## Components: `components/catalog/`

### WrapCard

Display wrap in grid (hero, name, price, preview button).

Props:

- `wrap: WrapListDTO`
- `onPreview?: (wrapId: string) => void`
- `onEdit?: (wrapId: string) => void` (owner-only)

Resolves `heroUrl` from explicit `hero` role (not `images[0]`).

### WrapDetail

Full wrap detail + gallery + CTA.

Props:

- `wrap: WrapDetailDTO`
- `onPreview?: (wrapId: string) => void`
- `onEdit?: (wrapId: string) => void` (owner-only)

Displays:

- Hero image
- Gallery (if multiple gallery images)
- Description, pricing, specs
- Category tags
- Preview + Add to Cart CTAs

### WrapImageManager

Owner-only. Manage images, roles, upload, reorder.

Props:

- `wrap: WrapDetailDTO`
- `onSave: (images: WrapImageDTO[]) => Promise<void>`

Features:

- File upload per role
- Drag-to-reorder within role
- Active/inactive toggle
- Delete with confirmation
- Publish validation indicator

## Features: `features/catalog/`

### CatalogBrowse

Authenticated browse experience.

- List page with filtering
- Search, category filter, price filter
- Grid pagination
- Card click → detail page
- Preview button → `/visualizer?wrapId=...`

### CatalogDetail

Wrap detail + purchase workflow.

- Hero + gallery
- Description, pricing, specs
- Categories
- "Preview on Vehicle" button → `/visualizer?wrapId=...`
- "Add to Cart" → billing/checkout

### WrapManager (Owner-only)

Admin catalog management.

- CRUD for wraps (list, create, edit, delete)
- Asset upload + role management
- Category mapping
- Publish validation + publish button
- Soft-delete recovery (if applicable)

## Auth & Authz

### Authenticated paths

- `/catalog` (browse)
- `/catalog/[wrapId]` (detail)

### Owner-only paths (requireOwnerOrPlatformAdmin)

- `/catalog/manage` (manager interface)
- `/catalog/manage/[wrapId]` (manager detail)
- `/catalog/manage/new` (create flow)

### Checks in actions

- All mutations: `requireOwnerOrPlatformAdmin()`
- Validate capability and record existence server-side

## Caching Strategy

| What                | Cache tag                | Revalidate | Invalidation                                                                      |
| ------------------- | ------------------------ | ---------- | --------------------------------------------------------------------------------- |
| Catalog list        | `catalog:wraps`          | 1 hour     | `createWrap`, `updateWrap`, `publishWrap`, `deleteWrap`, `updateWrapImage`        |
| Wrap detail         | `catalog:wrap:${wrapId}` | 1 hour     | `updateWrap`, `addWrapImage`, `updateWrapImage`, `deleteWrapImage`, `publishWrap` |
| Wrap assets         | `catalog:wrap:${wrapId}` | 1 hour     | Any asset mutation for that wrap                                                  |

Use `revalidateTag()` in actions, not `revalidatePath()`.

## Production Readiness Checklist

- [ ] Asset roles enforced everywhere (no `images[0]`)
- [ ] Publish validation includes required assets check
- [ ] Image metadata (provider, providerId, contentHash) stored
- [ ] No base64 or inline images in DB (URLs/references only)
- [ ] Cloudinary cleanup on image delete
- [ ] Category validating in all mutations
- [ ] Wrap pagination working
- [ ] Asset upload error handling
- [ ] All actions audit-logged
- [ ] E2E tests for publish workflow

## Related Resources

- Product requirements: [`docs/PRD.md`](../docs/PRD.md)
- Architecture guide: [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- Data model guide: [`docs/DATA-MODEL.md`](../docs/DATA-MODEL.md)
- Visualizer dependency: [`visualizer.instructions.md`](./visualizer.instructions.md)
- Domain boundaries contract: [`contracts/domain-boundaries.yaml`](../contracts/domain-boundaries.yaml)
- Mutation pipeline: [`contracts/mutations.yaml`](../contracts/mutations.yaml)
