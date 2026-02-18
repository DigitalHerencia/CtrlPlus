import type { UpdateWrapDesignPayload, WrapDesign } from '../../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';

export interface UpdateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: UpdateWrapDesignPayload;
}

export function updateWrapDesign(input: UpdateWrapDesignActionInput): WrapDesign | null {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:write'
  });

  return catalogStore.update(input.payload);
}

