"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function WrapFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 on filter changes (unless explicitly setting page)
      if (!("page" in updates)) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleChange = useCallback(
    (key: string, value: string) => {
      startTransition(() => {
        router.push(`${pathname}?${createQueryString({ [key]: value || undefined })}`);
      });
    },
    [router, pathname, createQueryString],
  );

  const handleReset = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  const query = searchParams.get("query") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const hasActiveFilters = query || maxPrice || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">
      {/* Search input */}
      <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label htmlFor="catalog-search" className="text-xs font-medium text-muted-foreground">
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          placeholder="Search wraps..."
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Max price input */}
      <div className="flex flex-col gap-1 w-full sm:w-36">
        <label htmlFor="catalog-max-price" className="text-xs font-medium text-muted-foreground">
          Max Price
        </label>
        <input
          id="catalog-max-price"
          type="number"
          placeholder="No limit"
          min={1}
          value={maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Sort by */}
      <div className="flex flex-col gap-1 w-full sm:w-40">
        <label htmlFor="catalog-sort-by" className="text-xs font-medium text-muted-foreground">
          Sort By
        </label>
        <select
          id="catalog-sort-by"
          value={sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="createdAt">Date Added</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* Sort order */}
      <div className="flex flex-col gap-1 w-full sm:w-32">
        <label htmlFor="catalog-sort-order" className="text-xs font-medium text-muted-foreground">
          Order
        </label>
        <select
          id="catalog-sort-order"
          value={sortOrder}
          onChange={(e) => handleChange("sortOrder", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isPending}
          className="self-end"
        >
          Clear Filters
        </Button>
      )}

      {isPending && (
        <div className="self-end pb-2 text-xs text-muted-foreground animate-pulse">
          Filtering…
        </div>
      )}
    </div>
  );
}
