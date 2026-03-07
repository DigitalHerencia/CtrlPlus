import sharp from "sharp";
import { visualizerConfig } from "@/lib/visualizer/config";

interface HfSegmentationResult {
  label?: string;
  score?: number;
  mask?: string;
}

const VEHICLE_LABELS = new Set(["car", "truck", "bus", "vehicle"]);

async function callHf(imageBuffer: Buffer): Promise<HfSegmentationResult[]> {
  if (!visualizerConfig.huggingFaceToken) {
    throw new Error("HUGGINGFACE_API_TOKEN is required for segmentation");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), visualizerConfig.huggingFaceTimeoutMs);

  try {
    const response = await fetch(
      `${visualizerConfig.huggingFaceApiBase}/${encodeURIComponent(visualizerConfig.maskModel)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${visualizerConfig.huggingFaceToken}`,
          "Content-Type": "application/octet-stream",
        },
        body: new Uint8Array(imageBuffer),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`HF inference failed: ${response.status}`);
    }

    return (await response.json()) as HfSegmentationResult[];
  } finally {
    clearTimeout(timeout);
  }
}

export async function createVehicleMask(imageBuffer: Buffer): Promise<Buffer> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= visualizerConfig.huggingFaceRetries; attempt += 1) {
    try {
      const results = await callHf(imageBuffer);
      const candidate = results
        .filter((item) => item.mask && item.label && VEHICLE_LABELS.has(item.label.toLowerCase()))
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];

      if (!candidate?.mask) throw new Error("No vehicle labels found in segmentation output");

      return Buffer.from(candidate.mask, "base64");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown HF inference error");
      if (attempt === visualizerConfig.huggingFaceRetries) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error("Failed to generate vehicle mask");
}

export async function fallbackCenterMask(imageBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  if (!metadata.width || !metadata.height) throw new Error("Invalid source image dimensions");

  const svgMask = `
    <svg width="${metadata.width}" height="${metadata.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <ellipse cx="${metadata.width / 2}" cy="${metadata.height * 0.58}" rx="${metadata.width * 0.4}" ry="${metadata.height * 0.23}" fill="white"/>
    </svg>
  `;

  return sharp(Buffer.from(svgMask)).png().toBuffer();
}
