import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const imageExtByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateWrapImageFile(file: File): void {
  if (!allowedImageMimeTypes.has(file.type)) {
    throw new Error("Unsupported image format. Allowed: JPEG, PNG, WEBP.");
  }

  if (file.size <= 0 || file.size > MAX_WRAP_IMAGE_BYTES) {
    throw new Error("Image exceeds size limit of 5MB.");
  }
}

export async function persistWrapImage(params: {
  tenantId: string;
  wrapId: string;
  file: File;
}): Promise<string> {
  validateWrapImageFile(params.file);

  const ext = imageExtByType[params.file.type];
  const fileName = `${params.tenantId}-${params.wrapId}-${randomUUID()}.${ext}`;
  const relativeDir = path.join("uploads", "wraps");
  const relativePath = path.join(relativeDir, fileName);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await mkdir(absoluteDir, { recursive: true });

  const buffer = Buffer.from(await params.file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return `/${relativePath.replaceAll(path.sep, "/")}`;
}

export async function deletePersistedWrapImage(url: string): Promise<void> {
  if (!url.startsWith("/uploads/wraps/")) {
    return;
  }

  const absolutePath = path.join(process.cwd(), "public", ...url.split("/").filter(Boolean));

  try {
    await unlink(absolutePath);
  } catch {
    // Intentionally swallow cleanup errors. DB soft-delete is authoritative.
  }
}
