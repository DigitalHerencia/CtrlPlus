"use client";

import { useState } from "react";
import { savePreviewSession } from "@/lib/visualizer/actions/save-session";
import type { PreviewSessionDTO } from "@/lib/visualizer/types";
import { UploadZone } from "./UploadZone";
import { PreviewCanvas } from "./PreviewCanvas";

type PanelState = "upload" | "preview" | "saved";

interface VisualizerPanelProps {
  /** ID of the wrap design being previewed */
  wrapId?: string;
  /** Display name of the wrap design */
  wrapName?: string;
  /** Called when a new session is successfully saved */
  onSessionSaved?: (session: PreviewSessionDTO) => void;
}

export function VisualizerPanel({
  wrapId = "default",
  wrapName = "Custom Wrap",
  onSessionSaved,
}: VisualizerPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setPanelState("preview");
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const session = await savePreviewSession({
        wrapId,
        wrapName,
        vehicleImageUrl: imageUrl,
        previewImageUrl: imageUrl,
        mode: "upload",
      });
      setPanelState("saved");
      onSessionSaved?.(session);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setPanelState("upload");
    setSaveError(null);
  };

  return (
    <div className="w-full">
      {panelState === "upload" && <UploadZone onUpload={handleUpload} />}

      {(panelState === "preview" || panelState === "saved") && imageUrl && (
        <PreviewCanvas
          imageUrl={imageUrl}
          wrapName={wrapName}
          isSaved={panelState === "saved"}
          isSaving={isSaving}
          error={saveError}
          onSave={handleSave}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
