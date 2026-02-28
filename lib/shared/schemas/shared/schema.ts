import { z } from 'zod';

export const tenantScopedIdSchema = z.string().min(1);
export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(200)
});
