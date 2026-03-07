import { getSession } from "@/lib/auth/session";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { parseCatalogSearchParams } from "@/lib/catalog/search-params";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { tenantId, userId } = await getSession();

  if (!tenantId || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = parseCatalogSearchParams(Object.fromEntries(url.searchParams.entries()));
  const wraps = await searchWraps(tenantId, parsed.filters);

  return NextResponse.json(wraps);
}
