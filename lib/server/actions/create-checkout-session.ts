import { createHash } from 'node:crypto';

import { requirePermission } from '../auth/require-permission';
import { invoiceStore } from '../fetchers/get-invoice';

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

function createSessionId(tenantId: string, invoiceId: string): string {
  const suffix = createHash('sha256').update(`${tenantId}:${invoiceId}:${Date.now().toString()}`).digest('hex').slice(0, 16);
  return `cs_test_${suffix}`;
}

export function createCheckoutSession(input: CreateCheckoutSessionInput): CheckoutSessionResult {
  requirePermission({
    headers: input.headers,
    permission: 'billing:write'
  });

  const sessionId = createSessionId(input.tenantId, input.invoiceId);
  invoiceStore.markCheckoutSession(input.tenantId, input.invoiceId, sessionId);

  return {
    sessionId,
    checkoutUrl: `https://checkout.stripe.test/session/${sessionId}?success_url=${encodeURIComponent(input.successUrl)}&cancel_url=${encodeURIComponent(input.cancelUrl)}`
  };
}
