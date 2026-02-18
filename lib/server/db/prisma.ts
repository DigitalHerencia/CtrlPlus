export interface WrapDesignRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
}

export interface CreateWrapDesignInput {
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
}

export class TenantScopedPrisma {
  private readonly wrapDesigns: WrapDesignRecord[] = [];

  createWrapDesign(input: CreateWrapDesignInput): WrapDesignRecord {
    const record: WrapDesignRecord = {
      id: `wrap_${this.wrapDesigns.length + 1}`,
      tenantId: input.tenantId,
      name: input.name,
      description: input.description
    };

    this.wrapDesigns.push(record);
    return record;
  }

  listWrapDesignsByTenant(tenantId: string): readonly WrapDesignRecord[] {
    return this.wrapDesigns.filter((record) => record.tenantId === tenantId);
  }
}

export const tenantScopedPrisma = new TenantScopedPrisma();

