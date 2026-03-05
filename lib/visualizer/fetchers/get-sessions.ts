import type { PreviewSessionDTO } from "../types";

/**
 * Fetches all active preview sessions for a tenant, ordered newest first.
 * @param tenantId - Tenant scope (server-side verified — never accept from client)
 * @returns Array of preview session DTOs
 *
 * TODO: Replace stub with Prisma query when database is configured:
 * const rows = await prisma.previewSession.findMany({
 *   where: { tenantId, deletedAt: null },
 *   orderBy: { createdAt: "desc" },
 *   select: previewSessionDTOFields,
 * });
 * return rows.map(transformToDTO);
 */
export async function getPreviewSessionsForTenant(
  tenantId: string
): Promise<PreviewSessionDTO[]> {
  void tenantId; // will be used once Prisma is wired up
  return [];
}

/**
 * Fetches a single preview session by ID, scoped to the tenant.
 * @param tenantId - Tenant scope
 * @param sessionId - Session ID
 * @returns Preview session DTO or null if not found / wrong tenant
 *
 * TODO: Replace stub with Prisma query when database is configured.
 */
export async function getPreviewSessionById(
  tenantId: string,
  sessionId: string
): Promise<PreviewSessionDTO | null> {
  void tenantId;
  void sessionId;
  return null;
}
