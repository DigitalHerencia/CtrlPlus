import { createHash } from 'node:crypto';

import { z } from 'zod';

import { requirePermission } from '../auth/require-permission';
import { invoiceStore } from '../fetchers/get-invoice';
import { createLogContext, logEvent } from '../observability/structured-logger';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './validation';

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

const createCheckoutSessionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  invoiceId: z.string().min(1),
  successUrl: z.url(),
  cancelUrl: z.url()
});

function createSessionId(tenantId: string, invoiceId: string): string {
  const suffix = createHash('sha256').update(`${tenantId}:${invoiceId}:${Date.now().toString()}`).digest('hex').slice(0, 16);
  return `cs_test_${suffix}`;
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSessionResult> {
  const validatedInput = validateActionInput(createCheckoutSessionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;
  const logContext = createLogContext({
    headers: validatedInput.headers,
    tenantId,
    source: 'action.create-checkout-session'
  });

  logEvent({
    event: 'checkout.create.requested',
    context: logContext,
    data: {
      tenantId,
      invoiceId: validatedInput.invoiceId,
      successUrl: validatedInput.successUrl,
      cancelUrl: validatedInput.cancelUrl
    }
  });

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'billing:write'
  });

  const sessionId = createSessionId(tenantId, validatedInput.invoiceId);
  invoiceStore.markCheckoutSession(tenantId, validatedInput.invoiceId, sessionId);

  logEvent({
    event: 'checkout.create.succeeded',
    context: logContext,
    data: {
      tenantId,
      invoiceId: validatedInput.invoiceId,
      sessionId
    }
  });

  return {
    sessionId,
    checkoutUrl: `https://checkout.stripe.test/session/${sessionId}?success_url=${encodeURIComponent(validatedInput.successUrl)}&cancel_url=${encodeURIComponent(validatedInput.cancelUrl)}`
  };
}
