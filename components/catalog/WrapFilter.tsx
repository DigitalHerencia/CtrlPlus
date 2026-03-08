"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface WrapFilterProps {
  categories?: Array<{ id: string; name: string }>;
}

export function WrapFilter({ categories = [] }: WrapFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQuery = searchParams.get("query") ?? "";
  const [searchValue, setSearchValue] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

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
      if (!("page" in updates)) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams],
  );

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
  const categoryId = searchParams.get("categoryId") ?? "";

  const hasActiveFilters =
    searchValue ||
    maxPrice ||
    categoryId ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc" ||
    pageSize !== "20";

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.75fr))] lg:items-end">
      <div className="flex min-w-[180px] flex-1 flex-col gap-1">
        <label
          htmlFor="catalog-search"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          placeholder="Search wraps..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="app-input"
        />
      </div>

      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="catalog-category"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Category
        </label>
        <select
          id="catalog-category"
          value={categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          className="app-select"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="catalog-max-price"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Max Price (cents)
        </label>
        <input
          id="catalog-max-price"
          type="number"
          placeholder="No limit"
          min={1}
          step={1}
          value={maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          className="app-input"
        />
      </div>

      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="catalog-sort-by"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Sort By
        </label>
        <select
          id="catalog-sort-by"
          value={sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="app-select"
        >
          <option value="createdAt">Date Added</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="catalog-sort-order"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Order
        </label>
        <select
          id="catalog-sort-order"
          value={sortOrder}
          onChange={(e) => handleChange("sortOrder", e.target.value)}
          className="app-select"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="catalog-page-size"
          className="text-xs font-medium tracking-[0.16em] text-neutral-400 uppercase"
        >
          Per Page
        </label>
        <select
          id="catalog-page-size"
          value={pageSize}
          onChange={(e) => handleChange("pageSize", e.target.value)}
          className="app-select"
        >
          <option value="12">12</option>
          <option value="20">20</option>
          <option value="32">32</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isPending}
          className="self-end lg:justify-self-start"
        >
          Clear Filters
        </Button>
      )}

      {isPending && (
        <div className="animate-pulse self-end pb-2 text-xs text-neutral-500 lg:justify-self-end">
          Filtering…
        </div>
      )}
    </div>
  );
}
