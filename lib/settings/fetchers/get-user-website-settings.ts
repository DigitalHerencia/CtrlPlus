import { prisma } from "@/lib/prisma";
import { type WebsiteSettingsDTO } from "../types";

const DEFAULT_TIMEZONE = process.env.DEFAULT_STORE_TIMEZONE ?? "America/Denver";

export async function getUserWebsiteSettings(clerkUserId: string): Promise<WebsiteSettingsDTO> {
  const settings = await prisma.websiteSettings.upsert({
    where: { clerkUserId },
    create: {
      clerkUserId,
      preferredContact: "email",
      appointmentReminders: true,
      marketingOptIn: false,
      timezone: DEFAULT_TIMEZONE,
    },
    update: {},
    select: {
      preferredContact: true,
      appointmentReminders: true,
      marketingOptIn: true,
      timezone: true,
      updatedAt: true,
    },
  });

  return {
    preferredContact: settings.preferredContact as "email" | "sms",
    appointmentReminders: settings.appointmentReminders,
    marketingOptIn: settings.marketingOptIn,
    timezone: settings.timezone,
    updatedAt: settings.updatedAt.toISOString(),
  };
}
