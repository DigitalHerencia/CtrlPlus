import crypto from "crypto";

export interface PreviewCacheKeyInput {
  tenantId: string;
  wrapId: string;
  customerPhotoUrl: string;
  textureId?: string;
  maskModel?: string;
  blendMode?: "multiply" | "overlay";
  opacity?: number;
}

export function buildVisualizerCacheKey(input: PreviewCacheKeyInput): string {
  const normalized = {
    tenantId: input.tenantId,
    wrapId: input.wrapId,
    customerPhotoHash: crypto.createHash("sha256").update(input.customerPhotoUrl).digest("hex"),
    textureId: input.textureId ?? "default",
    maskModel: input.maskModel ?? "facebook/mask2former-swin-large-cityscapes-semantic",
    blendMode: input.blendMode ?? "multiply",
    opacity: Number((input.opacity ?? 0.6).toFixed(2)),
  };

  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}
