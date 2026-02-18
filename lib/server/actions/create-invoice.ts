import { requirePermission } from '../auth/require-permission';
import { invoiceStore, type InvoiceRecord } from '../fetchers/get-invoice';

export class InvoiceValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'InvoiceValidationError';
    this.statusCode = statusCode;
  }
}

export interface CreateInvoiceInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
}

function isValidEmail(value: string): boolean {
  return /.+@.+\..+/.test(value);
}

export function createInvoice(input: CreateInvoiceInput): InvoiceRecord {
  requirePermission({
    headers: input.headers,
    permission: 'billing:write'
  });

  if (!isValidEmail(input.customerEmail.trim())) {
    throw new InvoiceValidationError('Customer email is invalid');
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new InvoiceValidationError('Invoice amount must be a positive integer in cents');
  }

  return invoiceStore.create({
    tenantId: input.tenantId,
    bookingId: input.bookingId,
    customerEmail: input.customerEmail.trim().toLowerCase(),
    amountCents: input.amountCents
  });
}
