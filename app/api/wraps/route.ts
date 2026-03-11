import { getSession } from "@/lib/auth/session";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { parseCatalogSearchParams } from "@/lib/catalog/search-params";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId, isOwner, isPlatformAdmin } = await getSession();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = parseCatalogSearchParams(Object.fromEntries(url.searchParams.entries()));
  const wraps = await searchWraps(parsed.filters, { includeHidden: isOwner || isPlatformAdmin });

  return NextResponse.json(wraps);
}
