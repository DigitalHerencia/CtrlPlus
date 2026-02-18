import { requirePermission } from '../auth/require-permission';

export interface InvoiceRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
  readonly status: 'draft' | 'open' | 'paid';
  readonly stripeCheckoutSessionId?: string;
  readonly stripePaymentIntentId?: string;
}

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
  private readonly invoices = new Map<string, InvoiceRecord>();

  reset(): void {
    this.invoices.clear();
  }

  create(input: CreateInvoiceRecordInput): InvoiceRecord {
    const id = `invoice_${this.invoices.size + 1}`;
    const invoice: InvoiceRecord = {
      id,
      tenantId: input.tenantId,
      bookingId: input.bookingId,
      customerEmail: input.customerEmail,
      amountCents: input.amountCents,
      status: 'draft'
    };

    this.invoices.set(id, invoice);
    return invoice;
  }

  findByTenant(tenantId: string, invoiceId: string): InvoiceRecord | null {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice || invoice.tenantId !== tenantId) {
      return null;
    }

    return invoice;
  }

  markCheckoutSession(tenantId: string, invoiceId: string, checkoutSessionId: string): InvoiceRecord {
    const invoice = this.findByTenant(tenantId, invoiceId);
    if (!invoice) {
      throw new InvoiceNotFoundError('Invoice not found');
    }

    const updated: InvoiceRecord = {
      ...invoice,
      stripeCheckoutSessionId: checkoutSessionId,
      status: 'open'
    };

    this.invoices.set(invoiceId, updated);
    return updated;
  }

  markPaid(
    tenantId: string,
    invoiceId: string,
    checkoutSessionId: string,
    paymentIntentId: string
  ): InvoiceRecord {
    const invoice = this.findByTenant(tenantId, invoiceId);
    if (!invoice) {
      throw new InvoiceNotFoundError('Invoice not found');
    }

    const updated: InvoiceRecord = {
      ...invoice,
      stripeCheckoutSessionId: checkoutSessionId,
      stripePaymentIntentId: paymentIntentId,
      status: 'paid'
    };

    this.invoices.set(invoiceId, updated);
    return updated;
  }
}

export interface GetInvoiceInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly invoiceId: string;
}

export const invoiceStore = new InvoiceStore();

export function getInvoice(input: GetInvoiceInput): InvoiceRecord {
  requirePermission({
    headers: input.headers,
    permission: 'billing:read'
  });

  const invoice = invoiceStore.findByTenant(input.tenantId, input.invoiceId);
  if (!invoice) {
    throw new InvoiceNotFoundError('Invoice not found');
  }

  return invoice;
}
