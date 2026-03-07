import { getSession } from "@/lib/auth/session";
import { getWrapById } from "@/lib/catalog/fetchers/get-wraps";
import { NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: Context) {
  const { tenantId, userId } = await getSession();

  if (!tenantId || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const wrap = await getWrapById(tenantId, id);

  if (!wrap) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(wrap);
}
