import {
  createTemplatePreview,
  type TemplatePreviewInput,
  type TemplatePreviewResult
} from '../../features/visualizer/template-preview';
import { requirePermission } from '../auth/require-permission';
import { requireTenant } from '../tenancy/require-tenant';

export interface CreateTemplatePreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly payload: TemplatePreviewInput;
}

export async function createTemplatePreviewAction(
  input: CreateTemplatePreviewActionInput
): Promise<TemplatePreviewResult> {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:read'
  });

  return createTemplatePreview(input.payload);
}
