import { z } from 'zod';

export const previewAssetSchema = z.object({
  previewUrl: z.string().url(),
  source: z.enum(['template', 'upload'])
});
