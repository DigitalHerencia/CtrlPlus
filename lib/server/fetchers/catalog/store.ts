import type {
  CreateWrapDesignPayload,
  UpdateWrapDesignPayload,
  WrapDesign
} from '../../../../features/catalog/types';

export class CatalogStore {
  private readonly designs = new Map<string, WrapDesign>();

  reset(): void {
    this.designs.clear();
  }

  create(payload: CreateWrapDesignPayload): WrapDesign {
    const timestamp = new Date();
    const design: WrapDesign = {
      id: `design_${this.designs.size + 1}`,
      tenantId: payload.tenantId,
      name: payload.name,
      description: payload.description,
      priceCents: payload.priceCents ?? 0,
      isPublished: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.designs.set(design.id, design);
    return design;
  }

  listByTenant(tenantId: string): readonly WrapDesign[] {
    return Array.from(this.designs.values()).filter((design) => design.tenantId === tenantId);
  }

  getById(tenantId: string, id: string): WrapDesign | null {
    const design = this.designs.get(id);
    if (!design || design.tenantId !== tenantId) {
      return null;
    }

    return design;
  }

  update(payload: UpdateWrapDesignPayload): WrapDesign | null {
    const existing = this.getById(payload.tenantId, payload.id);
    if (!existing) {
      return null;
    }

    const updated: WrapDesign = {
      ...existing,
      name: payload.name ?? existing.name,
      description: payload.description ?? existing.description,
      priceCents: payload.priceCents ?? existing.priceCents,
      isPublished: payload.isPublished ?? existing.isPublished,
      updatedAt: new Date()
    };

    this.designs.set(updated.id, updated);
    return updated;
  }

  delete(tenantId: string, id: string): boolean {
    const existing = this.getById(tenantId, id);
    if (!existing) {
      return false;
    }

    return this.designs.delete(id);
  }
}

export const catalogStore = new CatalogStore();
