"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { applyZodErrors } from "@/lib/forms/apply-zod-errors";
import {
  addWrapImage,
  removeWrapImage,
  reorderWrapImages,
  updateWrapImageMetadata,
} from "@/lib/catalog/actions/manage-wrap-images";
import {
  WrapImageKind,
  type WrapImageDTO,
  type WrapImageKind as WrapImageKindValue,
} from "@/lib/catalog/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface WrapImageManagerProps {
  wrapId: string;
  images: WrapImageDTO[];
}

const editableKinds = [
  WrapImageKind.HERO,
  WrapImageKind.VISUALIZER_TEXTURE,
  WrapImageKind.VISUALIZER_MASK_HINT,
  WrapImageKind.GALLERY,
] as const satisfies ReadonlyArray<WrapImageKindValue>;
const ACCEPTED_WRAP_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024;

const wrapImageUploadFormSchema = z.object({
  kind: z.enum(editableKinds),
  isActive: z.boolean(),
  file: z
    .instanceof(File, { message: "Choose an image to upload." })
    .refine(
      (file) => ACCEPTED_WRAP_IMAGE_TYPES.includes(file.type),
      "Use a JPEG, PNG, or WEBP image.",
    )
    .refine(
      (file) => file.size > 0 && file.size <= MAX_WRAP_IMAGE_BYTES,
      "Image must be smaller than 5 MB.",
    ),
});

const wrapImageMetadataSchema = z.object({
  kind: z.enum(editableKinds),
  isActive: z.boolean(),
});

type WrapImageUploadValues = {
  kind: WrapImageKindValue;
  isActive: boolean;
  file: File | null;
};

type WrapImageMetadataValues = z.input<typeof wrapImageMetadataSchema>;

type OptimisticMutation =
  | {
      type: "remove";
      imageId: string;
    }
  | {
      type: "reorder";
      orderedIds: string[];
    }
  | {
      type: "update";
      imageId: string;
      kind: WrapImageKindValue;
      isActive: boolean;
    };

function labelKind(kind: WrapImageKindValue): string {
  switch (kind) {
    case WrapImageKind.HERO:
      return "Hero";
    case WrapImageKind.VISUALIZER_TEXTURE:
      return "Visualizer texture";
    case WrapImageKind.VISUALIZER_MASK_HINT:
      return "Mask hint";
    case WrapImageKind.GALLERY:
      return "Gallery";
  }
}

function sortImages(images: WrapImageDTO[]): WrapImageDTO[] {
  return [...images].sort((a, b) => a.displayOrder - b.displayOrder);
}

function applyOptimisticMutation(images: WrapImageDTO[], mutation: OptimisticMutation): WrapImageDTO[] {
  switch (mutation.type) {
    case "remove":
      return images.filter((image) => image.id !== mutation.imageId);
    case "reorder": {
      const imageMap = new Map(images.map((image) => [image.id, image]));
      return mutation.orderedIds.map((imageId, index) => ({
        ...(imageMap.get(imageId) as WrapImageDTO),
        displayOrder: index,
      }));
    }
    case "update": {
      return images.map((image) => {
        if (image.id === mutation.imageId) {
          return {
            ...image,
            kind: mutation.kind,
            isActive: mutation.isActive,
            version: image.version + 1,
          };
        }

        if (
          mutation.isActive &&
          (mutation.kind === WrapImageKind.HERO ||
            mutation.kind === WrapImageKind.VISUALIZER_TEXTURE) &&
          image.kind === mutation.kind
        ) {
          return {
            ...image,
            isActive: false,
          };
        }

        return image;
      });
    }
  }
}

interface WrapImageRowProps {
  image: WrapImageDTO;
  index: number;
  totalImages: number;
  isPending: boolean;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (imageId: string) => void;
  onSave: (image: WrapImageDTO, values: WrapImageMetadataValues) => void;
}

