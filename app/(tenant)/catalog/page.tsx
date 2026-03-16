import Link from "next/link";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { WrapFilter } from "@/components/catalog/WrapFilter";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getWrapCategories } from "@/lib/catalog/fetchers/get-wrap-categories";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { parseCatalogSearchParams } from "@/lib/catalog/search-params";
import { redirect } from "next/navigation";

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const session = await getSession();
  const parsedSearch = parseCatalogSearchParams(await searchParams);
  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  const canManageCatalog = hasCapability(session.authz, "catalog.manage");
  const [data, categories] = await Promise.all([
    searchWraps(parsedSearch.filters, { includeHidden: canManageCatalog }),
    getWrapCategories(),
  ]);

  const createPageHref = (page: number) => {
    const params = new URLSearchParams();
    const { filters } = parsedSearch;

    if (filters.query) {
      params.set("query", filters.query);
    }

    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", String(filters.maxPrice));
    }

    if (filters.categoryId) {
      params.set("categoryId", filters.categoryId);
    }

    if (filters.sortBy !== "createdAt") {
      params.set("sortBy", filters.sortBy ?? "createdAt");
    }

    if (filters.sortOrder !== "desc") {
      params.set("sortOrder", filters.sortOrder ?? "desc");
    }

    if (filters.pageSize !== 20) {
      params.set("pageSize", String(filters.pageSize));
    }

    params.set("page", String(page));

    const query = params.toString();
    return query ? `/catalog?${query}` : "/catalog";
  };

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Catalog"
        title="Vehicle Wrap Collection"
        description="Explore premium wrap packages, compare finishes, and jump into detail views with a single consistent storefront system."
        actions={
          canManageCatalog ? (
            <Button asChild>
              <Link href="/catalog/manage">Manage Catalog</Link>
            </Button>
          ) : null
        }
        detail={
          data ? (
            <div className="border border-neutral-700 bg-neutral-900 px-5 py-4 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Results</p>
              <p className="text-3xl font-black tabular-nums text-neutral-100">{data.total}</p>
            </div>
          ) : null
        }
      />

      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardContent className="pt-6">
          <WrapFilter categories={categories} />
        </CardContent>
      </Card>

      {parsedSearch.hasActiveFilters && (
        <p className="text-sm text-neutral-400">
          Showing filtered results for your catalog search.
        </p>
      )}
      <WrapGrid wraps={data.wraps} canManageCatalog={canManageCatalog} />
      <CatalogPagination
        page={data.page}
        totalPages={data.totalPages}
        createPageHref={createPageHref}
      />
    </div>
  );
}
