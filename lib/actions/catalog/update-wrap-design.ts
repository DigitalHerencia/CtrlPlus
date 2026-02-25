import { z } from 'zod';

import type { UpdateWrapDesignPayload, WrapDesign } from '../../../features/catalog/types';
import { requirePermission } from '../../auth/require-permission';
import { catalogStore } from '../../fetchers/catalog/store';
import { requireTenant } from '../../tenancy/require-tenant';
import { headerSchema, validateActionInput } from '../validation';

export interface UpdateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: UpdateWrapDesignPayload;
}

const updateWrapDesignPayloadSchema = z.object({
  tenantId: z.string().min(1),
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  isPublished: z.boolean().optional()
});

const updateWrapDesignActionInputSchema = z.object({
  headers: headerSchema,
  payload: updateWrapDesignPayloadSchema
});

export async function updateWrapDesign(input: UpdateWrapDesignActionInput): Promise<WrapDesign | null> {
  const validatedInput = validateActionInput(updateWrapDesignActionInputSchema, input);

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

  return catalogStore.update({
    ...validatedInput.payload,
    tenantId
  });
}
