"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  websiteSettingsSchema,
  type WebsiteSettingsDTO,
  type WebsiteSettingsInput,
} from "../types";

export async function updateUserWebsiteSettings(
  input: WebsiteSettingsInput,
): Promise<WebsiteSettingsDTO> {
  const session = await getSession();
  const userId = session.userId;
  if (!session.isAuthenticated || !userId) {
    throw new Error("Unauthorized: not authenticated");
  }

  const parsed = websiteSettingsSchema.parse(input);
  const updated = await prisma.websiteSettings.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      preferredContact: parsed.preferredContact,
      appointmentReminders: parsed.appointmentReminders,
      marketingOptIn: parsed.marketingOptIn,
      timezone: parsed.timezone,
    },
    update: {
      preferredContact: parsed.preferredContact,
      appointmentReminders: parsed.appointmentReminders,
      marketingOptIn: parsed.marketingOptIn,
      timezone: parsed.timezone,
    },
    select: {
      preferredContact: true,
      appointmentReminders: true,
      marketingOptIn: true,
      timezone: true,
      updatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "WEBSITE_SETTINGS_UPDATED",
      resourceType: "WebsiteSettings",
      resourceId: userId,
      details: JSON.stringify(parsed),
      timestamp: new Date(),
    },
  });

  return {
    preferredContact: updated.preferredContact as "email" | "sms",
    appointmentReminders: updated.appointmentReminders,
    marketingOptIn: updated.marketingOptIn,
    timezone: updated.timezone,
    updatedAt: updated.updatedAt.toISOString(),
  };
}
