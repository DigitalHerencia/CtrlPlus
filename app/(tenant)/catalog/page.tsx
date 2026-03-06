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

  // Parse and validate search params with safe defaults
  const filters = searchWrapsSchema.parse({
    query: params.query ?? undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? "desc",
    page: params.page ? Number(params.page) : 1,
    pageSize: 20,
  });

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

