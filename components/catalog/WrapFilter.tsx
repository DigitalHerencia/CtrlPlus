"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function WrapFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local controlled state for the search input so we can debounce URL updates.
  const urlQuery = searchParams.get("query") ?? "";
  const [searchValue, setSearchValue] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when URL changes externally (e.g., browser back/forward).
  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

  // Clear any pending debounce when the component unmounts.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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

  /** Push a URL update, omitting the trailing `?` when the query string is empty. */
  const pushUrl = useCallback(
    (queryString: string) => {
      startTransition(() => {
        if (queryString) {
          router.push(`${pathname}?${queryString}`);
        } else {
          router.push(pathname);
        }
      });
    },
    [router, pathname],
  );

  const handleChange = useCallback(
    (key: string, value: string) => {
      pushUrl(createQueryString({ [key]: value || undefined }));
    },
    [pushUrl, createQueryString],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushUrl(createQueryString({ query: value || undefined }));
      }, 300);
    },
    [pushUrl, createQueryString],
  );

  const handleReset = useCallback(() => {
    setSearchValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const pageSize = searchParams.get("pageSize") ?? "20";

  const hasActiveFilters =
    searchValue || maxPrice || sortBy !== "createdAt" || sortOrder !== "desc" || pageSize !== "20";

  return (
    <div className="flex flex-col flex-wrap items-start gap-3 sm:flex-row sm:items-end">
      {/* Search input */}
      <div className="flex min-w-[180px] flex-1 flex-col gap-1">
        <label htmlFor="catalog-search" className="text-xs font-medium text-muted-foreground">
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          placeholder="Search wraps..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Max price input */}
      <div className="flex w-full flex-col gap-1 sm:w-36">
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
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Sort by */}
      <div className="flex w-full flex-col gap-1 sm:w-40">
        <label htmlFor="catalog-sort-by" className="text-xs font-medium text-muted-foreground">
          Sort By
        </label>
        <select
          id="catalog-sort-by"
          value={sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="createdAt">Date Added</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* Sort order */}
      <div className="flex w-full flex-col gap-1 sm:w-32">
        <label htmlFor="catalog-sort-order" className="text-xs font-medium text-muted-foreground">
          Order
        </label>
        <select
          id="catalog-sort-order"
          value={sortOrder}
          onChange={(e) => handleChange("sortOrder", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Page size */}
      <div className="flex w-full flex-col gap-1 sm:w-32">
        <label htmlFor="catalog-page-size" className="text-xs font-medium text-muted-foreground">
          Per Page
        </label>
        <select
          id="catalog-page-size"
          value={pageSize}
          onChange={(e) => handleChange("pageSize", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="12">12</option>
          <option value="20">20</option>
          <option value="32">32</option>
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
        <div className="animate-pulse self-end pb-2 text-xs text-muted-foreground">Filtering…</div>
      )}
    </div>
  );
}
