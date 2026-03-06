"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadVehiclePhoto } from "@/lib/visualizer/actions/upload-photo";
import { generatePreview } from "@/lib/visualizer/actions/generate-preview";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";

interface UploadFormProps {
  wrapId: string;
  onPreviewReady: (preview: VisualizerPreviewDTO) => void;
  className?: string;
}

export function UploadForm({ wrapId, onPreviewReady, className }: UploadFormProps) {
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
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
          "border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800",
          previewUrl && "border-solid border-neutral-400",
        )}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected vehicle"
              className="max-h-48 max-w-full rounded object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute right-2 top-2 rounded-full bg-white p-1 shadow dark:bg-neutral-800"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-neutral-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Click to upload your vehicle photo
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                PNG, JPG, WEBP up to 10 MB
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload vehicle photo"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={!selectedFile || isUploading} className="w-full">
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
