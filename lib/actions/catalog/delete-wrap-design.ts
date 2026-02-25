import { z } from 'zod';

import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';
import { headerSchema, validateActionInput } from '../validation';

export interface DeleteWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly id: string;
}

const deleteWrapDesignActionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  id: z.string().min(1)
});

export async function deleteWrapDesign(input: DeleteWrapDesignActionInput): Promise<boolean> {
  const validatedInput = validateActionInput(deleteWrapDesignActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:write'
  });

  return catalogStore.delete(tenantId, validatedInput.id);
}
