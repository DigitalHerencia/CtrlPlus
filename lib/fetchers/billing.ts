import { unstable_cache } from 'next/cache';

import type {
  InvoiceListRequestContract,
  InvoiceListResponseContract,
  InvoiceSummaryContract,
} from '../../types/billing';
import { queryInvoices } from '../../features/billing/use-cases';
import { requirePermission } from '../auth/require-permission';
import { tenantScopedPrisma, type InvoiceRecord } from '../db/prisma';
import { createLogContext, logEvent } from '../observability/structured-logger';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';

export type { InvoiceRecord };

export const BILLING_CACHE_POLICY = {
  invoiceRevalidateSeconds: 20,
  invoiceListRevalidateSeconds: 20,
} as const;

export function getBillingTenantTag(tenantId: string): string {
  return `billing:${tenantId}`;
}

export function getBillingInvoiceListTag(tenantId: string): string {
  return `billing:${tenantId}:invoices`;
}

export function getBillingInvoiceTag(tenantId: string, invoiceId: string): string {
  return `billing:${tenantId}:invoice:${invoiceId}`;
}

function isMissingIncrementalCache(error: unknown): boolean {
  return error instanceof Error && error.message.includes('incrementalCache missing');
}

export interface RunBillingCacheInput<TValue> {
  readonly keyParts: readonly string[];
  readonly tags: readonly string[];
  readonly revalidate: number;
  readonly load: () => Promise<TValue> | TValue;
}

export class InvoiceNotFoundError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 404) {
    super(message);
    this.name = 'InvoiceNotFoundError';
    this.statusCode = statusCode;
  }
}

export class InvoiceStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  findByTenant(tenantId: string, invoiceId: string): InvoiceRecord | null {
    return tenantScopedPrisma.getInvoiceByTenant(tenantId, invoiceId);
  }

  listByTenant(tenantId: string): readonly InvoiceRecord[] {
    return tenantScopedPrisma.listInvoicesByTenant(tenantId);
  }
}

export interface GetInvoiceInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly invoiceId: string;
}

export interface ListInvoicesFetcherInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly query: InvoiceListRequestContract;
}

export const invoiceStore = new InvoiceStore();

function toInvoiceSummary(record: InvoiceRecord): InvoiceSummaryContract {
  return {
    id: record.id,
    bookingId: record.bookingId,
    customerEmail: record.customerEmail,
    amountCents: record.amountCents,
    status: record.status,
    stripeCheckoutSessionId: record.stripeCheckoutSessionId,
    stripePaymentIntentId: record.stripePaymentIntentId,
  };
}

export async function runBillingCache<TValue>(
  input: RunBillingCacheInput<TValue>,
): Promise<TValue> {
  try {
    const cachedLoad = unstable_cache(async () => input.load(), [...input.keyParts], {
      tags: [...input.tags],
      revalidate: input.revalidate,
    });

    return await cachedLoad();
  } catch (error) {
    if (!isMissingIncrementalCache(error)) {
      throw error;
    }

    return input.load();
  }
}

export async function getInvoice(input: GetInvoiceInput): Promise<InvoiceRecord> {
  const tenantContext = requireTenant({
    headers: input.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, input.tenantId);
  const logContext = createLogContext({
    headers: input.headers,
    tenantId,
    source: 'fetcher.get-invoice'
  });

  logEvent({
    event: 'invoice.fetch.requested',
    context: logContext,
    data: {
      tenantId,
      invoiceId: input.invoiceId
    }
  });

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'billing:read'
  });

  const invoice = await runBillingCache({
    keyParts: [
      'billing',
      'invoice',
      tenantId,
      input.invoiceId
    ],
    tags: [
      getBillingTenantTag(tenantId),
      getBillingInvoiceListTag(tenantId),
      getBillingInvoiceTag(tenantId, input.invoiceId),
    ],
    revalidate: BILLING_CACHE_POLICY.invoiceRevalidateSeconds,
    load: () => invoiceStore.findByTenant(tenantId, input.invoiceId),
  });
  if (!invoice) {
    logEvent({
      level: 'warn',
      event: 'invoice.fetch.not_found',
      context: logContext,
      data: {
        tenantId,
        invoiceId: input.invoiceId
      }
    });

    throw new InvoiceNotFoundError('Invoice not found');
  }

  logEvent({
    event: 'invoice.fetch.succeeded',
    context: logContext,
    data: {
      tenantId,
      invoiceId: invoice.id,
      status: invoice.status,
      amountCents: invoice.amountCents,
      customerEmail: invoice.customerEmail
    }
  });

  return invoice;
}

export async function listInvoices(input: ListInvoicesFetcherInput): Promise<InvoiceListResponseContract> {
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, input.query.tenantId);

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'billing:read',
  });

  const filter = input.query.filter;
  const sort = input.query.sort;

  return runBillingCache({
    keyParts: [
      'billing',
      'invoices',
      tenantId,
      filter?.status ?? '',
      filter?.customerEmailQuery ?? '',
      sort?.field ?? 'id',
      sort?.direction ?? 'asc',
      input.query.pagination.page.toString(),
      input.query.pagination.pageSize.toString(),
    ],
    tags: [
      getBillingTenantTag(tenantId),
      getBillingInvoiceListTag(tenantId),
    ],
    revalidate: BILLING_CACHE_POLICY.invoiceListRevalidateSeconds,
    load: () => {
      const tenantInvoices = invoiceStore.listByTenant(tenantId).map(toInvoiceSummary);
      return queryInvoices(tenantInvoices, input.query);
    },
  });
}
