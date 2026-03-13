import crypto from "crypto";

export interface PreviewCacheKeyInput {
  wrapId: string;
  ownerUserId: string;
  customerPhotoUrl: string;
  textureId?: string;
  sourceAssetVersion?: number;
  maskModel?: string;
  maskModelRevision?: string;
  maskModelProvider?: string;
  blendMode?: "multiply" | "overlay";
  opacity?: number;
}

export function buildVisualizerCacheKey(input: PreviewCacheKeyInput): string {
  const normalized = {
    wrapId: input.wrapId,
    ownerUserId: input.ownerUserId,
    customerPhotoHash: crypto.createHash("sha256").update(input.customerPhotoUrl).digest("hex"),
    textureId: input.textureId ?? "default",
    sourceAssetVersion: input.sourceAssetVersion ?? 0,
    maskModel: input.maskModel ?? "keras/segformer_b1_cityscapes_1024",
    maskModelRevision: input.maskModelRevision ?? "main",
    maskModelProvider: input.maskModelProvider ?? "self-hosted",
    blendMode: input.blendMode ?? "multiply",
    opacity: Number((input.opacity ?? 0.6).toFixed(2)),
  };

  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}
