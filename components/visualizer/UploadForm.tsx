"use client";

import { ImageIcon, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { generatePreview } from "@/lib/visualizer/actions/generate-preview";
import { uploadVehiclePhoto } from "@/lib/visualizer/actions/upload-photo";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const uploadPhotoFormSchema = z.object({
  file: z
    .instanceof(File, { message: "Select an image to continue." })
    .refine((file) => file.type.startsWith("image/"), "Please select an image file.")
    .refine((file) => file.size <= MAX_UPLOAD_BYTES, "Image must be smaller than 10 MB."),
});

type UploadFormValues = {
  file: File | null;
};

interface UploadFormProps {
  wrapId: string;
  onPreviewReady: (preview: VisualizerPreviewDTO) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  className?: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("Could not read the selected image."));
    };

    reader.onerror = () => {
      reject(new Error("Could not read the selected image."));
    };

    reader.readAsDataURL(file);
  });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : "Upload failed. Please try again.";
}

export function UploadForm({
  wrapId,
  onPreviewReady,
  onUploadingChange,
  className,
}: UploadFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<UploadFormValues>({
    mode: "onBlur",
    defaultValues: {
      file: null,
    },
  });
  const selectedFile = form.watch("file");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();

    const parsed = uploadPhotoFormSchema.safeParse({ file: values.file });
    if (!parsed.success) {
      form.setError("file", {
        message: parsed.error.issues[0]?.message || "Select an image to continue.",
      });
      return;
    }

    onUploadingChange?.(true);

    try {
      const customerPhotoUrl = await readFileAsDataUrl(parsed.data.file);
      const uploaded = await uploadVehiclePhoto({
        wrapId,
        customerPhotoUrl,
      });
      const ready = await generatePreview({ previewId: uploaded.id });
      onPreviewReady(ready);
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error),
      });
    } finally {
      onUploadingChange?.(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-6", className)}>
      <FieldGroup className="gap-5 border border-neutral-800 bg-neutral-950/80 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] sm:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Upload your vehicle photo
          </h2>
          <p className="text-sm text-neutral-400">
            Choose a clear side profile so the preview generator can place the wrap accurately.
          </p>
        </div>

        <Field>
          <FieldLabel className="text-neutral-100" htmlFor="vehicle-photo-input">
            Vehicle image
          </FieldLabel>
          <Controller
            control={form.control}
            name="file"
            render={({ field }) => (
              <>
                <label
                  htmlFor="vehicle-photo-input"
                  className={cn(
                    "relative flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-8 transition",
                    "border-neutral-800 bg-neutral-900 text-neutral-100 hover:border-blue-600/60 hover:bg-neutral-900/80",
                    previewUrl && "border-solid border-blue-600/70",
                  )}
                >
                  {previewUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Selected vehicle"
                        className="max-h-56 max-w-full rounded-xl object-contain"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-4 rounded-full border border-neutral-700 bg-neutral-950 p-2 text-neutral-100 transition hover:border-blue-600 hover:text-blue-300"
                        aria-label="Remove photo"
                        onClick={(event) => {
                          event.preventDefault();
                          field.onChange(null);
                          form.clearErrors();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-600/40 bg-blue-950/30 text-blue-300">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium text-neutral-50">
                          Click to upload your vehicle photo
                        </p>
                        <p className="text-sm text-neutral-400">PNG, JPG, or WEBP up to 10 MB</p>
                      </div>
                    </>
                  )}
                </label>

                <input
                  id="vehicle-photo-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={form.formState.isSubmitting}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    field.onChange(file);
                    form.clearErrors();
                  }}
                />
              </>
            )}
          />
          <FieldDescription className="text-neutral-400">
            For the best result, avoid motion blur and keep the entire vehicle in frame.
          </FieldDescription>
          <FieldError
            errors={
              form.formState.errors.file?.message
                ? [{ message: form.formState.errors.file.message }]
                : undefined
            }
          />
        </Field>

        {form.formState.errors.root?.message ? (
          <div className="rounded-2xl border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
            {form.formState.errors.root.message}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={!selectedFile || form.formState.isSubmitting}
          className="h-12 w-full bg-neutral-100 font-medium text-neutral-950 hover:bg-white"
        >
          {form.formState.isSubmitting ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {form.formState.isSubmitting ? "Generating preview..." : "Generate preview"}
        </Button>
      </FieldGroup>
    </form>
  );
}
