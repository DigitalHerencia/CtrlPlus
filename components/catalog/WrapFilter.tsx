"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@/lib/forms/zod-resolver";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

interface WrapFilterProps {
  categories?: Array<{ id: string; name: string }>;
}

const wrapFilterFormSchema = z.object({
  query: z.string().trim().max(200, "Search must be 200 characters or fewer."),
  categoryId: z.string().trim().max(64).default(""),
  maxPrice: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), "Use whole cents only.")
    .refine((value) => value === "" || Number(value) <= 1_000_000_000, "Max price is too large."),
  sortBy: z.enum(["createdAt", "name", "price"]),
  sortOrder: z.enum(["desc", "asc"]),
  pageSize: z.enum(["12", "20", "32"]),
});

type WrapFilterFormValues = z.infer<typeof wrapFilterFormSchema>;

const defaultValues: WrapFilterFormValues = {
  query: "",
  categoryId: "",
  maxPrice: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  pageSize: "20",
};

function getFormValues(searchParams: ReadonlyURLSearchParams): WrapFilterFormValues {
  return {
    query: searchParams.get("query") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    sortBy: (searchParams.get("sortBy") as WrapFilterFormValues["sortBy"]) ?? "createdAt",
    sortOrder: (searchParams.get("sortOrder") as WrapFilterFormValues["sortOrder"]) ?? "desc",
    pageSize: (searchParams.get("pageSize") as WrapFilterFormValues["pageSize"]) ?? "20",
  };
}

function buildQueryString(values: WrapFilterFormValues, searchParams: ReadonlyURLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());

  params.delete("page");

  if (values.query) {
    params.set("query", values.query);
  } else {
    params.delete("query");
  }

  if (values.categoryId) {
    params.set("categoryId", values.categoryId);
  } else {
    params.delete("categoryId");
  }

  if (values.maxPrice) {
    params.set("maxPrice", values.maxPrice);
  } else {
    params.delete("maxPrice");
  }

  if (values.sortBy !== "createdAt") {
    params.set("sortBy", values.sortBy);
  } else {
    params.delete("sortBy");
  }

  if (values.sortOrder !== "desc") {
    params.set("sortOrder", values.sortOrder);
  } else {
    params.delete("sortOrder");
  }

  if (values.pageSize !== "20") {
    params.set("pageSize", values.pageSize);
  } else {
    params.delete("pageSize");
  }

  return params.toString();
}

export function WrapFilter({ categories = [] }: WrapFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchParamsString = searchParams.toString();

  const form = useForm<WrapFilterFormValues>({
    resolver: zodResolver(wrapFilterFormSchema),
    defaultValues: getFormValues(searchParams),
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });
  const deferredValues = useDeferredValue(watchedValues);

  useEffect(() => {
    form.reset(getFormValues(searchParams));
  }, [form, searchParams, searchParamsString]);

  useEffect(() => {
    if (!form.formState.isDirty) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const parsed = wrapFilterFormSchema.safeParse(deferredValues);
      if (!parsed.success) {
        return;
      }

      const queryString = buildQueryString(parsed.data, searchParams);
      if (queryString === searchParamsString) {
        return;
      }

      startTransition(() => {
        if (queryString) {
          router.push(`${pathname}?${queryString}`);
        } else {
          router.push(pathname);
        }
      });
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [deferredValues, form.formState.isDirty, pathname, router, searchParams, searchParamsString]);

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    startTransition(() => {
      router.push(pathname);
    });
  }, [form, pathname, router]);

  const hasActiveFilters = useMemo(() => {
    const current = watchedValues ?? defaultValues;

    return Boolean(
      current.query ||
      current.maxPrice ||
      current.categoryId ||
      current.sortBy !== "createdAt" ||
      current.sortOrder !== "desc" ||
      current.pageSize !== "20",
    );
  }, [watchedValues]);

  const inputClassName =
    "h-11 border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500";
  const selectClassName =
    "h-11 border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100";

  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
      <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(5,minmax(0,0.78fr))] lg:items-start">
        <Field>
          <FieldLabel htmlFor="catalog-search" className="text-neutral-300">
            Search
          </FieldLabel>
          <input
            id="catalog-search"
            type="search"
            placeholder="Search wraps, finishes, or textures"
            className={inputClassName}
            disabled={isPending}
            {...form.register("query")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-category" className="text-neutral-300">
            Category
          </FieldLabel>
          <select
            id="catalog-category"
            className={selectClassName}
            disabled={isPending}
            {...form.register("categoryId")}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.maxPrice)}>
          <FieldLabel htmlFor="catalog-max-price" className="text-neutral-300">
            Max Price (cents)
          </FieldLabel>
          <input
            id="catalog-max-price"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="No limit"
            className={inputClassName}
            disabled={isPending}
            {...form.register("maxPrice")}
          />
          {form.formState.errors.maxPrice && (
            <FieldError errors={[form.formState.errors.maxPrice]} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-sort-by" className="text-neutral-300">
            Sort By
          </FieldLabel>
          <select
            id="catalog-sort-by"
            className={selectClassName}
            disabled={isPending}
            {...form.register("sortBy")}
          >
            <option value="createdAt">Date Added</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-sort-order" className="text-neutral-300">
            Order
          </FieldLabel>
          <select
            id="catalog-sort-order"
            className={selectClassName}
            disabled={isPending}
            {...form.register("sortOrder")}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-page-size" className="text-neutral-300">
            Per Page
          </FieldLabel>
          <select
            id="catalog-page-size"
            className={selectClassName}
            disabled={isPending}
            {...form.register("pageSize")}
          >
            <option value="12">12</option>
            <option value="20">20</option>
            <option value="32">32</option>
          </select>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs tracking-[0.18em] text-neutral-500 uppercase">
          {isPending
            ? "Refreshing catalog results"
            : "Filters sync with the URL and server search."}
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isPending}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </form>
  );
}
