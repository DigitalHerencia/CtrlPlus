"use server"

import { prisma } from "@/lib/prisma"
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve"
import { auth } from "@clerk/nextjs/server"

/**
 * Setup initial tenant for newly authenticated user
 *
 * When a user signs in/up for the first time:
 * 1. Verify Clerk user exists and is authenticated
 * 2. Check if user already has a database record
 * 3. If not, create User and Tenant records with OWNER membership
 * 4. Return the tenant ID for routing
 *
 * For single-user accounts, each user gets their own tenant.
 *
 * @returns Tenant ID (may be new or existing)
 * @throws Error if not authenticated or setup fails
 */
export async function setupUserTenant(): Promise<string> {
  // 1. Verify authentication
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    throw new Error("Unauthorized: not authenticated")
  }

  // 2. Check if user already exists in database
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  })

  // 3. If first time, create User record
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: "", // Will be synced by webhook
        firstName: null,
        lastName: null
      },
      select: { id: true }
    })
  }

  // 4. Get or create tenant for single-user model
  // Use subdomain-based resolution if available, otherwise create default tenant
  let tenantId: string | null = await resolveTenantFromRequest()

  if (!tenantId) {
    // No subdomain provided - create a new tenant for this user
    // In production, tenant slug should be derived from tenantId or user email domain
    const tenant = await prisma.tenant.create({
      data: {
        name: `${clerkUserId}'s Workspace`,
        slug: clerkUserId.toLowerCase() // Use Clerk ID as slug
      },
      select: { id: true }
    })
    tenantId = tenant.id
  }

  // 5. Ensure user is a member of their tenant (OWNER role)
  // Use upsert to handle if membership already exists
  await prisma.tenantUserMembership.upsert({
    where: {
      tenantId_userId: {
        tenantId,
        userId: user.id
      }
    },
    create: {
      tenantId,
      userId: user.id,
      role: "owner" // New users are owners of their tenant
    },
    update: {
      deletedAt: null // Restore if was soft-deleted
    }
  })

  // At this point tenantId is guaranteed to be a string
  return tenantId as string
}

/**
 * Get user's first tenant for redirection after sign-in
 *
 * Returns the tenant ID that the user should be redirected to.
 * For single-user accounts, this is their only tenant.
 *
 * @returns Tenant ID or null if user has no tenants
 */
export async function getUserFirstTenant(): Promise<string | null> {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    return null
  }

  // Get user by Clerk ID first
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  })

  if (!user) {
    return null
  }

  // Then query their memberships
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      userId: user.id,
      deletedAt: null
    },
    select: { tenantId: true },
    orderBy: { createdAt: "asc" }
  })

  return membership?.tenantId ?? null
}
