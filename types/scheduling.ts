import type { PaginationInput } from './shared';

export interface BookingSlotContract {
  readonly startIso: string;
  readonly endIso: string;
  readonly isAvailable: boolean;
}

export interface BookingSummaryContract {
  readonly id: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export interface BookingListFilterContract {
  readonly customerNameQuery?: string;
  readonly startsAfterIso?: string;
  readonly endsBeforeIso?: string;
}

export type BookingListSortFieldContract = 'startsAtIso' | 'customerName';
export type BookingListSortDirectionContract = 'asc' | 'desc';

export interface BookingListSortContract {
  readonly field: BookingListSortFieldContract;
  readonly direction: BookingListSortDirectionContract;
}

export interface BookingListRequestContract {
  readonly tenantId: string;
  readonly filter?: BookingListFilterContract;
  readonly sort?: BookingListSortContract;
  readonly pagination: PaginationInput;
}

export interface BookingListResponseContract {
  readonly items: readonly BookingSummaryContract[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly hasNextPage: boolean;
}
