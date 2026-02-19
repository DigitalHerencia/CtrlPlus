import type { WrapDesign } from '../../../features/catalog/types';
import { catalogStore } from './store';

export interface ListWrapDesignsInput {
  readonly tenantId: string;
}

export function listWrapDesigns(input: ListWrapDesignsInput): readonly WrapDesign[] {
  return catalogStore.listByTenant(input.tenantId);
}

