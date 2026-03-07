import { describe, expect, it } from "vitest";
import { validateWrapImageFile } from "../image-storage";

describe("validateWrapImageFile", () => {
  it("accepts supported mime types", () => {
    const file = new File([new Uint8Array([1, 2])], "a.png", { type: "image/png" });
    expect(() => validateWrapImageFile(file)).not.toThrow();
  });

  it("rejects unsupported mime types", () => {
    const file = new File([new Uint8Array([1, 2])], "a.gif", { type: "image/gif" });
    expect(() => validateWrapImageFile(file)).toThrow("Unsupported image format");
  });
});
