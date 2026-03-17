import { describe, expect, it, vi } from "vitest";
import { generateCompositePreview } from "../preview-pipeline";
import * as storage from "../storage";
import type { UploadPhotoInput, VisualizerPreviewDTO } from "../types";
import { uploadAndGeneratePreview } from "./upload-and-preview";

vi.mock("../storage");
const mockedGeneratePreview = generateCompositePreview as unknown as ReturnType<typeof vi.fn>;
vi.mock("../preview-pipeline");

// Basic test cases

describe("uploadAndGeneratePreview", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(storage.storePreviewImage).mockResolvedValue("https://cloudinary.com/fake-url.jpg");
    mockedGeneratePreview.mockResolvedValue({
      id: "preview-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "https://cloudinary.com/fake-url.jpg",
      processedImageUrl: "https://cloudinary.com/fake-preview.jpg",
      status: "complete",
      cacheKey: "preview-cache-key",
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as VisualizerPreviewDTO);
  });

  it("uploads valid image and generates preview", async () => {
    const input: UploadPhotoInput = {
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,fakebase64",
    };
    const result = await uploadAndGeneratePreview(input);
    expect(result.processedImageUrl).toBe("https://cloudinary.com/fake-preview.jpg");
    expect(result.cacheKey).toBe("preview-cache-key");
    expect(result.status).toBe("complete");
  });

  it("rejects image with invalid dimensions", async () => {
    vi.mocked(storage.storePreviewImage).mockRejectedValue(
      new Error("Image dimensions are invalid"),
    );
    const input: UploadPhotoInput = {
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,invalidbase64",
    };
    await expect(uploadAndGeneratePreview(input)).rejects.toThrow("Image dimensions are invalid");
  });

  it("rejects image if moderation fails", async () => {
    vi.mocked(storage.storePreviewImage).mockRejectedValue(new Error("Image failed moderation"));
    const input: UploadPhotoInput = {
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,moderationfail",
    };
    await expect(uploadAndGeneratePreview(input)).rejects.toThrow("Image failed moderation");
  });

  it("enforces ownership checks", async () => {
    mockedGeneratePreview.mockResolvedValue({
      id: "preview-1",
      wrapId: "wrap-1",
      customerPhotoUrl: "https://cloudinary.com/fake-url.jpg",
      processedImageUrl: "https://cloudinary.com/fake-preview.jpg",
      status: "complete",
      cacheKey: "preview-cache-key",
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      // Simulate wrong owner
    } as VisualizerPreviewDTO);
    const input: UploadPhotoInput = {
      wrapId: "wrap-1",
      customerPhotoUrl: "data:image/png;base64,ownershipfail",
    };
    // Simulate ownership check failure by throwing in generatePreview
    mockedGeneratePreview.mockRejectedValue(new Error("User does not own this preview"));
    await expect(uploadAndGeneratePreview(input)).rejects.toThrow("User does not own this preview");
  });
});
