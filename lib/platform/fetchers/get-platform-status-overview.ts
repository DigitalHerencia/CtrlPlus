import { prisma } from "@/lib/prisma";
import { requirePlatformDeveloperAdmin } from "@/lib/authz/guards";

export interface PlatformStatusOverviewDTO {
  generatedAt: string;
  databaseVersion: string;
  activeUsers: number;
  activeBookings: number;
  activeInvoices: number;
  activeWraps: number;
}

export async function getPlatformStatusOverview(): Promise<PlatformStatusOverviewDTO> {
  await requirePlatformDeveloperAdmin();

  const [versionResult, activeUsers, activeBookings, activeInvoices, activeWraps] =
    await Promise.all([
      prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`,
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.invoice.count({ where: { deletedAt: null } }),
      prisma.wrap.count({ where: { deletedAt: null } }),
    ]);

  return {
    generatedAt: new Date().toISOString(),
    databaseVersion: versionResult[0]?.version ?? "Unknown",
    activeUsers,
    activeBookings,
    activeInvoices,
    activeWraps,
  };
}
