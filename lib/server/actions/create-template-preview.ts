import {
  createTemplatePreview,
  type TemplatePreviewInput,
  type TemplatePreviewResult
} from '../../../features/visualizer/template-preview';
import { requirePermission } from '../auth/require-permission';

export interface CreateTemplatePreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: TemplatePreviewInput;
}

export function createTemplatePreviewAction(
  input: CreateTemplatePreviewActionInput
): TemplatePreviewResult {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:read'
  });

  return createTemplatePreview(input.payload);
}

