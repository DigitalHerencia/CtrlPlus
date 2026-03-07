import sharp from "sharp";

export async function compositeVehicleWrap(params: {
  photoBuffer: Buffer;
  maskBuffer: Buffer;
  textureBuffer: Buffer;
  opacity: number;
  blend: "multiply" | "overlay";
}): Promise<Buffer> {
  const baseMetadata = await sharp(params.photoBuffer).metadata();
  if (!baseMetadata.width || !baseMetadata.height) {
    throw new Error("Unable to read uploaded photo dimensions");
  }

  const width = baseMetadata.width;
  const height = baseMetadata.height;

  const resizedTexture = await sharp(params.textureBuffer)
    .resize(width, height, { fit: "cover" })
    .ensureAlpha(params.opacity)
    .png()
    .toBuffer();

  const maskedTexture = await sharp(resizedTexture)
    .composite([{ input: params.maskBuffer, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(params.photoBuffer)
    .composite([{ input: maskedTexture, blend: params.blend }])
    .png()
    .toBuffer();
}
