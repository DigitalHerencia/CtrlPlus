"use client";

import { cn } from "@/lib/utils";
import { PreviewStatus, type VisualizerPreviewDTO } from "@/lib/visualizer/types";
import { ImageOff, Loader2 } from "lucide-react";

interface PreviewCanvasProps {
  preview: VisualizerPreviewDTO | null;
  isLoading?: boolean;
  className?: string;
  wrapOverlayUrl?: string | null;
}

export function PreviewCanvas({
  preview,
  isLoading = false,
  className,
  wrapOverlayUrl,
}: PreviewCanvasProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 border border-neutral-700 bg-neutral-900 p-12",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-neutral-300">Generating your preview…</p>
      </div>
    );
  }

  if (!preview) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-700 bg-neutral-900 p-12 text-center",
          className,
        )}
      >
        <ImageOff className="h-10 w-10 text-neutral-500" />
        <p className="text-sm text-neutral-400">
          Select a wrap and choose upload or template mode to see a preview here.
        </p>
      </div>
    );
  }

  if (preview.status === PreviewStatus.PENDING || preview.status === PreviewStatus.PROCESSING) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 border border-neutral-700 bg-neutral-900 p-12",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-neutral-300">Processing your preview…</p>
      </div>
    );
  }

  if (preview.status === PreviewStatus.FAILED) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 border border-neutral-700 bg-neutral-900 p-12 text-center",
          className,
        )}
      >
        <ImageOff className="h-10 w-10 text-blue-600" />
        <p className="text-sm text-neutral-100">
          Preview generation failed. Try template mode or continue to scheduling.
        </p>
      </div>
    );
  }

  const imageUrl = preview.processedImageUrl ?? preview.customerPhotoUrl;

  return (
    <div className={cn("overflow-hidden border border-neutral-700 bg-neutral-900", className)}>
      <div className="relative h-full min-h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Wrap preview on your vehicle"
          className="h-full w-full object-contain"
        />
        {wrapOverlayUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wrapOverlayUrl}
            alt="Selected wrap overlay"
            className="pointer-events-none absolute inset-[12%] h-[76%] w-[76%] object-contain opacity-35 mix-blend-screen"
          />
        )}
      </div>
      <div className="border-t border-neutral-700 bg-neutral-900 px-4 py-2">
        <p className="text-xs text-neutral-400">
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
