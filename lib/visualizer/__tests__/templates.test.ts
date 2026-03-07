import { describe, expect, it } from "vitest";
import { buildTemplatePreview, templateVehicleOptions } from "../templates";

describe("template visualizer fallback", () => {
  it("provides curated template options", () => {
    expect(templateVehicleOptions.length).toBeGreaterThan(0);
    for (const option of templateVehicleOptions) {
      expect(option.imageUrl.startsWith("/")).toBe(true);
      expect(option.label.length).toBeGreaterThan(4);
    }
  });

  it("builds a complete preview DTO for fallback mode", () => {
    const preview = buildTemplatePreview({
      wrapId: "wrap-1",
      imageUrl: "/ctrlplus-fleet-night-showcase.png",
      tenantId: "tenant-1",
    });

    expect(preview.status).toBe("complete");
    expect(preview.wrapId).toBe("wrap-1");
    expect(preview.processedImageUrl).toBe("/ctrlplus-fleet-night-showcase.png");
    expect(preview.cacheKey).toContain("template:");
  });
});
