"use client";

import { useState } from "react";

interface PreviewCanvasProps {
  /** Object URL or permanent URL of the uploaded vehicle photo */
  imageUrl: string;
  /** Display name of the wrap being previewed */
  wrapName: string;
  /** Whether the session has already been saved */
  isSaved: boolean;
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Error message from a failed save attempt */
  error: string | null;
  onSave: () => void;
  onReset: () => void;
}

const WRAP_COLORS: Record<string, { label: string; hex: string }> = {
  midnight: { label: "Midnight Black", hex: "#1a1a2e" },
  crimson: { label: "Crimson Red", hex: "#8b0000" },
  arctic: { label: "Arctic White", hex: "#e8eaf0" },
  cobalt: { label: "Cobalt Blue", hex: "#1565c0" },
  forest: { label: "Forest Green", hex: "#1b5e20" },
};

type WrapColorKey = keyof typeof WRAP_COLORS;

export function PreviewCanvas({
  imageUrl,
  wrapName,
  isSaved,
  isSaving,
  error,
  onSave,
  onReset,
}: PreviewCanvasProps) {
  const [selectedColor, setSelectedColor] = useState<WrapColorKey>("midnight");
  const [opacity, setOpacity] = useState(40);

  const color = WRAP_COLORS[selectedColor];

  return (
    <section
      aria-label="Wrap preview"
      className="flex flex-col gap-6"
      data-testid="preview-canvas"
    >
      {/* Preview image with wrap overlay */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Your vehicle with wrap preview"
          className="w-full object-cover"
          style={{ maxHeight: "480px" }}
        />

        {/* Simulated wrap color overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: color.hex,
            opacity: opacity / 100,
            mixBlendMode: "color",
          }}
        />

        {/* Wrap label badge */}
        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {wrapName} · {color.label}
        </div>
      </div>

      {/* Wrap color selector */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-700">
          Preview wrap color
        </legend>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Wrap color options"
        >
          {(Object.keys(WRAP_COLORS) as WrapColorKey[]).map((key) => {
            const c = WRAP_COLORS[key];
            const isSelected = selectedColor === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isSelected}
                aria-label={c.label}
                onClick={() => setSelectedColor(key)}
                className={[
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-zinc-700 bg-zinc-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border border-white/20"
                  style={{ backgroundColor: c.hex }}
                />
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Opacity slider */}
      <div>
        <label
          htmlFor="wrap-opacity"
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          Overlay intensity: {opacity}%
        </label>
        <input
          id="wrap-opacity"
          type="range"
          min={10}
          max={80}
          step={5}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-zinc-700"
          aria-valuemin={10}
          aria-valuemax={80}
          aria-valuenow={opacity}
          aria-valuetext={`${opacity}% overlay intensity`}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {!isSaved ? (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
          >
            {isSaving ? (
              <>
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="opacity-25"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving…
              </>
            ) : (
              "Save preview"
            )}
          </button>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Preview saved
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
        >
          Upload different photo
        </button>
      </div>

      {/* Save error */}
      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
