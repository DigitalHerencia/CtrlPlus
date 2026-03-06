import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { searchWrapsSchema } from "@/lib/catalog/types";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { WrapFilter } from "@/components/catalog/WrapFilter";

export default async function CatalogPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Browse and manage vehicle wrap designs
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border p-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {session.isAuthenticated
            ? `Authenticated as user ${session.userId}`
            : "Not authenticated"}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {session.tenantId ? `Tenant ID: ${session.tenantId}` : "No tenant context"}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
          Catalog content coming soon...
        </p>
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

