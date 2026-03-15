"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createWrap } from "@/lib/catalog/actions/create-wrap";
import { deleteWrap } from "@/lib/catalog/actions/delete-wrap";
import {
  createWrapCategory,
  deleteWrapCategory,
  setWrapCategoryMappings,
} from "@/lib/catalog/actions/manage-categories";
import { updateWrap } from "@/lib/catalog/actions/update-wrap";
import { type WrapCategoryDTO, type WrapDTO } from "@/lib/catalog/types";

interface CatalogManagerProps {
  wraps: WrapDTO[];
  categories: WrapCategoryDTO[];
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function CatalogManager({ wraps, categories }: CatalogManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Zod schemas for validation
  const wrapSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.string().min(1, "Price is required"),
    installationMinutes: z.string().optional(),
    description: z.string().optional(),
  });

  const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    slug: z.string().min(1, "Slug is required"),
  });

  // React Hook Form for Wrap creation
  const {
    control: wrapControl,
    handleSubmit: handleWrapSubmit,
    reset: resetWrap,
    formState: { errors: wrapErrors },
  } = useForm({
    resolver: zodResolver(wrapSchema),
    defaultValues: {
      name: "",
      price: "0",
      installationMinutes: "",
      description: "",
    },
  });

  // React Hook Form for Category creation
  const {
    control: categoryControl,
    handleSubmit: handleCategorySubmit,
    reset: resetCategory,
    formState: { errors: categoryErrors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const initialCategoryMap = useMemo(() => {
    return Object.fromEntries(
      wraps.map((wrap) => [wrap.id, new Set(wrap.categories.map((category) => category.id))]),
    ) as Record<string, Set<string>>;
  }, [wraps]);

  const [categorySelections, setCategorySelections] =
    useState<Record<string, Set<string>>>(initialCategoryMap);

  useEffect(() => {
    setCategorySelections(initialCategoryMap);
  }, [initialCategoryMap]);

  function runMutation(task: () => Promise<void>) {
    setError(null);
    setStatus(null);

    startTransition(async () => {
      try {
        await task();
        setStatus("Saved successfully.");
        router.refresh();
      } catch (mutationError) {
        setError(mutationError instanceof Error ? mutationError.message : "Mutation failed");
      }
    });
  }

  function onCreateWrap(data: z.infer<typeof wrapSchema>) {
    runMutation(async () => {
      await createWrap({
        name: data.name,
        price: Number(data.price),
        installationMinutes: data.installationMinutes
          ? Number(data.installationMinutes)
          : undefined,
        description: data.description || undefined,
      });
      resetWrap();
    });
  }

  function onCreateCategory(data: z.infer<typeof categorySchema>) {
    runMutation(async () => {
      await createWrapCategory({
        name: data.name,
        slug: data.slug,
      });
      resetCategory();
    });
  }

  function handleDeleteCategory(categoryId: string) {
    runMutation(async () => {
      await deleteWrapCategory(categoryId);
    });
  }

  function handleWrapUpdate(wrapId: string, event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    runMutation(async () => {
      const installationMinutesValue = readFormString(formData, "installationMinutes");

      await updateWrap(wrapId, {
        name: readFormString(formData, "name"),
        description: readFormString(formData, "description"),
        price: Number(readFormString(formData, "price") || 0),
        installationMinutes: installationMinutesValue
          ? Number(installationMinutesValue)
          : undefined,
        isHidden: formData.get("isHidden") === "on",
      });
    });
  }

  function handleWrapDelete(wrapId: string) {
    runMutation(async () => {
      await deleteWrap(wrapId);
    });
  }

  function toggleWrapCategory(wrapId: string, categoryId: string) {
    setCategorySelections((current) => {
      const next = { ...current };
      const selected = new Set(next[wrapId] ?? []);

      if (selected.has(categoryId)) {
        selected.delete(categoryId);
      } else {
        selected.add(categoryId);
      }

      next[wrapId] = selected;
      return next;
    });
  }

  function saveWrapCategories(wrapId: string) {
    const selected = categorySelections[wrapId] ?? new Set<string>();
    runMutation(async () => {
      await setWrapCategoryMappings({
        wrapId,
        categoryIds: Array.from(selected),
      });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-neutral-100">Catalog Manager</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/catalog">Back to Catalog</Link>
        </Button>
      </div>

      {error ? <p className="text-sm text-neutral-100">{error}</p> : null}
      {status ? <p className="text-sm text-neutral-300">{status}</p> : null}

      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardHeader>
          <CardTitle>Create Wrap</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleWrapSubmit(onCreateWrap)}>
            <div className="flex gap-3">
              <label className="text-sm text-neutral-300 md:col-span-2">Name</label>
              <Controller
                name="name"
                control={wrapControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                    placeholder="Wrap name"
                  />
                )}
              />
              {wrapErrors.name && (
                <span className="text-xs text-red-500">{wrapErrors.name.message}</span>
              )}
            </div>
            <Controller
              name="price"
              control={wrapControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                  placeholder="Price in cents"
                />
              )}
            />
            {wrapErrors.price && (
              <span className="text-xs text-red-500">{wrapErrors.price.message}</span>
            )}
            <Controller
              name="installationMinutes"
              control={wrapControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                  placeholder="Installation minutes"
                />
              )}
            />
            <Controller
              name="description"
              control={wrapControl}
              render={({ field }) => (
                <Input
                  {...field}
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                  placeholder="Description"
                />
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" disabled={isPending}>
                Create Wrap
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardHeader>
          <CardTitle>Create Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
            onSubmit={handleCategorySubmit(onCreateCategory)}
          >
            <Controller
              name="name"
              control={categoryControl}
              render={({ field }) => (
                <Input
                  {...field}
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                  placeholder="Category name"
                />
              )}
            />
            {categoryErrors.name && (
              <span className="text-xs text-red-500">{categoryErrors.name.message}</span>
            )}
            <Controller
              name="slug"
              control={categoryControl}
              render={({ field }) => (
                <Input
                  {...field}
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                  placeholder="category-slug"
                />
              )}
            />
            {categoryErrors.slug && (
              <span className="text-xs text-red-500">{categoryErrors.slug.message}</span>
            )}
            <Button type="submit" disabled={isPending}>
              Add Category
            </Button>
          </form>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 border border-neutral-700 bg-neutral-900 p-2"
              >
                <p className="text-sm text-neutral-100">
                  {category.name}{" "}
                  <span className="text-xs text-neutral-400">({category.slug})</span>
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {wraps.map((wrap) => (
          <Card key={wrap.id} className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
              <CardTitle>{wrap.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="grid gap-3 md:grid-cols-2"
                onSubmit={(event) => handleWrapUpdate(wrap.id, event)}
              >
                <Input name="name" defaultValue={wrap.name} required />
                <Input
                  name="price"
                  type="number"
                  min={1}
                  defaultValue={String(wrap.price)}
                  required
                />
                <Input
                  name="installationMinutes"
                  type="number"
                  min={1}
                  defaultValue={String(wrap.installationMinutes ?? "")}
                />
                <Input name="description" defaultValue={wrap.description ?? ""} />

                <label className="flex items-center gap-2 text-sm text-neutral-300 md:col-span-2">
                  <input name="isHidden" type="checkbox" defaultChecked={wrap.isHidden} />
                  Hidden from customers
                </label>

                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <Button type="submit" disabled={isPending}>
                    Save Wrap
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleWrapDelete(wrap.id)}
                  >
                    Delete Wrap
                  </Button>
                </div>
              </form>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-100">Category Mapping</p>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {categories.map((category) => {
                    const selected = categorySelections[wrap.id]?.has(category.id) ?? false;
                    return (
                      <label
                        key={`${wrap.id}-${category.id}`}
                        className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-300"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleWrapCategory(wrap.id, category.id)}
                        />
                        {category.name}
                      </label>
                    );
                  })}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => saveWrapCategories(wrap.id)}
                >
                  Save Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
