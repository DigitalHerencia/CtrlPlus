import { z } from 'zod';

import type { CreateWrapDesignPayload, WrapDesign } from '../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';
import { headerSchema, validateActionInput } from '../validation';

export interface CreateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: CreateWrapDesignPayload;
}

const createWrapDesignPayloadSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().nonnegative().optional()
});

const createWrapDesignActionInputSchema = z.object({
  headers: headerSchema,
  payload: createWrapDesignPayloadSchema
});

export async function createWrapDesign(input: CreateWrapDesignActionInput): Promise<WrapDesign> {
  const validatedInput = validateActionInput(createWrapDesignActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.payload.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:write'
  });

  return catalogStore.create({
    ...validatedInput.payload,
    tenantId
  });
}
