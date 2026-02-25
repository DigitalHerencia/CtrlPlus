import type {
  CreateWrapDesignPayload,
  UpdateWrapDesignPayload,
  WrapDesign
} from '../../../features/catalog/types';
import { tenantScopedPrisma } from '../../db/prisma';

function mapWrapDesign(record: ReturnType<typeof tenantScopedPrisma.createWrapDesign>): WrapDesign {
  return {
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    description: record.description,
    priceCents: record.priceCents,
    isPublished: record.isPublished,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

export class CatalogStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  create(payload: CreateWrapDesignPayload): WrapDesign {
    return mapWrapDesign(
      tenantScopedPrisma.createWrapDesign({
        tenantId: payload.tenantId,
        name: payload.name,
        description: payload.description,
        priceCents: payload.priceCents ?? 0,
        isPublished: false
      })
    );
  }

  listByTenant(tenantId: string): readonly WrapDesign[] {
    return tenantScopedPrisma.listWrapDesignsByTenant(tenantId).map((record) => mapWrapDesign(record));
  }

  getById(tenantId: string, id: string): WrapDesign | null {
    const record = tenantScopedPrisma.getWrapDesignByTenant(tenantId, id);
    return record ? mapWrapDesign(record) : null;
  }

  update(payload: UpdateWrapDesignPayload): WrapDesign | null {
    const record = tenantScopedPrisma.updateWrapDesign({
      tenantId: payload.tenantId,
      id: payload.id,
      name: payload.name,
      description: payload.description,
      priceCents: payload.priceCents,
      isPublished: payload.isPublished
    });

    return record ? mapWrapDesign(record) : null;
  }

  delete(tenantId: string, id: string): boolean {
    return tenantScopedPrisma.deleteWrapDesign(tenantId, id);
  }
}

export const catalogStore = new CatalogStore();
