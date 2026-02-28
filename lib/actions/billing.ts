import { createHash } from 'node:crypto';

import { z } from 'zod';

import { createMutationAuditLogger } from '../audit/log-mutation-event';
import { requirePermission } from '../auth/require-permission';
import { safeRevalidatePath, safeRevalidateTag } from '../cache/invalidation';
import { tenantScopedPrisma, type InvoiceRecord } from '../db/prisma';
import {
  getBillingInvoiceListTag,
  getBillingInvoiceTag,
  InvoiceNotFoundError,
  getBillingTenantTag,
} from '../fetchers/billing';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './shared';

export interface CreateCheckoutSessionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly invoiceId: string;
  readonly successUrl: string;
  readonly cancelUrl: string;
}

export interface CheckoutSessionResult {
  readonly sessionId: string;
  readonly checkoutUrl: string;
}

export class InvoiceValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'InvoiceValidationError';
    this.statusCode = statusCode;
  }
}

export const BILLING_MUTATION_INVALIDATION_PATHS = ['/operations/admin'] as const;

export interface InvalidateBillingMutationInput {
  readonly tenantId: string;
  readonly invoiceId?: string;
}

export interface CreateInvoiceInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
}

export interface MarkInvoicePaidFromWebhookInput {
  readonly tenantId: string;
  readonly invoiceId: string;
  readonly checkoutSessionId: string;
  readonly paymentIntentId: string;
}

const createCheckoutSessionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  invoiceId: z.string().min(1),
  successUrl: z.url(),
  cancelUrl: z.url()
});

const createInvoiceInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  bookingId: z.string().min(1).optional(),
  customerEmail: z.email(),
  amountCents: z.number().int().positive()
});

function createSessionId(tenantId: string, invoiceId: string): string {
  const suffix = createHash('sha256').update(`${tenantId}:${invoiceId}:${Date.now().toString()}`).digest('hex').slice(0, 16);
  return `cs_test_${suffix}`;
}

export function invalidateBillingMutation(input: InvalidateBillingMutationInput): void {
  safeRevalidateTag(getBillingTenantTag(input.tenantId));
  safeRevalidateTag(getBillingInvoiceListTag(input.tenantId));

  for (const path of BILLING_MUTATION_INVALIDATION_PATHS) {
    safeRevalidatePath(path);
  }

  if (!input.invoiceId) {
    return;
  }

  safeRevalidateTag(getBillingInvoiceTag(input.tenantId, input.invoiceId));
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSessionResult> {
  const validatedInput = validateActionInput(createCheckoutSessionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, validatedInput.tenantId);
  const audit = createMutationAuditLogger({
    headers: validatedInput.headers,
    tenantId,
    source: 'action.create-checkout-session',
    eventPrefix: 'checkout.create'
  });

  audit.requested({
    tenantId,
    invoiceId: validatedInput.invoiceId,
    successUrl: validatedInput.successUrl,
    cancelUrl: validatedInput.cancelUrl
  });

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'billing:write'
  });

  const sessionId = createSessionId(tenantId, validatedInput.invoiceId);
  const invoice = tenantScopedPrisma.markInvoiceCheckoutSession(tenantId, validatedInput.invoiceId, sessionId);
  if (!invoice) {
    throw new InvoiceNotFoundError('Invoice not found');
  }

  audit.succeeded({
    tenantId,
    invoiceId: validatedInput.invoiceId,
    sessionId
  });
  invalidateBillingMutation({
    tenantId,
    invoiceId: validatedInput.invoiceId,
  });

  return {
    sessionId,
    checkoutUrl: `https://checkout.stripe.test/session/${sessionId}?success_url=${encodeURIComponent(validatedInput.successUrl)}&cancel_url=${encodeURIComponent(validatedInput.cancelUrl)}`
  };
}

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceRecord> {
  const validatedInput = validateActionInput(createInvoiceInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, validatedInput.tenantId);
  const audit = createMutationAuditLogger({
    headers: validatedInput.headers,
    tenantId,
    source: 'action.create-invoice',
    eventPrefix: 'invoice.create'
  });

  audit.requested({
    tenantId,
    bookingId: validatedInput.bookingId,
    customerEmail: validatedInput.customerEmail,
    amountCents: validatedInput.amountCents
  });

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'billing:write'
  });

  const invoice = tenantScopedPrisma.createInvoice({
    tenantId,
    bookingId: validatedInput.bookingId,
    customerEmail: validatedInput.customerEmail.trim().toLowerCase(),
    amountCents: validatedInput.amountCents
  });

  audit.succeeded({
    tenantId,
    invoiceId: invoice.id,
    status: invoice.status,
    customerEmail: invoice.customerEmail,
    amountCents: invoice.amountCents
  });
  invalidateBillingMutation({
    tenantId,
    invoiceId: invoice.id,
  });

  return invoice;
}

export function markInvoicePaidFromWebhook(
  input: MarkInvoicePaidFromWebhookInput,
): InvoiceRecord {
  const invoice = tenantScopedPrisma.markInvoicePaid(
    input.tenantId,
    input.invoiceId,
    input.checkoutSessionId,
    input.paymentIntentId,
  );

  if (!invoice) {
    throw new InvoiceNotFoundError('Invoice not found');
  }

  invalidateBillingMutation({
    tenantId: input.tenantId,
    invoiceId: input.invoiceId,
  });

  return invoice;
}
