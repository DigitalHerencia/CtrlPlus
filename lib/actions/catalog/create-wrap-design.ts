import type { CreateWrapDesignPayload, WrapDesign } from '../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';

export interface CreateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: CreateWrapDesignPayload;
}

export async function createWrapDesign(input: CreateWrapDesignActionInput): Promise<WrapDesign> {
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

  return catalogStore.create({
    ...input.payload,
    tenantId
  });
}
