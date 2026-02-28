import type { PaginationInput } from './shared';

export type InvoiceStatusContract = 'draft' | 'open' | 'paid';

export interface InvoiceSummaryContract {
  readonly id: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
  readonly status: InvoiceStatusContract;
  readonly stripeCheckoutSessionId?: string;
  readonly stripePaymentIntentId?: string;
}

export interface InvoiceGetRequestContract {
  readonly tenantId: string;
  readonly invoiceId: string;
}

export interface InvoiceListFilterContract {
  readonly status?: InvoiceStatusContract;
  readonly customerEmailQuery?: string;
}

export type InvoiceListSortFieldContract = 'id' | 'customerEmail' | 'amountCents' | 'status';
export type InvoiceListSortDirectionContract = 'asc' | 'desc';

export interface InvoiceListSortContract {
  readonly field: InvoiceListSortFieldContract;
  readonly direction: InvoiceListSortDirectionContract;
}

export interface InvoiceListRequestContract {
  readonly tenantId: string;
  readonly filter?: InvoiceListFilterContract;
  readonly sort?: InvoiceListSortContract;
  readonly pagination: PaginationInput;
}

export interface InvoiceListResponseContract {
  readonly items: readonly InvoiceSummaryContract[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly hasNextPage: boolean;
}
