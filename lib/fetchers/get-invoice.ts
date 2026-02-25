import { requirePermission } from '../auth/require-permission';
import { tenantScopedPrisma, type InvoiceRecord } from '../db/prisma';
import { createLogContext, logEvent } from '../observability/structured-logger';
import { requireTenant } from '../tenancy/require-tenant';

export type { InvoiceRecord };

export interface CreateInvoiceRecordInput {
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
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

  create(input: CreateInvoiceRecordInput): InvoiceRecord {
    return tenantScopedPrisma.createInvoice(input);
  }

  findByTenant(tenantId: string, invoiceId: string): InvoiceRecord | null {
    return tenantScopedPrisma.getInvoiceByTenant(tenantId, invoiceId);
  }

  listByTenant(tenantId: string): readonly InvoiceRecord[] {
    return tenantScopedPrisma.listInvoicesByTenant(tenantId);
  }

  markCheckoutSession(tenantId: string, invoiceId: string, checkoutSessionId: string): InvoiceRecord {
    const invoice = tenantScopedPrisma.markInvoiceCheckoutSession(tenantId, invoiceId, checkoutSessionId);
    if (!invoice) {
      throw new InvoiceNotFoundError('Invoice not found');
    }

    return invoice;
  }

  markPaid(
    tenantId: string,
    invoiceId: string,
    checkoutSessionId: string,
    paymentIntentId: string
  ): InvoiceRecord {
    const invoice = tenantScopedPrisma.markInvoicePaid(
      tenantId,
      invoiceId,
      checkoutSessionId,
      paymentIntentId
    );

    if (!invoice) {
      throw new InvoiceNotFoundError('Invoice not found');
    }

    return invoice;
  }
}

export interface GetInvoiceInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly invoiceId: string;
}

export const invoiceStore = new InvoiceStore();

export async function getInvoice(input: GetInvoiceInput): Promise<InvoiceRecord> {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;
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

  const invoice = invoiceStore.findByTenant(tenantId, input.invoiceId);
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
