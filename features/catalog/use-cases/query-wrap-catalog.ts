import type { WrapDesign } from '../types';
import type {
  WrapCatalogItemContract,
  WrapCatalogListRequestContract,
  WrapCatalogListResponseContract,
  WrapCatalogSortContract,
} from '../../../types/catalog';

const DEFAULT_SORT: WrapCatalogSortContract = {
  field: 'updatedAt',
  direction: 'desc',
};

function toSearchableText(design: WrapDesign): string {
  return `${design.name}\n${design.description ?? ''}`.toLowerCase();
}

function matchesSearch(
  design: WrapDesign,
  search: WrapCatalogListRequestContract['search'],
): boolean {
  const query = search?.query?.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return toSearchableText(design).includes(query);
}

function matchesFilter(
  design: WrapDesign,
  filter: WrapCatalogListRequestContract['filter'],
): boolean {
  if (filter?.isPublished !== undefined && design.isPublished !== filter.isPublished) {
    return false;
  }

  if (filter?.minPriceCents !== undefined && design.priceCents < filter.minPriceCents) {
    return false;
  }

  if (filter?.maxPriceCents !== undefined && design.priceCents > filter.maxPriceCents) {
    return false;
  }

  return true;
}

function compareBySortField(
  left: WrapDesign,
  right: WrapDesign,
  sort: WrapCatalogSortContract,
): number {
  switch (sort.field) {
    case 'name':
      return left.name.localeCompare(right.name);
    case 'priceCents':
      return left.priceCents - right.priceCents;
    case 'createdAt':
      return left.createdAt.getTime() - right.createdAt.getTime();
    case 'updatedAt':
      return left.updatedAt.getTime() - right.updatedAt.getTime();
    default:
      return 0;
  }
}

function sortWrapDesigns(
  wraps: readonly WrapDesign[],
  sort: WrapCatalogSortContract,
): readonly WrapDesign[] {
  return [...wraps].sort((left, right) => {
    const comparison = compareBySortField(left, right, sort);
    if (comparison !== 0) {
      return sort.direction === 'asc' ? comparison : comparison * -1;
    }

    return left.id.localeCompare(right.id);
  });
}

export function serializeWrapCatalogListQuery(query: WrapCatalogListRequestContract): string {
  return JSON.stringify({
    search: query.search?.query ?? null,
    filter: {
      isPublished: query.filter?.isPublished ?? null,
      minPriceCents: query.filter?.minPriceCents ?? null,
      maxPriceCents: query.filter?.maxPriceCents ?? null,
    },
    sort: {
      field: query.sort?.field ?? DEFAULT_SORT.field,
      direction: query.sort?.direction ?? DEFAULT_SORT.direction,
    },
    pagination: {
      page: query.pagination.page,
      pageSize: query.pagination.pageSize,
    },
  });
}

export function toWrapCatalogItemContract(design: WrapDesign): WrapCatalogItemContract {
  return {
    id: design.id,
    name: design.name,
    description: design.description ?? null,
    priceCents: design.priceCents,
    isPublished: design.isPublished,
    createdAtIso: design.createdAt.toISOString(),
    updatedAtIso: design.updatedAt.toISOString(),
  };
}

export function toWrapCatalogListResponse(
  wraps: readonly WrapDesign[],
  query: WrapCatalogListRequestContract,
): WrapCatalogListResponseContract {
  const filteredWraps = wraps.filter((design) => {
    return matchesSearch(design, query.search) && matchesFilter(design, query.filter);
  });
  const sortedWraps = sortWrapDesigns(filteredWraps, query.sort ?? DEFAULT_SORT);
  const total = sortedWraps.length;
  const page = query.pagination.page;
  const pageSize = query.pagination.pageSize;
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: sortedWraps.slice(start, end).map((design) => toWrapCatalogItemContract(design)),
    total,
    page,
    pageSize,
    pageCount,
    hasNextPage: page < pageCount,
  };
}
