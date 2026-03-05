"use client";

import { useCallback, useRef, useState } from "react";

type UploadState = "idle" | "dragging" | "uploading" | "error";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_SIZE_MB = 10;

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
}

function validate(file: File): string | null {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    return `Please upload a JPEG, PNG, or WebP image.`;
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File is too large. Maximum size is ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        setState("error");
        return;
      }

      setError(null);
      setState("uploading");

      try {
        await onUpload(file);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Upload failed. Please try again."
        );
        setState("error");
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState("dragging");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setState("idle");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const isDragging = state === "dragging";
  const isUploading = state === "uploading";
  const hasError = state === "error";

  return (
    <section aria-label="Vehicle photo upload zone">
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop your vehicle photo here or press Enter to browse files"
        aria-disabled={isUploading}
        aria-busy={isUploading}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={[
          "relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isDragging
            ? "border-blue-500 bg-blue-50 focus-visible:ring-blue-500"
            : hasError
              ? "border-red-400 bg-red-50 focus-visible:ring-red-400"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-white focus-visible:ring-zinc-500",
          isUploading ? "pointer-events-none opacity-60" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isUploading ? (
          <UploadingIndicator />
        ) : isDragging ? (
          <DraggingIndicator />
        ) : (
          <IdleIndicator hasError={hasError} />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleInputChange}
        />
      </div>

      {hasError && error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {isUploading && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-zinc-500"
        >
          Processing your photo…
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-400">
        Accepts JPEG, PNG, WebP · Max {MAX_SIZE_MB} MB
      </p>
    </section>
  );
}

function IdleIndicator({ hasError }: { hasError: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`rounded-full p-4 ${hasError ? "bg-red-100 text-red-500" : "bg-zinc-100 text-zinc-400"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-zinc-700">
          {hasError ? "Try again" : "Drop your vehicle photo here"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">or click to browse files</p>
      </div>
    </>
  );
}

function DraggingIndicator() {
  return (
    <>
      <div
        aria-hidden="true"
        className="rounded-full bg-blue-100 p-4 text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      </div>
      <p className="text-base font-semibold text-blue-600">Release to upload</p>
    </>
  );
}

function UploadingIndicator() {
  return (
    <>
      <div
        aria-hidden="true"
        className="rounded-full bg-zinc-100 p-4 text-zinc-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <p className="text-base font-semibold text-zinc-700">Processing photo…</p>
    </>
  );
}
