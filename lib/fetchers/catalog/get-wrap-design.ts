import type { WrapDesign } from '../../../../features/catalog/types';
import { catalogStore } from './store';

export interface GetWrapDesignInput {
  readonly tenantId: string;
  readonly id: string;
}

export function getWrapDesign(input: GetWrapDesignInput): WrapDesign | null {
  return catalogStore.getById(input.tenantId, input.id);
}

