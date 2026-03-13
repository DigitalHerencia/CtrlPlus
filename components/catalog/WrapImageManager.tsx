"use client";

import { Button } from "@/components/ui/button";
import {
  addWrapImage,
  removeWrapImage,
  reorderWrapImages,
  updateWrapImageMetadata,
} from "@/lib/catalog/actions/manage-wrap-images";
import {
  WrapImageKind,
  type WrapImageDTO,
  type WrapImageKind as WrapImageKindValue,
} from "@/lib/catalog/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

interface WrapImageManagerProps {
  wrapId: string;
  images: WrapImageDTO[];
}

const editableKinds: WrapImageKindValue[] = [
  WrapImageKind.HERO,
  WrapImageKind.VISUALIZER_TEXTURE,
  WrapImageKind.VISUALIZER_MASK_HINT,
  WrapImageKind.GALLERY,
];

function labelKind(kind: WrapImageKindValue): string {
  switch (kind) {
    case WrapImageKind.HERO:
      return "Hero";
    case WrapImageKind.VISUALIZER_TEXTURE:
      return "Visualizer Texture";
    case WrapImageKind.VISUALIZER_MASK_HINT:
      return "Visualizer Mask Hint";
    case WrapImageKind.GALLERY:
      return "Gallery";
  }
}

export function WrapImageManager({ wrapId, images }: WrapImageManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadKind, setUploadKind] = useState<WrapImageKindValue>(WrapImageKind.GALLERY);
  const [uploadActive, setUploadActive] = useState(true);
  const [metadataDraft, setMetadataDraft] = useState<
    Record<string, { kind: WrapImageKindValue; isActive: boolean }>
  >({});

  const orderedImages = useMemo(
    () => [...images].sort((a, b) => a.displayOrder - b.displayOrder),
    [images],
  );

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    startTransition(async () => {
      try {
        await addWrapImage({ wrapId, file, kind: uploadKind, isActive: uploadActive });
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
    if (target < 0 || target >= orderedImages.length) return;

    const reordered = [...orderedImages];
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

  function draftForImage(image: WrapImageDTO): { kind: WrapImageKindValue; isActive: boolean } {
    return metadataDraft[image.id] ?? { kind: image.kind, isActive: image.isActive };
  }

  function updateDraft(imageId: string, next: { kind: WrapImageKindValue; isActive: boolean }) {
    setMetadataDraft((current) => ({
      ...current,
      [imageId]: next,
    }));
  }

  function saveMetadata(image: WrapImageDTO) {
    const draft = draftForImage(image);
    if (draft.kind === image.kind && draft.isActive === image.isActive) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await updateWrapImageMetadata({
          wrapId,
          imageId: image.id,
          kind: draft.kind,
          isActive: draft.isActive,
        });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Metadata update failed");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 rounded border border-neutral-700 bg-neutral-900 p-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div>
          <label className="text-sm font-medium text-neutral-100">Add image</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            disabled={isPending}
            className="mt-1 block w-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          />
        </div>
        <label className="grid gap-1 text-sm text-neutral-100">
          Asset Role
          <select
            value={uploadKind}
            onChange={(event) => setUploadKind(event.target.value as WrapImageKindValue)}
            disabled={isPending}
            className="border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          >
            {editableKinds.map((kind) => (
              <option key={kind} value={kind}>
                {labelKind(kind)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-100">
          <input
            type="checkbox"
            checked={uploadActive}
            onChange={(event) => setUploadActive(event.target.checked)}
            disabled={isPending}
          />
          Active
        </label>
      </div>

      <div className="space-y-2">
        {orderedImages.map((image, index) => {
          const draft = draftForImage(image);
          return (
            <div
              key={image.id}
              className="grid gap-3 border border-neutral-700 bg-neutral-900 p-3 lg:grid-cols-[auto_1fr_auto]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="Wrap" className="h-20 w-28 object-cover" />

              <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
                <label className="grid gap-1 text-xs text-neutral-300">
                  Kind
                  <select
                    value={draft.kind}
                    onChange={(event) =>
                      updateDraft(image.id, {
                        ...draft,
                        kind: event.target.value as WrapImageKindValue,
                      })
                    }
                    disabled={isPending}
                    className="border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                  >
                    {editableKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {labelKind(kind)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(event) =>
                      updateDraft(image.id, { ...draft, isActive: event.target.checked })
                    }
                    disabled={isPending}
                  />
                  Active
                </label>

                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-700 text-neutral-100 hover:border-blue-600 hover:bg-neutral-900"
                  disabled={
                    isPending || (draft.kind === image.kind && draft.isActive === image.isActive)
                  }
                  onClick={() => saveMetadata(image)}
                >
                  Save
                </Button>

                <p className="text-xs text-neutral-400 md:col-span-3">
                  v{image.version} · {labelKind(image.kind)} ·{" "}
                  {image.isActive ? "active" : "inactive"}
                </p>
              </div>

              <div className="flex items-start gap-2 lg:justify-end">
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
                  variant="outline"
                  className="border-neutral-700 text-neutral-100 hover:border-blue-600 hover:bg-neutral-900"
                  disabled={isPending}
                  onClick={() => handleRemove(image.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-neutral-100">{error}</p>}
    </div>
  );
}
