import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const WrapStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DRAFT: "DRAFT",
} as const;

export type WrapStatus = (typeof WrapStatus)[keyof typeof WrapStatus];

export const WrapCategory = {
  FULL_WRAP: "FULL_WRAP",
  PARTIAL_WRAP: "PARTIAL_WRAP",
  ACCENT: "ACCENT",
  PAINT_PROTECTION_FILM: "PAINT_PROTECTION_FILM",
} as const;

export type WrapCategory = (typeof WrapCategory)[keyof typeof WrapCategory];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** Read model returned by catalog fetchers. Never exposes raw Prisma model. */
export interface WrapDTO {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  /** Price as a string to preserve decimal precision (Prisma Decimal → string) */
  price: string;
  estimatedHours: number;
  status: WrapStatus;
  imageUrls: string[];
  category: WrapCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface WrapListDTO {
  wraps: WrapDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

/** Explicit Prisma `select` object for WrapDTO fields. */
export const wrapDTOFields = {
  id: true,
  tenantId: true,
  name: true,
  description: true,
  price: true,
  estimatedHours: true,
  status: true,
  imageUrls: true,
  category: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createWrapSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
  estimatedHours: z
    .number()
    .int()
    .positive("Estimated hours must be a positive integer"),
  imageUrls: z.array(z.url()).min(1, "At least one image is required"),
  category: z.enum([
    "FULL_WRAP",
    "PARTIAL_WRAP",
    "ACCENT",
    "PAINT_PROTECTION_FILM",
  ]),
});

export type CreateWrapInput = z.infer<typeof createWrapSchema>;

export const updateWrapSchema = createWrapSchema.partial();

export type UpdateWrapInput = z.infer<typeof updateWrapSchema>;

export const searchWrapsSchema = z.object({
  query: z.string().max(200).optional(),
  category: z
    .enum(["FULL_WRAP", "PARTIAL_WRAP", "ACCENT", "PAINT_PROTECTION_FILM"])
    .optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type SearchWrapsInput = z.infer<typeof searchWrapsSchema>;
