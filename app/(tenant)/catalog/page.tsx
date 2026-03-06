import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { searchWrapsSchema } from "@/lib/catalog/types";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { WrapFilter } from "@/components/catalog/WrapFilter";

interface CatalogPageProps {
  searchParams: Promise<{
    query?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { user, tenantId } = await getSession();

  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;

  // Coerce URL string params to numbers with explicit validation.
  // Use safeParse + fallback so invalid params (e.g. ?maxPrice=abc) degrade
  // gracefully to defaults rather than throwing a 500.
  const rawMaxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const rawPage = params.page ? Number(params.page) : undefined;

  const parseResult = searchWrapsSchema.safeParse({
    query: params.query ?? undefined,
    maxPrice: rawMaxPrice !== undefined && !Number.isNaN(rawMaxPrice) ? rawMaxPrice : undefined,
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? "desc",
    page: rawPage !== undefined && !Number.isNaN(rawPage) ? rawPage : 1,
    pageSize: 20,
  });

  const filters = parseResult.success
    ? parseResult.data
    : { page: 1, pageSize: 20 as const, sortBy: "createdAt" as const, sortOrder: "desc" as const };

  const { wraps, total, page, totalPages } = await searchWraps(tenantId, filters);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Browse and manage vehicle wrap designs
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border p-4">
        <Suspense fallback={<div className="h-9 animate-pulse bg-neutral-100 rounded" />}>
          <WrapFilter />
        </Suspense>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "No wraps found"
            : `Showing ${wraps.length} of ${total} wrap${total !== 1 ? "s" : ""}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* Grid */}
      <WrapGrid wraps={wraps} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {page > 1 && (
            <a
              href={`/catalog?${buildPageUrl(params, page - 1)}`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              ← Previous
            </a>
          )}
          {page < totalPages && (
            <a
              href={`/catalog?${buildPageUrl(params, page + 1)}`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function buildPageUrl(
  params: Record<string, string | undefined>,
  targetPage: number,
): string {
  const urlParams = new URLSearchParams();
  if (params.query) urlParams.set("query", params.query);
  if (params.maxPrice) urlParams.set("maxPrice", params.maxPrice);
  if (params.sortBy) urlParams.set("sortBy", params.sortBy);
  if (params.sortOrder) urlParams.set("sortOrder", params.sortOrder);
  if (targetPage > 1) urlParams.set("page", String(targetPage));
  return urlParams.toString();
}

