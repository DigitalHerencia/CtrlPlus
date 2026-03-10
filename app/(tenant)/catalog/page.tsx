import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { WrapFilter } from "@/components/catalog/WrapFilter";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceEmptyState, WorkspacePageIntro } from "@/components/layout/page-elements";
import { getSession } from "@/lib/auth/session";
import { getWrapCategoriesForTenant } from "@/lib/catalog/fetchers/get-wrap-categories";
import { searchWraps } from "@/lib/catalog/fetchers/get-wraps";
import { parseCatalogSearchParams } from "@/lib/catalog/search-params";

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { tenantId, userId } = await getSession();
  const parsedSearch = parseCatalogSearchParams(await searchParams);

  const [data, categories] =
    userId && tenantId
      ? await Promise.all([
          searchWraps(tenantId, parsedSearch.filters),
          getWrapCategoriesForTenant(tenantId),
        ])
      : [null, []];

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
        detail={
          data ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 px-5 py-4 text-right">
              <p className="text-[11px] tracking-[0.18em] text-neutral-400 uppercase">Results</p>
              <p className="text-3xl font-black text-neutral-100 tabular-nums">{data.total}</p>
            </div>
          ) : null
        }
      />

      <Card className="app-panel">
        <CardContent className="pt-6">
          <WrapFilter categories={categories} />
        </CardContent>
      </Card>

      {!data ? (
        <WorkspaceEmptyState
          title="Sign in to browse your catalog"
          description="Catalog results and category filters are only available inside an authenticated tenant workspace."
        />
      ) : (
        <>
          {parsedSearch.hasActiveFilters && (
            <p className="text-sm text-neutral-400">
              Showing filtered results for your catalog search.
            </p>
          )}
          <WrapGrid wraps={data.wraps} />
          <CatalogPagination
            page={data.page}
            totalPages={data.totalPages}
            createPageHref={createPageHref}
          />
        </>
      )}
    </div>
  );
}
