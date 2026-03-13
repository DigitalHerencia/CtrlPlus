import { describe, expect, it } from "vitest";

import { assertWrapCanBePublished, getMissingRequiredAssetRolesForPublish } from "./publish-wrap";

describe("getMissingRequiredAssetRolesForPublish", () => {
  it("returns both required roles when no assets are present", () => {
    expect(getMissingRequiredAssetRolesForPublish([])).toEqual(["hero", "visualizer_texture"]);
  });

  it("requires active roles and ignores inactive entries", () => {
    expect(
      getMissingRequiredAssetRolesForPublish([
        { kind: "hero", isActive: false },
        { kind: "visualizer_texture", isActive: true },
      ]),
    ).toEqual(["hero"]);
  });

  it("returns empty when required active roles exist", () => {
    expect(
      getMissingRequiredAssetRolesForPublish([
        { kind: "hero", isActive: true },
        { kind: "visualizer_texture", isActive: true },
        { kind: "gallery", isActive: true },
      ]),
    ).toEqual([]);
  });
});

describe("assertWrapCanBePublished", () => {
  it("throws with missing role details", () => {
    expect(() =>
      assertWrapCanBePublished([
        { kind: "hero", isActive: true },
        { kind: "visualizer_texture", isActive: false },
      ]),
    ).toThrow("Cannot publish wrap. Missing active asset roles: visualizer_texture");
  });

  it("does not throw when publish prerequisites are met", () => {
    expect(() =>
      assertWrapCanBePublished([
        { kind: "hero", isActive: true },
        { kind: "visualizer_texture", isActive: true },
      ]),
    ).not.toThrow();
  });
});
