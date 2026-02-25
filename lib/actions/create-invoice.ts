import { z } from 'zod';

import { requirePermission } from '../auth/require-permission';
import { invoiceStore, type InvoiceRecord } from '../fetchers/get-invoice';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './validation';

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

const createInvoiceInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  bookingId: z.string().min(1).optional(),
  customerEmail: z.email(),
  amountCents: z.number().int().positive()
});

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceRecord> {
  const validatedInput = validateActionInput(createInvoiceInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'billing:write'
  });

  return invoiceStore.create({
    tenantId,
    bookingId: validatedInput.bookingId,
    customerEmail: validatedInput.customerEmail.trim().toLowerCase(),
    amountCents: validatedInput.amountCents
  });
}
