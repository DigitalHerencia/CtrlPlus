import { describe, expect, it } from 'vitest';

import {
  buildWrapCatalogListQuery,
  toWrapCatalogListResponse,
  toWrapCatalogSearchParams,
} from '../../features/catalog/use-cases';
import type { WrapDesign } from '../../features/catalog/types';

const createdAt = new Date('2026-01-01T10:00:00.000Z');
const updatedAt = new Date('2026-01-02T10:00:00.000Z');

function createWrap(overrides: Partial<WrapDesign> & Pick<WrapDesign, 'id' | 'name'>): WrapDesign {
  return {
    id: overrides.id,
    tenantId: overrides.tenantId ?? 'tenant_acme',
    name: overrides.name,
    description: overrides.description,
    priceCents: overrides.priceCents ?? 50000,
    isPublished: overrides.isPublished ?? true,
    createdAt: overrides.createdAt ?? createdAt,
    updatedAt: overrides.updatedAt ?? updatedAt,
  };
}

describe('catalog use-cases', () => {
  it('applies deterministic sorting with id tie-breakers', () => {
    const wraps = [
      createWrap({ id: 'wrap_c', name: 'C', priceCents: 55000 }),
      createWrap({ id: 'wrap_b', name: 'B', priceCents: 40000 }),
      createWrap({ id: 'wrap_a', name: 'A', priceCents: 40000 }),
    ];

    const response = toWrapCatalogListResponse(wraps, {
      tenantId: 'tenant_acme',
      sort: {
        field: 'priceCents',
        direction: 'asc',
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });

    expect(response.items.map((item) => item.id)).toEqual(['wrap_a', 'wrap_b', 'wrap_c']);
  });

  it('applies search, filter, and pagination metadata deterministically', () => {
    const wraps = [
      createWrap({ id: 'wrap_a', name: 'Matte Black', priceCents: 50000 }),
      createWrap({ id: 'wrap_b', name: 'Gloss White', description: 'matte accent', priceCents: 60000 }),
      createWrap({ id: 'wrap_c', name: 'Satin Gray', priceCents: 70000 }),
    ];

    const response = toWrapCatalogListResponse(wraps, {
      tenantId: 'tenant_acme',
      search: {
        query: '  matte ',
      },
      filter: {
        minPriceCents: 55000,
      },
      sort: {
        field: 'name',
        direction: 'asc',
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
    });

    expect(response.total).toBe(1);
    expect(response.pageCount).toBe(1);
    expect(response.hasNextPage).toBe(false);
    expect(response.items[0]?.id).toBe('wrap_b');
  });

  it('parses search params with defaults and validation fallbacks', () => {
    const query = buildWrapCatalogListQuery('tenant_acme', {
      q: '  Carbon Fiber ',
      minPriceCents: 'not-a-number',
      maxPriceCents: '65000',
      sort: 'unknown',
      direction: 'invalid',
      page: '-2',
      pageSize: '999',
    });

    expect(query).toEqual({
      tenantId: 'tenant_acme',
      search: {
        query: 'Carbon Fiber',
      },
      filter: {
        maxPriceCents: 65000,
      },
      sort: {
        field: 'updatedAt',
        direction: 'desc',
      },
      pagination: {
        page: 1,
        pageSize: 12,
      },
    });
  });

  it('serializes list query search params in a stable key order', () => {
    const searchParams = toWrapCatalogSearchParams({
      tenantId: 'tenant_acme',
      search: {
        query: 'Carbon Fiber',
      },
      filter: {
        minPriceCents: 40000,
        maxPriceCents: 90000,
      },
      sort: {
        field: 'priceCents',
        direction: 'asc',
      },
      pagination: {
        page: 2,
        pageSize: 24,
      },
    });

    expect(searchParams.toString()).toBe(
      'q=Carbon+Fiber&minPriceCents=40000&maxPriceCents=90000&sort=priceCents&direction=asc&page=2&pageSize=24',
    );
  });
});
