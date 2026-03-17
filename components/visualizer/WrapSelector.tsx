"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { WrapDTO } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface WrapSelectorProps {
  wraps: WrapDTO[];
  selectedWrapId: string | null;
  onSelect: (wrapId: string) => void;
  canManageCatalog?: boolean;
  className?: string;
  permissionDenied?: boolean;
}

export function WrapSelector({
  wraps,
  selectedWrapId,
  onSelect,
  canManageCatalog = false,
  className,
  permissionDenied,
}: WrapSelectorProps) {
  if (permissionDenied) {
    return (
      <div
        className={cn(
          "space-y-3 border border-dashed border-red-700 bg-red-900 p-8 text-center text-sm text-red-100",
          className,
        )}
      >
        <p>You do not have permission to view wraps.</p>
      </div>
    );
  }
  if (wraps.length === 0) {
    return (
      <div
        className={cn(
          "space-y-3 border border-dashed border-neutral-700 bg-neutral-900 p-8 text-center text-sm text-neutral-100",
          className,
        )}
      >
        <p>No wraps available. Add wraps in the Catalog to get started.</p>
        {canManageCatalog ? (
          <Button asChild size="sm">
            <Link href="/catalog/manage">Open Catalog Manager</Link>
          </Button>
        ) : null}
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
              "flex flex-col gap-2 border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
              isSelected
                ? "border-blue-600 bg-neutral-900 text-neutral-100 shadow-sm"
                : "border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-blue-600/50 hover:bg-neutral-900",
            )}
            aria-pressed={isSelected}
          >
            {wrap.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={wrap.images[0].url} alt={wrap.name} className="h-24 w-full object-cover" />
            )}
            <span className="text-sm font-semibold leading-tight">{wrap.name}</span>
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