function WrapImageRow({ image, index, totalImages, isPending, onMove, onRemove, onSave }: WrapImageRowProps) {
  const form = useForm<WrapImageMetadataValues>({
    defaultValues: {
      kind: image.kind,
      isActive: image.isActive,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      kind: image.kind,
      isActive: image.isActive,
    });
  }, [form, image.id, image.isActive, image.kind]);

  const kind = form.watch("kind");
  const isActive = form.watch("isActive");
  const hasChanges = kind !== image.kind || isActive !== image.isActive;

  const submitRow = form.handleSubmit((values) => {
    const parsed = wrapImageMetadataSchema.safeParse(values);
    if (!parsed.success) {
      applyZodErrors(parsed.error, form.setError, form.clearErrors);
      return;
    }

    form.clearErrors();
    onSave(image, parsed.data);
  });

  return (
    <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-100">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto]">
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt="Wrap asset" className="h-28 w-36 object-cover" />
        </div>

        <form onSubmit={submitRow} className="space-y-4">
          <FieldGroup className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
            <Field>
              <FieldLabel htmlFor={`${image.id}-kind`}>Asset role</FieldLabel>
              <select
                id={`${image.id}-kind`}
                disabled={isPending}
                className="h-10 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus-visible:border-neutral-400"
                {...form.register("kind")}
              >
                {editableKinds.map((kindOption) => (
                  <option key={kindOption} value={kindOption}>
                    {labelKind(kindOption)}
                  </option>
                ))}
              </select>
            </Field>

            <Field className="justify-end">
              <FieldLabel htmlFor={`${image.id}-active`}>Active</FieldLabel>
              <label className="flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100">
                <input id={`${image.id}-active`} type="checkbox" disabled={isPending} {...form.register("isActive")} />
                Visible to workflows
              </label>
            </Field>
          </FieldGroup>

          <FieldDescription>
            Version {image.version} · currently {labelKind(image.kind)} · {image.isActive ? "active" : "inactive"}
          </FieldDescription>
          <FieldError>{form.formState.errors.root?.server?.message}</FieldError>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={isPending || !hasChanges}>
              Save changes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || index === 0}
              onClick={() => onMove(index, -1)}
            >
              Move up
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || index === totalImages - 1}
              onClick={() => onMove(index, 1)}
            >
              Move down
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => onRemove(image.id)}
            >
              Remove
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function WrapImageManager({ wrapId, images }: WrapImageManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const orderedImages = useMemo(() => sortImages(images), [images]);
  const [optimisticImages, applyMutation] = useOptimistic(orderedImages, applyOptimisticMutation);
  const uploadForm = useForm<WrapImageUploadValues>({
    defaultValues: {
      kind: WrapImageKind.GALLERY,
      isActive: true,
      file: null,
    },
    mode: "onChange",
  });

  const selectedFile = uploadForm.watch("file");

  function runMutation(task: () => Promise<void>) {
    setError(null);
    setStatusMessage(null);

    startTransition(async () => {
      try {
        await task();
        router.refresh();
      } catch (mutationError) {
        setError(mutationError instanceof Error ? mutationError.message : "Mutation failed.");
      }
    });
  }

  const submitUpload = uploadForm.handleSubmit((values) => {
    const parsed = wrapImageUploadFormSchema.safeParse(values);
    if (!parsed.success) {
      applyZodErrors(parsed.error, uploadForm.setError, uploadForm.clearErrors);
      return;
    }

    uploadForm.clearErrors();
    runMutation(async () => {
      await addWrapImage({
        wrapId,
        file: parsed.data.file,
        kind: parsed.data.kind,
        isActive: parsed.data.isActive,
      });
      uploadForm.reset({
        kind: parsed.data.kind,
        isActive: parsed.data.isActive,
        file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setStatusMessage("Image uploaded.");
    });
  });

  function handleRemove(imageId: string) {
    applyMutation({ type: "remove", imageId });
    runMutation(async () => {
      await removeWrapImage(wrapId, imageId);
      setStatusMessage("Image removed.");
    });
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= optimisticImages.length) {
      return;
    }

    const reordered = [...optimisticImages];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);

    const orderedIds = reordered.map((image) => image.id);
    applyMutation({ type: "reorder", orderedIds });
    runMutation(async () => {
      await reorderWrapImages(wrapId, orderedIds);
      setStatusMessage("Image order updated.");
    });
  }

  function handleSave(image: WrapImageDTO, values: WrapImageMetadataValues) {
    if (values.kind === image.kind && values.isActive === image.isActive) {
      return;
    }

    applyMutation({
      type: "update",
      imageId: image.id,
      kind: values.kind,
      isActive: values.isActive,
    });
    runMutation(async () => {
      await updateWrapImageMetadata({
        wrapId,
        imageId: image.id,
        kind: values.kind,
        isActive: values.isActive,
      });
      setStatusMessage("Image metadata saved.");
    });
  }

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-lg">Add a wrap asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitUpload}>
            <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.75fr)_auto] lg:items-end">
              <Field data-invalid={uploadForm.formState.errors.file ? true : undefined}>
                <FieldLabel htmlFor="wrap-image-upload">Image file</FieldLabel>
                <Input
                  id="wrap-image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_WRAP_IMAGE_TYPES.join(",")}
                  disabled={isPending}
                  className="border-neutral-700 bg-neutral-950 text-neutral-100 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-neutral-950"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    uploadForm.setValue("file", file, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    uploadForm.clearErrors("root");
                  }}
                />
                <FieldDescription>
                  Use high-resolution assets for hero and visualizer texture roles.
                </FieldDescription>
                <FieldError errors={[uploadForm.formState.errors.file]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="wrap-image-kind">Asset role</FieldLabel>
                <select
                  id="wrap-image-kind"
                  disabled={isPending}
                  className="h-11 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus-visible:border-neutral-400"
                  {...uploadForm.register("kind")}
                >
                  {editableKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {labelKind(kind)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="wrap-image-active">Visibility</FieldLabel>
                <label className="flex h-11 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100">
                  <input id="wrap-image-active" type="checkbox" disabled={isPending} {...uploadForm.register("isActive")} />
                  Active
                </label>
              </Field>
            </FieldGroup>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isPending || !selectedFile}>
                {isPending ? "Uploading..." : "Upload image"}
              </Button>
              {selectedFile ? <span className="text-xs text-neutral-500">{selectedFile.name}</span> : null}
            </div>
            <FieldError>{uploadForm.formState.errors.root?.server?.message}</FieldError>
          </form>
        </CardContent>
      </Card>

      {statusMessage ? <p className="text-sm text-blue-400">{statusMessage}</p> : null}
      {error ? <p className="text-sm text-neutral-100">{error}</p> : null}

      <div className="space-y-3">
        {optimisticImages.length === 0 ? (
          <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-400">
            <CardContent className="p-6 text-sm">No images uploaded for this wrap yet.</CardContent>
          </Card>
        ) : (
          optimisticImages.map((image, index) => (
            <WrapImageRow
              key={image.id}
              image={image}
              index={index}
              totalImages={optimisticImages.length}
              isPending={isPending}
              onMove={handleMove}
              onRemove={handleRemove}
              onSave={handleSave}
            />
          ))
        )}
      </div>
    </div>
  );
}
