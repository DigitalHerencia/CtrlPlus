import { unstable_cache } from 'next/cache';

import type { WrapDesign } from '../../features/catalog/types';
import {
  serializeWrapCatalogListQuery,
  toWrapCatalogItemContract,
  toWrapCatalogListResponse,
} from '../../features/catalog/use-cases';
import type {
  WrapCatalogGetRequestContract,
  WrapCatalogItemContract,
  WrapCatalogListRequestContract,
  WrapCatalogListResponseContract,
} from '../../types/catalog';
import { requirePermission } from '../auth/require-permission';
import { tenantScopedPrisma, type WrapDesignRecord } from '../db/prisma';
import { wrapCatalogGetRequestSchema, wrapCatalogListRequestSchema } from '../shared/schemas/catalog/schema';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';

export const CATALOG_CACHE_POLICY = {
  privateRevalidateSeconds: 30,
  publicRevalidateSeconds: 60,
} as const;

const DEFAULT_PUBLIC_QUERY = {
  pagination: {
    page: 1,
    pageSize: 200,
  },
  sort: {
    field: 'updatedAt',
    direction: 'desc',
  },
  filter: {
    isPublished: true,
  },
} as const;

export function getCatalogTenantTag(tenantId: string): string {
  return `catalog:${tenantId}`;
}

export function getCatalogListTag(tenantId: string): string {
  return `catalog:${tenantId}:list`;
}

export function getCatalogItemTag(tenantId: string, id: string): string {
  return `catalog:${tenantId}:item:${id}`;
}

function isMissingIncrementalCache(error: unknown): boolean {
  return error instanceof Error && error.message.includes('incrementalCache missing');
}

function mapWrapDesign(
  record: WrapDesignRecord,
): WrapDesign {
  return {
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    description: record.description,
    priceCents: record.priceCents,
    isPublished: record.isPublished,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function enforcePublishedFilter(
  query: WrapCatalogListRequestContract,
): WrapCatalogListRequestContract {
  return {
    ...query,
    filter: {
      ...query.filter,
      isPublished: true,
    },
  };
}

export interface RunCatalogCacheInput<TValue> {
  readonly keyParts: readonly string[];
  readonly tags: readonly string[];
  readonly revalidate: number;
  readonly load: () => Promise<TValue> | TValue;
}

export interface ListWrapDesignsFetcherInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly query: WrapCatalogListRequestContract;
}

export interface GetWrapDesignFetcherInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly query: WrapCatalogGetRequestContract;
}

export interface ListPublicWrapDesignsFetcherInput {
  readonly query: WrapCatalogListRequestContract;
}

export interface GetPublicWrapDesignFetcherInput {
  readonly query: WrapCatalogGetRequestContract;
}

export class CatalogStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  listByTenant(tenantId: string): readonly WrapDesign[] {
    return tenantScopedPrisma.listWrapDesignsByTenant(tenantId).map((record) =>
      mapWrapDesign(record),
    );
  }

  getById(tenantId: string, id: string): WrapDesign | null {
    const record = tenantScopedPrisma.getWrapDesignByTenant(tenantId, id);
    return record ? mapWrapDesign(record) : null;
  }
}

export const catalogStore = new CatalogStore();

export async function runCatalogCache<TValue>(
  input: RunCatalogCacheInput<TValue>,
): Promise<TValue> {
  try {
    const cachedLoad = unstable_cache(
      async () => input.load(),
      [...input.keyParts],
      {
        tags: [...input.tags],
        revalidate: input.revalidate,
      },
    );

    return await cachedLoad();
  } catch (error) {
    if (!isMissingIncrementalCache(error)) {
      throw error;
    }

    return input.load();
  }
}

export async function listWrapDesigns(
  input: ListWrapDesignsFetcherInput,
): Promise<WrapCatalogListResponseContract> {
  const validatedQuery = wrapCatalogListRequestSchema.parse(input.query);
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;

  assertTenantScope(tenantId, validatedQuery.tenantId);
  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:read',
  });

  return runCatalogCache({
    keyParts: ['catalog-private-list', tenantId, serializeWrapCatalogListQuery(validatedQuery)],
    tags: [getCatalogTenantTag(tenantId), getCatalogListTag(tenantId)],
    revalidate: CATALOG_CACHE_POLICY.privateRevalidateSeconds,
    load: () => {
      return toWrapCatalogListResponse(catalogStore.listByTenant(tenantId), validatedQuery);
    },
  });
}

export async function getWrapDesign(
  input: GetWrapDesignFetcherInput,
): Promise<WrapCatalogItemContract | null> {
  const validatedQuery = wrapCatalogGetRequestSchema.parse(input.query);
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;

  assertTenantScope(tenantId, validatedQuery.tenantId);
  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:read',
  });

  return runCatalogCache({
    keyParts: ['catalog-private-item', tenantId, validatedQuery.id],
    tags: [
      getCatalogTenantTag(tenantId),
      getCatalogListTag(tenantId),
      getCatalogItemTag(tenantId, validatedQuery.id),
    ],
    revalidate: CATALOG_CACHE_POLICY.privateRevalidateSeconds,
    load: () => {
      const design = catalogStore.getById(tenantId, validatedQuery.id);
      return design ? toWrapCatalogItemContract(design) : null;
    },
  });
}

export async function listPublicWrapDesigns(
  input: ListPublicWrapDesignsFetcherInput,
): Promise<WrapCatalogListResponseContract> {
  const validatedQuery = enforcePublishedFilter(wrapCatalogListRequestSchema.parse(input.query));
  const tenantId = validatedQuery.tenantId;

  return runCatalogCache({
    keyParts: ['catalog-public-list', tenantId, serializeWrapCatalogListQuery(validatedQuery)],
    tags: [getCatalogTenantTag(tenantId), getCatalogListTag(tenantId)],
    revalidate: CATALOG_CACHE_POLICY.publicRevalidateSeconds,
    load: () => {
      return toWrapCatalogListResponse(catalogStore.listByTenant(tenantId), validatedQuery);
    },
  });
}

export async function getPublicWrapDesign(
  input: GetPublicWrapDesignFetcherInput,
): Promise<WrapCatalogItemContract | null> {
  const validatedQuery = wrapCatalogGetRequestSchema.parse(input.query);
  const tenantId = validatedQuery.tenantId;

  return runCatalogCache({
    keyParts: ['catalog-public-item', tenantId, validatedQuery.id],
    tags: [
      getCatalogTenantTag(tenantId),
      getCatalogListTag(tenantId),
      getCatalogItemTag(tenantId, validatedQuery.id),
    ],
    revalidate: CATALOG_CACHE_POLICY.publicRevalidateSeconds,
    load: () => {
      const design = catalogStore.getById(tenantId, validatedQuery.id);
      if (!design || !design.isPublished) {
        return null;
      }

      return toWrapCatalogItemContract(design);
    },
  });
}

export async function getPublicWraps(
  tenantId: string,
): Promise<readonly WrapCatalogItemContract[]> {
  const response = await listPublicWrapDesigns({
    query: {
      tenantId,
      ...DEFAULT_PUBLIC_QUERY,
    },
  });

  return response.items;
}

export function getDefaultPublicCatalogListQuery(
  tenantId: string,
): WrapCatalogListRequestContract {
  return {
    tenantId,
    ...DEFAULT_PUBLIC_QUERY,
  };
}

export async function getPublicWrapById(
  tenantId: string,
  id: string,
): Promise<WrapCatalogItemContract | null> {
  return getPublicWrapDesign({
    query: {
      tenantId,
      id,
    },
  });
}
