import { put } from "@vercel/blob";

export async function storePreviewImage(params: {
  previewId: string;
  buffer: Buffer;
  contentType?: string;
}): Promise<string> {
  const filename = `visualizer/previews/${params.previewId}.png`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const result = await put(filename, params.buffer, {
      access: "public",
      contentType: params.contentType ?? "image/png",
      addRandomSuffix: false,
    });
    return result.url;
  }

  return `data:${params.contentType ?? "image/png"};base64,${params.buffer.toString("base64")}`;
}
