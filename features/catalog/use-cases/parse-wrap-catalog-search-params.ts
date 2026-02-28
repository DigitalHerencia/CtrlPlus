import type { WrapCatalogListRequestContract } from '../../../types/catalog';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
const DEFAULT_SORT = {
  field: 'updatedAt',
  direction: 'desc',
} as const satisfies NonNullable<WrapCatalogListRequestContract['sort']>;

const SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'name', 'priceCents']);
const SORT_DIRECTIONS = new Set(['asc', 'desc']);

export type WrapCatalogRouteSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

function readSearchParam(
  searchParams: WrapCatalogRouteSearchParams | undefined,
  key: string,
): string | undefined {
  const value = searchParams?.[key];
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return undefined;
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  allowedValues?: readonly number[],
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  if (allowedValues && !allowedValues.includes(parsed)) {
    return fallback;
  }

  return parsed;
}

function parseSortField(
  value: string | undefined,
): NonNullable<WrapCatalogListRequestContract['sort']>['field'] {
  return SORT_FIELDS.has(value ?? '')
    ? (value as NonNullable<WrapCatalogListRequestContract['sort']>['field'])
    : DEFAULT_SORT.field;
}

function parseSortDirection(
  value: string | undefined,
): NonNullable<WrapCatalogListRequestContract['sort']>['direction'] {
  return SORT_DIRECTIONS.has(value ?? '')
    ? (value as NonNullable<WrapCatalogListRequestContract['sort']>['direction'])
    : DEFAULT_SORT.direction;
}

function parseSearchQuery(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function buildWrapCatalogListQuery(
  tenantId: string,
  searchParams: WrapCatalogRouteSearchParams | undefined,
): WrapCatalogListRequestContract {
  const searchQuery = parseSearchQuery(readSearchParam(searchParams, 'q'));
  const minPriceCents = parsePositiveInteger(
    readSearchParam(searchParams, 'minPriceCents'),
    Number.NaN,
  );
  const maxPriceCents = parsePositiveInteger(
    readSearchParam(searchParams, 'maxPriceCents'),
    Number.NaN,
  );

  const search = searchQuery
    ? {
      query: searchQuery,
    }
    : undefined;

  const filter = {
    ...(Number.isFinite(minPriceCents) ? { minPriceCents } : {}),
    ...(Number.isFinite(maxPriceCents) ? { maxPriceCents } : {}),
  };

  return {
    tenantId,
    ...(search ? { search } : {}),
    ...(Object.keys(filter).length > 0 ? { filter } : {}),
    sort: {
      field: parseSortField(readSearchParam(searchParams, 'sort')),
      direction: parseSortDirection(readSearchParam(searchParams, 'direction')),
    },
    pagination: {
      page: parsePositiveInteger(readSearchParam(searchParams, 'page'), DEFAULT_PAGE),
      pageSize: parsePositiveInteger(
        readSearchParam(searchParams, 'pageSize'),
        DEFAULT_PAGE_SIZE,
        PAGE_SIZE_OPTIONS,
      ),
    },
  };
}

export function toWrapCatalogSearchParams(query: WrapCatalogListRequestContract): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (query.search?.query) {
    searchParams.set('q', query.search.query);
  }

  if (query.filter?.minPriceCents !== undefined) {
    searchParams.set('minPriceCents', String(query.filter.minPriceCents));
  }

  if (query.filter?.maxPriceCents !== undefined) {
    searchParams.set('maxPriceCents', String(query.filter.maxPriceCents));
  }

  if (query.sort) {
    searchParams.set('sort', query.sort.field);
    searchParams.set('direction', query.sort.direction);
  }

  searchParams.set('page', String(query.pagination.page));
  searchParams.set('pageSize', String(query.pagination.pageSize));

  return searchParams;
}
