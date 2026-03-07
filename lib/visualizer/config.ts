export const visualizerConfig = {
  maxUploadSizeBytes: Number(process.env.VISUALIZER_MAX_UPLOAD_SIZE_BYTES ?? 10 * 1024 * 1024),
  supportedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  previewTtlMs: 24 * 60 * 60 * 1000,
  maskModel:
    process.env.HUGGINGFACE_VISUALIZER_MODEL ??
    "facebook/mask2former-swin-large-cityscapes-semantic",
  huggingFaceApiBase:
    process.env.HUGGINGFACE_INFERENCE_API_BASE ?? "https://api-inference.huggingface.co/models",
  huggingFaceToken: process.env.HUGGINGFACE_API_TOKEN,
  huggingFaceTimeoutMs: Number(process.env.HUGGINGFACE_TIMEOUT_MS ?? 12000),
  huggingFaceRetries: Number(process.env.HUGGINGFACE_RETRIES ?? 2),
  blendMode:
    (process.env.VISUALIZER_BLEND_MODE as "multiply" | "overlay" | undefined) ?? "multiply",
  overlayOpacity: Number(process.env.VISUALIZER_OVERLAY_OPACITY ?? 0.58),
};
