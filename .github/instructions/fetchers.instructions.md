---
name: Data Fetchers - Read Operations
description: "Enforce DTO pattern and tenant scoping in all data fetchers. Use when creating or reviewing lib/*/fetchers/* files."
applyTo: "lib/*/fetchers/**"
---

# Data Fetchers: Read Operations

All fetchers **MUST**:

1. Return explicit **DTO types** (never raw Prisma models)
2. Scope queries by `tenantId`
3. Filter soft-deleted records
4. Have clear, named functions per query
5. Be tested independently

## Template

```tsx
// lib/domain/fetchers/get-records.ts
import { prisma } from "@/lib/prisma";
import { type RecordDTO } from "../types";

/**
 * Fetches all active records for a tenant
 * @param tenantId - Tenant scope (server-side verified)
 * @returns Array of record DTOs
 */
export async function getRecordsForTenant(
  tenantId: string,
): Promise<RecordDTO[]> {
  const records = await prisma.record.findMany({
    where: {
      tenantId, // 🚨 ALWAYS scope
      deletedAt: null, // Filter soft-deletes
    },
    orderBy: { createdAt: "desc" },
    select: {
      // ✅ Explicitly select fields (never select *)
      id: true,
      name: true,
      description: true,
      createdAt: true,
      // Don't expose internal fields
    },
  });

  // Transform raw Prisma model → DTO
  return records.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.createdAt,
  }));
}

/**
 * Fetches a single record by ID, scoped to tenant
 * @param tenantId - Tenant scope (server-side verified)
 * @param recordId - Record ID
 * @returns Record DTO or null
 */
export async function getRecordById(
  tenantId: string,
  recordId: string,
): Promise<RecordDTO | null> {
  const record = await prisma.record.findFirst({
    where: {
      id: recordId,
      tenantId, // 🚨 Defensive scope check
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
    },
  });

  return record
    ? {
        id: record.id,
        name: record.name,
        description: record.description,
        createdAt: record.createdAt,
      }
    : null;
}

/**
 * Fetches records with pagination
 * @param tenantId - Tenant scope
 * @param options - Pagination options
 * @returns Paginated records with total count
 */
export async function getRecordsPaginated(
  tenantId: string,
  options: { page: number; limit: number },
) {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.record.count({
      where: {
        tenantId,
        deletedAt: null,
      },
    }),
  ]);

  return {
    records: records.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    })),
    total,
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

## Type Definition Pattern

```tsx
// lib/domain/types.ts
import { z } from "zod";

// DTO for read operations (what we return from fetchers)
export interface RecordDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  // Don't expose internal fields like internalSystemId, secret, etc.
}

// Input validation schema
export const createRecordSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;

// List of all DTOs so they're discoverable
export const recordDTOFields = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
} as const;
```

## Security Checks

### ✅ Tenant Scope Present

```tsx
// ✅ GOOD
where: {
  tenantId,        // Required filter
  deletedAt: null, // Optional soft-delete filter
}

// ❌ BAD - Missing tenantId
where: {
  deletedAt: null,
}
```

### ✅ Explicit Field Selection

```tsx
// ✅ GOOD - Explicit select
select: {
  id: true,
  name: true,
  createdAt: true,
}

// ❌ BAD - Implicit select (returns all fields)
// Just use findMany/findUnique without select
```

### ✅ DTO Transformation

```tsx
// ✅ GOOD
const record = await prisma.record.findFirst({ ... });
return record ? { id: record.id, name: record.name } : null;

// ❌ BAD - Returns raw Prisma model
const record = await prisma.record.findFirst({ ... });
return record;
```

### ✅ Soft Delete Handling

```tsx
// ✅ GOOD - Filter soft-deletes
where: { tenantId, deletedAt: null }

// ❌ BAD - Includes deleted records
where: { tenantId }
```

## Common Patterns

### List All for Tenant

```tsx
export async function getCatalogsForTenant(
  tenantId: string,
): Promise<CatalogDTO[]> {
  const catalogs = await prisma.catalog.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: catalogDTOFields,
  });

  return catalogs.map(transformCatalogToDTO);
}

