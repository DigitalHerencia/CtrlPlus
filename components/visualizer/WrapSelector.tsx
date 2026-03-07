"use client";

import type { WrapDTO } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface WrapSelectorProps {
  wraps: WrapDTO[];
  selectedWrapId: string | null;
  onSelect: (wrapId: string) => void;
  className?: string;
}

export function WrapSelector({ wraps, selectedWrapId, onSelect, className }: WrapSelectorProps) {
  if (wraps.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center text-sm text-neutral-400",
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
              "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
              isSelected
                ? "border-blue-500 bg-blue-500/10 text-white shadow-sm shadow-blue-900/30"
                : "border-neutral-700 bg-neutral-950 text-neutral-100 hover:border-blue-500/50 hover:bg-neutral-900",
            )}
            aria-pressed={isSelected}
          >
            {wrap.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wrap.images[0].url}
                alt={wrap.name}
                className="h-24 w-full rounded object-cover"
              />
            )}
            <span className="text-sm leading-tight font-semibold">{wrap.name}</span>
            {wrap.description && (
              <span
                className={cn(
                  "line-clamp-2 text-xs",
                  isSelected ? "text-neutral-200" : "text-neutral-400",
                )}
              >
                {wrap.description}
              </span>
            )}
            {wrap.installationMinutes !== null && wrap.installationMinutes !== undefined && (
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  isSelected ? "text-blue-200" : "text-neutral-300",
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
