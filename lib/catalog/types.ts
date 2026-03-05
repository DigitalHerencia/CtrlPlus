export enum WrapCategory {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  ACCENT = "ACCENT",
  COLOR_CHANGE = "COLOR_CHANGE",
  COMMERCIAL = "COMMERCIAL",
  PROTECTIVE = "PROTECTIVE",
}

export enum WrapStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
}

/** Data-transfer object returned by catalog fetchers. */
export interface WrapDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimatedHours: number;
  status: WrapStatus;
  imageUrls: string[];
  category: WrapCategory;
  createdAt: Date;
}
