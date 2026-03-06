"use client";

import { useState } from "react";
import { WrapSelector } from "./WrapSelector";
import { UploadForm } from "./UploadForm";
import { PreviewCanvas } from "./PreviewCanvas";
import type { WrapDTO } from "@/lib/catalog/types";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";

interface VisualizerClientProps {
  wraps: WrapDTO[];
}

export function VisualizerClient({ wraps }: VisualizerClientProps) {
  const [selectedWrapId, setSelectedWrapId] = useState<string | null>(
    wraps[0]?.id ?? null,
  );
  const [preview, setPreview] = useState<VisualizerPreviewDTO | null>(null);

  function handleWrapSelect(wrapId: string) {
    setSelectedWrapId(wrapId);
    setPreview(null);
  }

  function handlePreviewReady(newPreview: VisualizerPreviewDTO) {
    setPreview(newPreview);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left column: wrap selection + upload */}
      <div className="space-y-6">
        {/* Step 1: Choose a wrap */}
        <section className="rounded-lg border bg-white p-6 dark:bg-neutral-900">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
              1
            </span>
            Choose a Wrap
          </h2>
          <WrapSelector
            wraps={wraps}
            selectedWrapId={selectedWrapId}
            onSelect={handleWrapSelect}
          />
        </section>

        {/* Step 2: Upload photo */}
        <section className="rounded-lg border bg-white p-6 dark:bg-neutral-900">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
              2
            </span>
            Upload Your Vehicle Photo
          </h2>
          {selectedWrapId ? (
            <UploadForm
              wrapId={selectedWrapId}
              onPreviewReady={handlePreviewReady}
            />
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Select a wrap above to unlock photo upload.
            </p>
          )}
        </section>
      </div>

      {/* Right column: preview */}
      <div className="space-y-4">
        <section className="rounded-lg border bg-white p-6 dark:bg-neutral-900">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
              3
            </span>
            Preview
          </h2>
          <PreviewCanvas
            preview={preview}
            className="min-h-64"
          />
        </section>
      </div>
    </div>
  );
}
