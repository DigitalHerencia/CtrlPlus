"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";
import { ImageIcon, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

type UploadFormProps = {
  wrapId: string;
  onPreviewReady: (preview: VisualizerPreviewDTO) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  className?: string;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = () => reject(new Error(reader.error?.toString() || "FileReader error"));
    reader.readAsDataURL(file);
  });
}

export function UploadForm(props: UploadFormProps) {
  const { onPreviewReady, onUploadingChange, className } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "progress" | "success" | "failure">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const form = useForm<UploadFormValues>({
    mode: "onBlur",
    defaultValues: { file: null },
    resolver: (values) => {
      const result = uploadPhotoFormSchema.safeParse(values);
      return {
        values: result.success ? values : {},
        errors: result.success ? {} : result.error.format(),
      };
    },
  });

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return typeof error === "string" ? error : "Unknown error";
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setUploadState("progress");
    setErrorMsg(null);
    onUploadingChange?.(true);
    try {
      // Simulate upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Example: read file as data URL
      if (values.file) {
        const url = await readFileAsDataUrl(values.file);
        setPreviewUrl(url);
        setUploadState("success");
        // Simulate preview DTO with required fields
        onPreviewReady({
          id: "mock-id",
          wrapId: "mock-wrap-id",
          customerPhotoUrl: url,
          processedImageUrl: url,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "complete",
          cacheKey: "mock-cache-key",
          expiresAt: new Date(),
        });
      } else {
        throw new Error("No file selected");
      }
    } catch (error) {
      setUploadState("failure");
      setErrorMsg(getErrorMessage(error));
    } finally {
      onUploadingChange?.(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-6", className)}>
      {/* Explicit states */}
      {uploadState === "idle" && (
        <p className="text-sm text-neutral-400">Select an image to upload.</p>
      )}
      {uploadState === "progress" && (
        <div className="flex items-center gap-2 text-blue-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Uploading and validating…</span>
        </div>
      )}
      {uploadState === "failure" && (
        <div className="flex flex-col gap-2 text-red-600">
          <X className="h-5 w-5" />
          <span>{errorMsg ?? "Upload failed. Please try again."}</span>
          <Button type="button" variant="outline" onClick={() => setUploadState("idle")}>
            Retry
          </Button>
        </div>
      )}
      {uploadState === "success" && previewUrl && (
        <div className="flex flex-col gap-2 text-green-600">
          <ImageIcon className="h-5 w-5" />
          <span>Upload successful!</span>
        </div>
      )}
      {/* ...existing form fields... */}
      <FieldGroup className="gap-5 border border-neutral-800 bg-neutral-950/80 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] sm:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Upload your vehicle photo
          </h2>
          <p className="text-sm text-neutral-400">
            Choose a clear side profile so the preview generator can place the wrap accurately.
          </p>
        </div>
        {/* TODO: Add Field, Controller, Button for file input and submit */}
      </FieldGroup>
    </form>
  );
}
