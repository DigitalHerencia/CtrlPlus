import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';

export interface DeleteWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly id: string;
}

export function deleteWrapDesign(input: DeleteWrapDesignActionInput): boolean {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:write'
  });

  return catalogStore.delete(input.tenantId, input.id);
}

