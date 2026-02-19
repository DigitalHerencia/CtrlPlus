import { requirePermission } from '../auth/require-permission';
import { invoiceStore, type InvoiceRecord } from '../fetchers/get-invoice';
import { requireTenant } from '../tenancy/require-tenant';

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

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceRecord> {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    tenantClerkOrgId: tenantContext.tenant.clerkOrgId,
    permission: 'billing:write'
  });

  if (!isValidEmail(input.customerEmail.trim())) {
    throw new InvoiceValidationError('Customer email is invalid');
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new InvoiceValidationError('Invoice amount must be a positive integer in cents');
  }

  return invoiceStore.create({
    tenantId,
    bookingId: input.bookingId,
    customerEmail: input.customerEmail.trim().toLowerCase(),
    amountCents: input.amountCents
  });
}
