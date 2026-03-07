"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  addWrapImage,
  removeWrapImage,
  reorderWrapImages,
} from "@/lib/catalog/actions/manage-wrap-images";

interface WrapImageManagerProps {
  wrapId: string;
  images: Array<{ id: string; url: string; displayOrder: number }>;
}

export function WrapImageManager({ wrapId, images }: WrapImageManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    startTransition(async () => {
      try {
        await addWrapImage({ wrapId, file });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  function handleRemove(imageId: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeWrapImage(wrapId, imageId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed");
      }
    });
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);

    setError(null);
    startTransition(async () => {
      try {
        await reorderWrapImages(
          wrapId,
          reordered.map((image) => image.id),
        );
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Reorder failed");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Add image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleUpload}
          disabled={isPending}
          className="mt-1 block w-full text-sm"
        />
      </div>

      <div className="space-y-2">
        {images.map((image, index) => (
          <div key={image.id} className="flex items-center gap-3 rounded-lg border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="Wrap" className="h-16 w-20 rounded object-cover" />
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleMove(index, -1)}
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleMove(index, 1)}
              >
                ↓
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => handleRemove(image.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
