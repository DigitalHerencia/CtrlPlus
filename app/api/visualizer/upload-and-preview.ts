import { uploadAndGeneratePreview } from "@/lib/visualizer/actions/upload-and-preview";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("wrapId" in body) ||
      !("customerPhotoUrl" in body)
    ) {
      return new NextResponse("Invalid request body", { status: 400 });
    }
    const { wrapId, customerPhotoUrl } = body as { wrapId: string; customerPhotoUrl: string };
    const result = await uploadAndGeneratePreview({ wrapId, customerPhotoUrl });
    return NextResponse.json(result);
  } catch {
    return new NextResponse("Upload failed", { status: 400 });
  }
}
