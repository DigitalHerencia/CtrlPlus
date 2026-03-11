import { z } from "zod";

export const websiteSettingsSchema = z.object({
  preferredContact: z.enum(["email", "sms"]).default("email"),
  appointmentReminders: z.boolean().default(true),
  marketingOptIn: z.boolean().default(false),
  timezone: z.string().min(1).max(100),
});

export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>;

export interface WebsiteSettingsDTO {
  preferredContact: "email" | "sms";
  appointmentReminders: boolean;
  marketingOptIn: boolean;
  timezone: string;
  updatedAt: string;
}
