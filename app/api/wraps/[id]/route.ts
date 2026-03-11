import { getSession } from "@/lib/auth/session";
import { getWrapById } from "@/lib/catalog/fetchers/get-wraps";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, isOwner, isPlatformAdmin } = await getSession();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const wrap = await getWrapById(id, { includeHidden: isOwner || isPlatformAdmin });

  if (!wrap) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(wrap);
}
