import { describe, expect, it } from "vitest";

import { parseCatalogSearchParams } from "../search-params";

describe("parseCatalogSearchParams", () => {
  it("parses valid filters and pagination values", () => {
    const result = parseCatalogSearchParams({
      query: "matte",
      maxPrice: "160000",
      sortBy: "price",
      sortOrder: "asc",
      page: "2",
      pageSize: "12",
      categoryId: "cat-1",
    });

    expect(result.filters).toMatchObject({
      query: "matte",
      maxPrice: 160000,
      sortBy: "price",
      sortOrder: "asc",
      page: 2,
      pageSize: 12,
      categoryId: "cat-1",
    });
    expect(result.hasActiveFilters).toBe(true);
  });

  it("defaults to safe values when numeric params are invalid", () => {
    const result = parseCatalogSearchParams({
      page: "0",
      pageSize: "500",
      maxPrice: "not-a-number",
      sortBy: "bad-value",
    });

    expect(result.filters).toMatchObject({
      page: 1,
      pageSize: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    expect(result.filters.maxPrice).toBeUndefined();
  });

  it("uses first value from repeated query params", () => {
    const result = parseCatalogSearchParams({
      query: ["chrome", "ignored"],
      page: ["3", "4"],
      pageSize: ["24"],
    });

    expect(result.filters.query).toBe("chrome");
    expect(result.filters.page).toBe(3);
    expect(result.filters.pageSize).toBe(24);
  });

  it("drops non-integer maxPrice values", () => {
    const result = parseCatalogSearchParams({ maxPrice: "100.5" });
    expect(result.filters.maxPrice).toBeUndefined();
  });
});
