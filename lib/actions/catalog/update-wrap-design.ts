import type { UpdateWrapDesignPayload, WrapDesign } from '../../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';

export interface UpdateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: UpdateWrapDesignPayload;
}

export async function updateWrapDesign(input: UpdateWrapDesignActionInput): Promise<WrapDesign | null> {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.payload.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    tenantClerkOrgId: tenantContext.tenant.clerkOrgId,
    permission: 'catalog:write'
  });

  return catalogStore.update({
    ...input.payload,
    tenantId
  });
}
