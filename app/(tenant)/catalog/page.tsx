import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { WrapFilter } from "@/components/catalog/WrapFilter";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { Card, CardContent } from "@/components/ui/card";
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
      <section className="rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card to-card/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Catalog</p>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Wrap Collection</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore premium wraps, compare price points, and choose the perfect finish for your
              fleet.
            </p>
          </div>
          {data && (
            <div className="rounded-xl border bg-background/70 px-4 py-3 text-right">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Results</p>
              <p className="text-2xl font-semibold tabular-nums">{data.total}</p>
            </div>
          )}
        </div>
      </section>

      <Card className="border-border/70 bg-card/80">
        <CardContent className="pt-6">
          <WrapFilter categories={categories} />
        </CardContent>
      </Card>

      {!data ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Sign in to browse your tenant catalog.
          </CardContent>
        </Card>
      ) : (
        <>
          {parsedSearch.hasActiveFilters && (
            <p className="text-sm text-muted-foreground">
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
