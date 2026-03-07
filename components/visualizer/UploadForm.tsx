"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generatePreview } from "@/lib/visualizer/actions/generate-preview";
import { uploadVehiclePhoto } from "@/lib/visualizer/actions/upload-photo";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";

interface UploadFormProps {
  wrapId: string;
  onPreviewReady: (preview: VisualizerPreviewDTO) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  className?: string;
}

export function UploadForm({
  wrapId,
  onPreviewReady,
  onUploadingChange,
  className,
}: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!previewUrl) return;

    setIsUploading(true);
    onUploadingChange?.(true);
    setError(null);

    try {
      const uploaded = await uploadVehiclePhoto({
        wrapId,
        customerPhotoUrl: previewUrl,
      });

      const ready = await generatePreview({ previewId: uploaded.id });
      onPreviewReady(ready);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <label
        htmlFor="vehicle-photo-input"
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          "border-neutral-700 bg-neutral-950 hover:border-blue-500/60 hover:bg-neutral-900",
          previewUrl && "border-solid border-blue-500/70",
        )}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected vehicle"
              className="max-h-48 max-w-full rounded-md object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 rounded-full border border-neutral-600 bg-neutral-900 p-1 shadow"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4 text-neutral-200" />
            </button>
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-blue-500" />
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-100">
                Click to upload your vehicle photo
              </p>
              <p className="mt-1 text-xs text-neutral-400">PNG, JPG, WEBP up to 10 MB</p>
            </div>
          </>
        )}
      </label>

      <input
        id="vehicle-photo-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Upload vehicle photo"
      />

      {error && (
        <p
          className="rounded-md border border-red-700/40 bg-red-950/30 px-3 py-2 text-sm text-red-300"
          role="alert"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={!selectedFile || isUploading}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {isUploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-pulse" />
            Generating preview…
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Generate Preview
          </>
        )}
      </Button>
    </form>
  );
}
