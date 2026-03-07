"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { WrapDTO } from "@/lib/catalog/types";
import {
  buildTemplatePreview,
  templateVehicleOptions,
  type TemplateVehicleOption,
} from "@/lib/visualizer/templates";
import type { VisualizerPreviewDTO } from "@/lib/visualizer/types";
import { PreviewCanvas } from "./PreviewCanvas";
import { UploadForm } from "./UploadForm";
import { WrapSelector } from "./WrapSelector";

interface VisualizerClientProps {
  wraps: WrapDTO[];
}

type PreviewMode = "upload" | "template";

export function VisualizerClient({ wraps }: VisualizerClientProps) {
  const [selectedWrapId, setSelectedWrapId] = useState<string | null>(wraps[0]?.id ?? null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVehicleOption>(
    templateVehicleOptions[0],
  );
  const [preview, setPreview] = useState<VisualizerPreviewDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<PreviewMode>("upload");

  const selectedWrap = useMemo(
    () => wraps.find((wrap) => wrap.id === selectedWrapId) ?? null,
    [selectedWrapId, wraps],
  );

  function handleWrapSelect(wrapId: string) {
    setSelectedWrapId(wrapId);
    setPreview(null);
  }

  function handlePreviewReady(newPreview: VisualizerPreviewDTO) {
    setPreview(newPreview);
  }

  function handleTemplatePreview(vehicle: TemplateVehicleOption) {
    if (!selectedWrapId) return;

    setSelectedTemplate(vehicle);
    setPreview(
      buildTemplatePreview({
        wrapId: selectedWrapId,
        imageUrl: vehicle.imageUrl,
      }),
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-lg shadow-black/20">
          <h2 className="mb-4 text-base font-semibold text-neutral-100">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              1
            </span>
            Choose a Wrap
          </h2>
          <WrapSelector wraps={wraps} selectedWrapId={selectedWrapId} onSelect={handleWrapSelect} />
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-lg shadow-black/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-neutral-100">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                2
              </span>
              Select Preview Mode
            </h2>
            <div className="inline-flex rounded-lg border border-neutral-700 bg-neutral-950 p-1">
              <button
                type="button"
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  mode === "upload"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
                onClick={() => setMode("upload")}
              >
                Upload
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  mode === "template"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
                onClick={() => setMode("template")}
              >
                Template
              </button>
            </div>
          </div>

          {selectedWrapId ? (
            mode === "upload" ? (
              <UploadForm
                wrapId={selectedWrapId}
                onPreviewReady={handlePreviewReady}
                onUploadingChange={setIsLoading}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-neutral-300">
                  Instant fallback preview using curated stock vehicle images.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {templateVehicleOptions.map((vehicle) => {
                    const selected = vehicle.id === selectedTemplate.id;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => handleTemplatePreview(vehicle)}
                        className={`overflow-hidden rounded-xl border text-left transition ${
                          selected
                            ? "border-blue-500 ring-1 ring-blue-500"
                            : "border-neutral-700 hover:border-blue-500/50"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.label}
                          className="h-28 w-full object-cover"
                        />
                        <p className="px-3 py-2 text-xs font-medium text-neutral-200">
                          {vehicle.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-neutral-400">
              Select a wrap above to unlock preview generation.
            </p>
          )}
        </section>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-lg shadow-black/20">
          <h2 className="mb-4 text-base font-semibold text-neutral-100">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              3
            </span>
            Preview
          </h2>
          {selectedWrap && (
            <p className="mb-3 text-xs tracking-wide text-neutral-400 uppercase">
              Currently previewing:{" "}
              <span className="font-semibold text-neutral-200">{selectedWrap.name}</span>
            </p>
          )}
          <PreviewCanvas preview={preview} isLoading={isLoading} className="min-h-72" />

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-800 pt-4">
            <p className="text-xs text-neutral-400">
              Preview issues won’t block your booking flow.
            </p>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-neutral-700 bg-transparent text-neutral-100"
            >
              <Link href="/scheduling/book">Continue to scheduling</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
