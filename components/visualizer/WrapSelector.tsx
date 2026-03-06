"use client";

import { cn } from "@/lib/utils";
import type { WrapDTO } from "@/lib/catalog/types";

interface WrapSelectorProps {
  wraps: WrapDTO[];
  selectedWrapId: string | null;
  onSelect: (wrapId: string) => void;
  className?: string;
}

export function WrapSelector({
  wraps,
  selectedWrapId,
  onSelect,
  className,
}: WrapSelectorProps) {
  if (wraps.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed p-8 text-center text-sm text-neutral-500 dark:text-neutral-400",
          className,
        )}
      >
        No wraps available. Add wraps in the Catalog to get started.
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {wraps.map((wrap) => {
        const isSelected = wrap.id === selectedWrapId;
        return (
          <button
            key={wrap.id}
            type="button"
            onClick={() => onSelect(wrap.id)}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500",
            )}
            aria-pressed={isSelected}
          >
            <span className="text-sm font-semibold leading-tight">{wrap.name}</span>
            {wrap.description && (
              <span
                className={cn(
                  "line-clamp-2 text-xs",
                  isSelected
                    ? "text-neutral-300 dark:text-neutral-600"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {wrap.description}
              </span>
            )}
            {wrap.installationMinutes !== null && wrap.installationMinutes !== undefined && (
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  isSelected
                    ? "text-neutral-300 dark:text-neutral-600"
                    : "text-neutral-600 dark:text-neutral-300",
                )}
              >
                {`${Math.floor(wrap.installationMinutes / 60)}h ${wrap.installationMinutes % 60}m install`}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