function transformCatalogToDTO(catalog: any): CatalogDTO {
  return {
    id: catalog.id,
    name: catalog.name,
    description: catalog.description,
  };
}
```

### Get Single by ID with Fallback

```tsx
export async function getWrapById(
  tenantId: string,
  wrapId: string,
): Promise<WrapDTO | null> {
  const wrap = await prisma.wrap.findFirst({
    where: { id: wrapId, tenantId, deletedAt: null },
    select: wrapDTOFields,
  });

  return wrap ? transformWrapToDTO(wrap) : null;
}
```

### Search with Filters

```tsx
export async function searchWraps(
  tenantId: string,
  filters: {
    query?: string;
    categoryId?: string;
    maxPrice?: number;
  },
): Promise<WrapDTO[]> {
  const { query, categoryId, maxPrice } = filters;

  const wraps = await prisma.wrap.findMany({
    where: {
      tenantId,
      deletedAt: null,
      ...(query && { name: { contains: query, mode: "insensitive" } }),
      ...(categoryId && { categoryId }),
      ...(maxPrice && { price: { lte: maxPrice } }),
    },
    orderBy: { createdAt: "desc" },
    select: wrapDTOFields,
  });

  return wraps.map(transformWrapToDTO);
}
```

### Count with Scoping

```tsx
export async function getWrapCount(tenantId: string): Promise<number> {
  return prisma.wrap.count({
    where: { tenantId, deletedAt: null },
  });
}
```

## Fetcher Testing Pattern

```tsx
// lib/domain/fetchers/__tests__/get-records.test.ts
import { describe, it, expect, vi } from "vitest";
import { getRecordsForTenant, getRecordById } from "../get-records";

vi.mock("@/lib/prisma");

describe("getRecordsForTenant", () => {
  it("returns records for tenant only", async () => {
    const tenantId = "tenant-123";
    const mockRecords = [{ id: "1", name: "Record 1", createdAt: new Date() }];

    vi.mocked(prisma.record.findMany).mockResolvedValue(mockRecords);

    const result = await getRecordsForTenant(tenantId);

    expect(prisma.record.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId,
          deletedAt: null,
        }),
      }),
    );
    expect(result).toHaveLength(1);
  });

  it("filters out deleted records", async () => {
    const tenantId = "tenant-123";
    vi.mocked(prisma.record.findMany).mockResolvedValue([]);

    await getRecordsForTenant(tenantId);

    expect(prisma.record.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
        }),
      }),
    );
  });
});

describe("getRecordById", () => {
  it("returns record for tenant", async () => {
    const tenantId = "tenant-123";
    const recordId = "record-456";

    vi.mocked(prisma.record.findFirst).mockResolvedValue({
      id: recordId,
      name: "Test",
      createdAt: new Date(),
    });

    const result = await getRecordById(tenantId, recordId);

    expect(prisma.record.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId,
          id: recordId,
        }),
      }),
    );
    expect(result?.id).toBe(recordId);
  });

  it("returns null for different tenant", async () => {
    vi.mocked(prisma.record.findFirst).mockResolvedValue(null);

    const result = await getRecordById("tenant-123", "record-456");

    expect(result).toBeNull();
  });
});
```

## What NOT to Do

| Anti-Pattern           | Why                      | Fix                                    |
| ---------------------- | ------------------------ | -------------------------------------- |
| `return record`        | Exposes raw Prisma model | Transform to DTO before returning      |
| `select: undefined`    | Returns all fields       | Explicitly list fields in `select`     |
| Only `where: { id }`   | Missing tenant scope     | Add `tenantId` to where clause         |
| `orderBy: undefined`   | No predictable order     | Always add `orderBy`                   |
| No soft-delete filter  | Shows deleted records    | Add `deletedAt: null` to where         |
| Export raw Prisma type | Creates coupling         | Export DTO interface from `types.ts`   |
| Function per field     | Too many functions       | Bundle related queries in one function |

## File Organization

```
lib/catalog/
├── fetchers/
│   ├── get-wraps.ts           # getWrapsForTenant, getWrapById
│   ├── get-categories.ts      # getCategoriesForTenant, getCategoryById
│   └── __tests__/
│       ├── get-wraps.test.ts
│       └── get-categories.test.ts
├── actions/
│   ├── create-wrap.ts
│   ├── update-wrap.ts
│   └── delete-wrap.ts
├── types.ts                   # All DTOs and schemas
└── validation.ts              # Optional: Zod schemas if not in types.ts
```

---

See [copilot-instructions.md](../copilot-instructions.md) for full architecture guide.
