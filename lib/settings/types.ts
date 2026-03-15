import { z } from "zod";

export const websiteSettingsSchema = z.object({
  preferredContact: z.enum(["email", "sms"]).default("email"),
  appointmentReminders: z.boolean().default(true),
  marketingOptIn: z.boolean().default(false),
  timezone: z
    .string()
    .trim()
    .min(1, "Timezone is required.")
    .max(100, "Timezone must be 100 characters or fewer."),
});

export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>;

export interface WebsiteSettingsDTO {
  preferredContact: "email" | "sms";
  appointmentReminders: boolean;
  marketingOptIn: boolean;
  timezone: string;
  updatedAt: string;
}
