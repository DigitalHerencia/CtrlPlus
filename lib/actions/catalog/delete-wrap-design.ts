import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';

export interface DeleteWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly id: string;
}

export async function deleteWrapDesign(input: DeleteWrapDesignActionInput): Promise<boolean> {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:write'
  });

  return catalogStore.delete(tenantId, input.id);
}
