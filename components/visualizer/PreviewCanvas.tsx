"use client";

import { Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewStatus, type VisualizerPreviewDTO } from "@/lib/visualizer/types";

interface PreviewCanvasProps {
  preview: VisualizerPreviewDTO | null;
  isLoading?: boolean;
  className?: string;
}

export function PreviewCanvas({ preview, isLoading = false, className }: PreviewCanvasProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border bg-neutral-50 p-12 dark:bg-neutral-900",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Generating your preview…</p>
      </div>
    );
  }

  // Empty state — no preview yet
  if (!preview) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center dark:border-neutral-700",
          className,
        )}
      >
        <ImageOff className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Select a wrap and upload your vehicle photo to see a preview here.
        </p>
      </div>
    );
  }

  // Processing / pending state
  if (
    preview.status === PreviewStatus.PENDING ||
    preview.status === PreviewStatus.PROCESSING
  ) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border bg-neutral-50 p-12 dark:bg-neutral-900",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Processing your preview…
        </p>
      </div>
    );
  }

  // Failed state
  if (preview.status === PreviewStatus.FAILED) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-12 text-center dark:border-red-900 dark:bg-red-950",
          className,
        )}
      >
        <ImageOff className="h-10 w-10 text-red-400" />
        <p className="text-sm text-red-600 dark:text-red-400">
          Preview generation failed. Please try again.
        </p>
      </div>
    );
  }

  // Complete state — show the processed image
  const imageUrl = preview.processedImageUrl ?? preview.customerPhotoUrl;

  return (
    <div className={cn("overflow-hidden rounded-lg border dark:border-neutral-700", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Wrap preview on your vehicle"
        className="h-full w-full object-contain"
      />
      <div className="border-t bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Preview result · expires{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(preview.expiresAt)}
        </p>
      </div>
    </div>
  );
}
