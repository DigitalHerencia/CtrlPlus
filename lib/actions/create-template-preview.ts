import { z } from 'zod';

import {
  createTemplatePreview,
  TEMPLATE_STYLES,
  type TemplatePreviewInput,
  type TemplatePreviewResult
} from '../../features/visualizer/template-preview';
import { requirePermission } from '../auth/require-permission';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './validation';

export interface CreateTemplatePreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly payload: TemplatePreviewInput;
}

const templatePreviewPayloadSchema = z.object({
  templateStyle: z.enum(TEMPLATE_STYLES),
  wrapName: z.string().trim().min(1).max(120),
  primaryColor: z.string().trim().min(1).max(50),
  accentColor: z.string().trim().min(1).max(50),
  vehicleName: z.string().trim().min(1).max(120)
});

const createTemplatePreviewActionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  payload: templatePreviewPayloadSchema
});

export async function createTemplatePreviewAction(
  input: CreateTemplatePreviewActionInput
): Promise<TemplatePreviewResult> {
  const validatedInput = validateActionInput(createTemplatePreviewActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:read'
  });

  return createTemplatePreview(validatedInput.payload);
}
