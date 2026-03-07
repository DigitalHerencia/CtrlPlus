import { describe, expect, it } from "vitest";
import { buildVisualizerCacheKey } from "@/lib/visualizer/cache-key";

describe("buildVisualizerCacheKey", () => {
  it("is deterministic for identical input", () => {
    const first = buildVisualizerCacheKey({
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,abc",
      textureId: "t1",
      maskModel: "m1",
      blendMode: "multiply",
      opacity: 0.58,
    });

    const second = buildVisualizerCacheKey({
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,abc",
      textureId: "t1",
      maskModel: "m1",
      blendMode: "multiply",
      opacity: 0.58,
    });

    expect(first).toBe(second);
  });

  it("changes when wrap or image changes", () => {
    const base = buildVisualizerCacheKey({
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,abc",
    });

    const differentWrap = buildVisualizerCacheKey({
      tenantId: "tenant-1",
      wrapId: "wrap-2",
      customerPhotoUrl: "data:image/png;base64,abc",
    });

    const differentPhoto = buildVisualizerCacheKey({
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,xyz",
    });

    expect(base).not.toBe(differentWrap);
    expect(base).not.toBe(differentPhoto);
  });
});
