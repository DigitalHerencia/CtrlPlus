import { z } from "zod";

/** DTO returned from fetchers — never expose raw DB model fields */
export interface PreviewSessionDTO {
  id: string;
  wrapId: string;
  wrapName: string;
  vehicleImageUrl: string;
  previewImageUrl: string;
  mode: "upload" | "template";
  createdAt: Date;
}

/**
 * Input schema for saving a preview session.
 * vehicleImageUrl / previewImageUrl accept any non-empty string because,
 * before storage integration, the client passes a temporary object URL.
 * TODO: Tighten to z.string().url() once file storage (e.g. S3) is wired up.
 */
export const savePreviewSessionSchema = z.object({
  wrapId: z.string().min(1, "Wrap ID is required"),
  wrapName: z.string().min(1, "Wrap name is required").max(100),
  vehicleImageUrl: z.string().min(1, "Vehicle image URL is required"),
  previewImageUrl: z.string().min(1, "Preview image URL is required"),
  mode: z.enum(["upload", "template"]),
});

export type SavePreviewSessionInput = z.infer<typeof savePreviewSessionSchema>;

/** Explicit select map for future Prisma queries */
export const previewSessionDTOFields = {
  id: true,
  wrapId: true,
  wrapName: true,
  vehicleImageUrl: true,
  previewImageUrl: true,
  mode: true,
  createdAt: true,
} as const;
