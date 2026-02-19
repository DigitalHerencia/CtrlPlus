import { createHash } from 'node:crypto';

import { requirePermission } from '../auth/require-permission';
import { invoiceStore } from '../fetchers/get-invoice';
import { requireTenant } from '../tenancy/require-tenant';

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
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'billing:write'
  });

  const sessionId = createSessionId(tenantId, input.invoiceId);
  invoiceStore.markCheckoutSession(tenantId, input.invoiceId, sessionId);

  return {
    sessionId,
    checkoutUrl: `https://checkout.stripe.test/session/${sessionId}?success_url=${encodeURIComponent(input.successUrl)}&cancel_url=${encodeURIComponent(input.cancelUrl)}`
  };
}
