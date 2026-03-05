import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const WrapStatusEnum = z.enum(["ACTIVE", "ARCHIVED"]);
export type WrapStatus = z.infer<typeof WrapStatusEnum>;

export const WrapCategoryEnum = z.enum([
  "FULL_WRAP",
  "PARTIAL_WRAP",
  "DECAL",
  "TINT",
  "PAINT_PROTECTION",
]);
export type WrapCategory = z.infer<typeof WrapCategoryEnum>;

// ─── DTO ──────────────────────────────────────────────────────────────────────

export interface WrapDTO {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  price: string; // Decimal serialised as string for safe JSON transport
  estimatedHours: number;
  status: WrapStatus;
  imageUrls: string[];
  category: WrapCategory;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Input schemas ────────────────────────────────────────────────────────────

export const createWrapSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive("Price must be positive"),
  estimatedHours: z
    .number()
    .int()
    .positive("Estimated hours must be a positive integer"),
  imageUrls: z.array(z.string().url()).default([]),
  category: WrapCategoryEnum,
  status: WrapStatusEnum.default("ACTIVE"),
});

export type CreateWrapInput = z.infer<typeof createWrapSchema>;

export const updateWrapSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  estimatedHours: z.number().int().positive().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  category: WrapCategoryEnum.optional(),
  status: WrapStatusEnum.optional(),
});

export type UpdateWrapInput = z.infer<typeof updateWrapSchema>;
