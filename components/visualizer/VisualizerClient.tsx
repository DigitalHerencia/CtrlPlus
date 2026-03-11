"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <section className="border border-neutral-700 bg-neutral-950/80 p-6 text-neutral-100">
          <h2 className="mb-4 text-base font-semibold text-neutral-100">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center bg-blue-600 text-xs text-neutral-100">
              1
            </span>
            Choose a Wrap
          </h2>
          <WrapSelector wraps={wraps} selectedWrapId={selectedWrapId} onSelect={handleWrapSelect} />
        </section>

        <section className="border border-neutral-700 bg-neutral-950/80 p-6 text-neutral-100">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as PreviewMode)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-neutral-100">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center bg-blue-600 text-xs text-neutral-100">
                  2
                </span>
                Select Preview Mode
              </h2>
              <TabsList className="border border-neutral-700 bg-neutral-900 p-1">
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-neutral-100"
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="template"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-neutral-100"
                >
                  Template
                </TabsTrigger>
              </TabsList>
            </div>

            {selectedWrapId ? (
              <>
                <TabsContent value="upload" className="mt-0">
                  <UploadForm
                    wrapId={selectedWrapId}
                    onPreviewReady={handlePreviewReady}
                    onUploadingChange={setIsLoading}
                  />
                </TabsContent>
                <TabsContent value="template" className="mt-0">
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
                            className={`overflow-hidden border text-left transition ${
                              selected
                                ? "border-blue-600 ring-1 ring-blue-600"
                                : "border-neutral-700 hover:border-blue-600/50"
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
                </TabsContent>
              </>
            ) : (
              <p className="text-sm text-neutral-400">
                Select a wrap above to unlock preview generation.
              </p>
            )}
          </Tabs>
        </section>
      </div>

      <div className="space-y-4">
        <section className="border border-neutral-700 bg-neutral-950/80 p-6 text-neutral-100">
          <h2 className="mb-4 text-base font-semibold text-neutral-100">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center bg-blue-600 text-xs text-neutral-100">
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
          <PreviewCanvas
            preview={preview}
            isLoading={isLoading}
            className="min-h-72"
            wrapOverlayUrl={selectedWrap?.images[0]?.url ?? null}
          />

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-700 pt-4">
            <p className="text-xs text-neutral-400">
              Preview issues won’t block your booking flow.
            </p>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-blue-600 text-neutral-100 transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
            >
              <Link href="/scheduling/book">Continue to scheduling</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
