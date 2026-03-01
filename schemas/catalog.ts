import { z } from 'zod';

import { paginationSchema, tenantScopedIdSchema } from './shared';

const WRAP_CATALOG_SORT_FIELDS = ['createdAt', 'updatedAt', 'name', 'priceCents'] as const;
const WRAP_CATALOG_SORT_DIRECTIONS = ['asc', 'desc'] as const;
const WRAP_CATALOG_PAGE_SIZE_VALUES = ['12', '24', '48'] as const;

export const wrapCatalogItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  priceCents: z.number().int().nonnegative(),
  isPublished: z.boolean(),
  createdAtIso: z.string().datetime(),
  updatedAtIso: z.string().datetime()
});

const wrapCatalogSearchSchema = z.object({
  query: z.string().trim().min(1).max(120).optional()
});

const wrapCatalogFilterSchema = z.object({
  isPublished: z.boolean().optional(),
  minPriceCents: z.number().int().nonnegative().optional(),
  maxPriceCents: z.number().int().nonnegative().optional()
}).refine(
  (filter) =>
    filter.minPriceCents === undefined
    || filter.maxPriceCents === undefined
    || filter.minPriceCents <= filter.maxPriceCents,
  {
    message: 'filter.minPriceCents must be less than or equal to filter.maxPriceCents',
    path: ['minPriceCents']
  }
);

const wrapCatalogSortSchema = z.object({
  field: z.enum(WRAP_CATALOG_SORT_FIELDS),
  direction: z.enum(WRAP_CATALOG_SORT_DIRECTIONS)
});

export const wrapCatalogListRequestSchema = z.object({
  tenantId: tenantScopedIdSchema,
  search: wrapCatalogSearchSchema.optional(),
  filter: wrapCatalogFilterSchema.optional(),
  sort: wrapCatalogSortSchema.optional(),
  pagination: paginationSchema
});

export const wrapCatalogListResponseSchema = z.object({
  items: z.array(wrapCatalogItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  pageCount: z.number().int().nonnegative(),
  hasNextPage: z.boolean()
});

export const wrapCatalogGetRequestSchema = z.object({
  tenantId: tenantScopedIdSchema,
  id: z.string().min(1)
});

const wrapCatalogNameSchema = z.string().trim().min(1).max(120);
const wrapCatalogDescriptionSchema = z.string().trim().max(2000).transform((value) => {
  return value.length > 0 ? value : undefined;
});
const wrapCatalogPriceSchema = z.number().int().nonnegative();
const nonNegativeIntegerStringSchema = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || /^\d+$/.test(value), {
    message: 'Enter a whole number greater than or equal to zero'
  });

export const wrapCatalogListControlsFormSchema = z.object({
  q: z.string().trim().max(120),
  minPriceCents: nonNegativeIntegerStringSchema,
  maxPriceCents: nonNegativeIntegerStringSchema,
  sort: z.enum(WRAP_CATALOG_SORT_FIELDS),
  direction: z.enum(WRAP_CATALOG_SORT_DIRECTIONS),
  pageSize: z.enum(WRAP_CATALOG_PAGE_SIZE_VALUES)
}).refine(
  (values) => {
    if (values.minPriceCents.length === 0 || values.maxPriceCents.length === 0) {
      return true;
    }

    return Number(values.minPriceCents) <= Number(values.maxPriceCents);
  },
  {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['minPriceCents']
  }
);

export const wrapCatalogCreateFormSchema = z.object({
  name: wrapCatalogNameSchema,
  description: z.string().trim().max(2000),
  priceCents: nonNegativeIntegerStringSchema
}).strict();

export const wrapCatalogEditorFormSchema = wrapCatalogCreateFormSchema.extend({
  isPublished: z.enum(['true', 'false']).optional()
}).strict();

export const wrapCatalogUpdateFormSchema = wrapCatalogCreateFormSchema.extend({
  isPublished: z.enum(['true', 'false'])
}).strict();

export const wrapCatalogCreatePayloadSchema = z.object({
  name: wrapCatalogNameSchema,
  description: wrapCatalogDescriptionSchema.optional(),
  priceCents: wrapCatalogPriceSchema.optional()
}).strict();

export const wrapCatalogUpdatePayloadSchema = z.object({
  id: z.string().min(1),
  name: wrapCatalogNameSchema.optional(),
  description: wrapCatalogDescriptionSchema.optional(),
  priceCents: wrapCatalogPriceSchema.optional(),
  isPublished: z.boolean().optional()
}).strict().refine(
  (payload) => {
    return payload.name !== undefined
      || payload.description !== undefined
      || payload.priceCents !== undefined
      || payload.isPublished !== undefined;
  },
  {
    message: 'At least one mutable field must be provided',
    path: ['id']
  }
);

export const wrapCatalogDeletePayloadSchema = z.object({
  id: z.string().min(1)
}).strict();
