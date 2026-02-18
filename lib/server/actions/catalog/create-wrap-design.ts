import type { CreateWrapDesignPayload, WrapDesign } from '../../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';

export interface CreateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: CreateWrapDesignPayload;
}

export function createWrapDesign(input: CreateWrapDesignActionInput): WrapDesign {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:write'
  });

  return catalogStore.create(input.payload);
}

