import { createHash, randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const imageExtByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024;

interface PersistedWrapImage {
  url: string;
  contentHash: string;
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string | null;
  apiSecret: string | null;
  uploadPreset: string | null;
  folder: string;
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  if (!cloudName) return null;

  return {
    cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY?.trim() ?? null,
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim() ?? null,
    uploadPreset: process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null,
    folder: process.env.CLOUDINARY_WRAP_FOLDER?.trim() || "ctrlplus/wraps",
  };
}

function computeContentHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function toBlob(buffer: Buffer, type: string): Blob {
  return new Blob([new Uint8Array(buffer)], { type });
}

function buildCloudinarySignature(payload: Record<string, string>, apiSecret: string): string {
  const signingString = Object.keys(payload)
    .sort()
    .map((key) => `${key}=${payload[key]}`)
    .join("&");

  return createHash("sha1").update(`${signingString}${apiSecret}`).digest("hex");
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("res.cloudinary.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex < 0 || uploadIndex + 1 >= segments.length) return null;

    const publicIdSegments = segments.slice(uploadIndex + 1);
    if (publicIdSegments[0] && /^v\d+$/.test(publicIdSegments[0])) {
      publicIdSegments.shift();
    }

    if (publicIdSegments.length === 0) return null;

    const last = publicIdSegments[publicIdSegments.length - 1] ?? "";
    publicIdSegments[publicIdSegments.length - 1] = last.replace(/\.[a-zA-Z0-9]+$/, "");

    return publicIdSegments.join("/");
  } catch {
    return null;
  }
}

async function uploadToCloudinary(params: {
  config: CloudinaryConfig;
  wrapId: string;
  file: File;
  buffer: Buffer;
}): Promise<string> {
  const ext = imageExtByType[params.file.type] ?? "png";
  const publicId = `${params.config.folder}/${params.wrapId}-${randomUUID()}`;
  const endpoint = `https://api.cloudinary.com/v1_1/${params.config.cloudName}/image/upload`;
  const formData = new FormData();

  formData.set("file", toBlob(params.buffer, params.file.type), `${publicId}.${ext}`);

  if (params.config.uploadPreset) {
    formData.set("upload_preset", params.config.uploadPreset);
    formData.set("public_id", publicId);
  } else {
    if (!params.config.apiKey || !params.config.apiSecret) {
      throw new Error(
        "Cloudinary upload requires CLOUDINARY_WRAP_UPLOAD_PRESET or CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.",
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = buildCloudinarySignature(
      { public_id: publicId, timestamp },
      params.config.apiSecret,
    );

    formData.set("public_id", publicId);
    formData.set("timestamp", timestamp);
    formData.set("api_key", params.config.apiKey);
    formData.set("signature", signature);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const payload = (await response.json()) as { secure_url?: string };
  if (!payload.secure_url) {
    throw new Error("Cloudinary upload did not return a secure URL");
  }

  return payload.secure_url;
}

export function validateWrapImageFile(file: File): void {
  if (!allowedImageMimeTypes.has(file.type)) {
    throw new Error("Unsupported image format. Allowed: JPEG, PNG, WEBP.");
  }

  if (file.size <= 0 || file.size > MAX_WRAP_IMAGE_BYTES) {
    throw new Error("Image exceeds size limit of 5MB.");
  }
}

async function persistWrapImageLocally(params: {
  wrapId: string;
  file: File;
  buffer: Buffer;
  contentHash: string;
}): Promise<PersistedWrapImage> {
  const ext = imageExtByType[params.file.type];
  const fileName = `${params.wrapId}-${randomUUID()}.${ext}`;
  const relativeDir = path.join("uploads", "wraps");
  const relativePath = path.join(relativeDir, fileName);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, params.buffer);

  return {
    url: `/${relativePath.replaceAll(path.sep, "/")}`,
    contentHash: params.contentHash,
  };
}

export async function persistWrapImage(params: {
  wrapId: string;
  file: File;
}): Promise<PersistedWrapImage> {
  validateWrapImageFile(params.file);

  const buffer = Buffer.from(await params.file.arrayBuffer());
  const contentHash = computeContentHash(buffer);
  const cloudinaryConfig = getCloudinaryConfig();

  if (cloudinaryConfig) {
    const url = await uploadToCloudinary({
      config: cloudinaryConfig,
      wrapId: params.wrapId,
      file: params.file,
      buffer,
    });

    return { url, contentHash };
  }

  return persistWrapImageLocally({
    wrapId: params.wrapId,
    file: params.file,
    buffer,
    contentHash,
  });
}

export async function deletePersistedWrapImage(url: string): Promise<void> {
  const cloudinaryConfig = getCloudinaryConfig();
  const cloudinaryPublicId = extractCloudinaryPublicId(url);

  if (
    cloudinaryConfig &&
    cloudinaryPublicId &&
    cloudinaryConfig.apiKey &&
    cloudinaryConfig.apiSecret
  ) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = buildCloudinarySignature(
        { public_id: cloudinaryPublicId, timestamp },
        cloudinaryConfig.apiSecret,
      );

      await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          public_id: cloudinaryPublicId,
          timestamp,
          api_key: cloudinaryConfig.apiKey,
          signature,
        }),
      });
      return;
    } catch {
      // fall through to local deletion fallback
    }
  }

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
