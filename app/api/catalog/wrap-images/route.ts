import { addWrapImage } from "@/lib/catalog/actions/manage-wrap-images";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const wrapId = formData.get("wrapId");
    const file = formData.get("file");

    if (typeof wrapId !== "string" || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const image = await addWrapImage({ wrapId, file });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image";
    const status = message.startsWith("Unauthorized")
      ? 401
      : message.startsWith("Forbidden")
        ? 403
        : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
