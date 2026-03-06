"use client";

import type { WrapDTO } from "@/lib/catalog/types";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";
import { useState } from "react";
import { PreviewCanvas } from "./PreviewCanvas";
import { UploadForm } from "./UploadForm";
import { WrapSelector } from "./WrapSelector";

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
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
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
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
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
            <p className="text-sm text-neutral-400">
              Select a wrap above to unlock photo upload.
            </p>
          )}
        </section>
      </div>

      {/* Right column: preview */}
      <div className="space-y-4">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-base font-semibold">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
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
