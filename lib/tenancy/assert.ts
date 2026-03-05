/**
 * Tenant membership & permission assertion helpers.
 *
 * In production these query the `TenantUserMembership` table via Prisma.
 * The stubs below pass through in dev so the billing domain can be
 * exercised without a real database.
 */

export type TenantRole = "owner" | "admin" | "member";

/**
 * Asserts that `userId` is a member of `tenantId` with at least one of
 * the specified `roles`.  Throws `Error("Forbidden")` on failure.
 */
export async function assertTenantMembership(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _tenantId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _roles: TenantRole | TenantRole[]
): Promise<void> {
  // TODO: replace with real DB check once Prisma is configured.
  // const member = await prisma.tenantUserMembership.findFirst({
  //   where: { tenantId: _tenantId, userId: _userId },
  // });
  // const allowed = Array.isArray(_roles) ? _roles : [_roles];
  // if (!member || !allowed.includes(member.role as TenantRole)) {
  //   throw new Error('Forbidden: insufficient permissions');
  // }
}
