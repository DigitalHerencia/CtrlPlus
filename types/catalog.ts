import type { PaginationInput } from './shared';

export interface WrapCatalogItemContract {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly priceCents: number;
  readonly isPublished: boolean;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
}

export interface WrapCatalogSearchContract {
  readonly query?: string;
}

export interface WrapCatalogFilterContract {
  readonly isPublished?: boolean;
  readonly minPriceCents?: number;
  readonly maxPriceCents?: number;
}

export type WrapCatalogSortFieldContract = 'createdAt' | 'updatedAt' | 'name' | 'priceCents';
export type WrapCatalogSortDirectionContract = 'asc' | 'desc';

export interface WrapCatalogSortContract {
  readonly field: WrapCatalogSortFieldContract;
  readonly direction: WrapCatalogSortDirectionContract;
}

export interface WrapCatalogListRequestContract {
  readonly tenantId: string;
  readonly search?: WrapCatalogSearchContract;
  readonly filter?: WrapCatalogFilterContract;
  readonly sort?: WrapCatalogSortContract;
  readonly pagination: PaginationInput;
}

export interface WrapCatalogListResponseContract {
  readonly items: readonly WrapCatalogItemContract[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly hasNextPage: boolean;
}

export interface WrapCatalogGetRequestContract {
  readonly tenantId: string;
  readonly id: string;
}

export interface WrapCatalogCreatePayloadContract {
  readonly name: string;
  readonly description?: string;
  readonly priceCents?: number;
}

export interface WrapCatalogUpdatePayloadContract {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly priceCents?: number;
  readonly isPublished?: boolean;
}

export interface WrapCatalogDeletePayloadContract {
  readonly id: string;
}

export interface WrapCatalogWriteResultContract {
  readonly id: string;
}

export interface WrapCatalogDeleteResultContract {
  readonly id: string;
  readonly deleted: boolean;
}
