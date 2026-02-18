export interface WrapDesign {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
  readonly priceCents: number;
  readonly isPublished: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateWrapDesignPayload {
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
  readonly priceCents?: number;
}

export interface UpdateWrapDesignPayload {
  readonly tenantId: string;
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly priceCents?: number;
  readonly isPublished?: boolean;
}

