import { createHash } from 'node:crypto';

import { isRole, type Role } from '../../features/authz/permissions';
import { runTransactionWithRetry, type TransactionRunner } from '../db/transaction';
import { type TenantScopedPrisma, tenantScopedPrisma } from '../db/prisma';
import { isKnownTenantId } from '../tenancy/resolve-tenant';
import { clerkWebhookSyncInputSchema } from '../shared/schemas/auth';
import { validateActionInput } from './shared';

type ClerkUserLifecycleEventType = 'user.created' | 'user.updated' | 'user.deleted';

interface ValidTenantRole {
  readonly tenantId: string;
  readonly role: Role;
}

interface ParsedTenantRoles {
  readonly validTenantRoles: readonly ValidTenantRole[];
  readonly ignoredTenantIds: readonly string[];
  readonly ignoredRoleTenantIds: readonly string[];
}

export interface SyncClerkWebhookEventResult {
  readonly clerkEventId: string;
  readonly eventType: ClerkUserLifecycleEventType;
  readonly clerkUserId: string;
  readonly idempotent: boolean;
  readonly ignoredTenantIds: readonly string[];
  readonly ignoredRoleTenantIds: readonly string[];
  readonly upsertedMembershipCount: number;
  readonly deactivatedMembershipCount: number;
}

export type ClerkWebhookTransactionClient = Pick<
  TenantScopedPrisma,
  | 'createClerkWebhookEvent'
  | 'deactivateMembershipsForClerkUser'
  | 'deactivateMembershipsForClerkUserExcludingTenants'
  | 'getClerkWebhookEventByEventId'
  | 'markClerkWebhookEventStatus'
  | 'upsertClerkUser'
  | 'upsertTenantUserMembership'
>;

const runClerkWebhookTransactionRunner: TransactionRunner<ClerkWebhookTransactionClient> = async (
  callback
) => callback(tenantScopedPrisma);

function checksumPayload(payload: string): string {
  return createHash('sha256').update(payload).digest('hex');
}

function getPrimaryEmail(input: {
  readonly email_addresses: ReadonlyArray<{
    readonly id: string;
    readonly email_address: string;
  }>;
  readonly primary_email_address_id?: string | null;
}): string | undefined {
  const primaryEmail = input.email_addresses.find(
    (emailAddress) => emailAddress.id === input.primary_email_address_id
  ) ?? input.email_addresses[0];

  return primaryEmail ? primaryEmail.email_address.toLowerCase() : undefined;
}

function parseTenantRoles(tenantRoles: Readonly<Record<string, string>> | undefined): ParsedTenantRoles {
  if (!tenantRoles) {
    return {
      validTenantRoles: [],
      ignoredTenantIds: [],
      ignoredRoleTenantIds: []
    };
  }

  const validTenantRoles: ValidTenantRole[] = [];
  const ignoredTenantIds: string[] = [];
  const ignoredRoleTenantIds: string[] = [];
  const sortedTenantRoles = Object.entries(tenantRoles).sort(([left], [right]) => left.localeCompare(right));

  for (const [tenantId, roleCandidate] of sortedTenantRoles) {
    if (!isKnownTenantId(tenantId)) {
      ignoredTenantIds.push(tenantId);
      continue;
    }

    if (!isRole(roleCandidate)) {
      ignoredRoleTenantIds.push(tenantId);
      continue;
    }

    validTenantRoles.push({
      tenantId,
      role: roleCandidate
    });
  }

  return {
    validTenantRoles,
    ignoredTenantIds,
    ignoredRoleTenantIds
  };
}

function buildReceivedEvent(
  tx: ClerkWebhookTransactionClient,
  input: {
    readonly clerkEventId: string;
    readonly eventType: ClerkUserLifecycleEventType;
    readonly clerkUserId: string;
    readonly payloadChecksum: string;
    readonly tenantId?: string;
  }
): boolean {
  const existingEvent = tx.getClerkWebhookEventByEventId(input.clerkEventId);
  if (existingEvent?.status === 'processed') {
    return true;
  }

  if (!existingEvent) {
    tx.createClerkWebhookEvent({
      clerkEventId: input.clerkEventId,
      eventType: input.eventType,
      clerkUserId: input.clerkUserId,
      tenantId: input.tenantId,
      payloadChecksum: input.payloadChecksum
    });
  }

  return false;
}

function processCreateOrUpdate(
  tx: ClerkWebhookTransactionClient,
  input: {
    readonly clerkUserId: string;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly imageUrl?: string | null;
    readonly emailAddresses: ReadonlyArray<{
      readonly id: string;
      readonly email_address: string;
    }>;
    readonly primaryEmailAddressId?: string | null;
    readonly tenantRoles: ParsedTenantRoles;
  }
): {
  readonly deactivatedMembershipCount: number;
  readonly upsertedMembershipCount: number;
} {
  const now = new Date();
  const activeTenantIds = new Set<string>();

  tx.upsertClerkUser({
    id: input.clerkUserId,
    primaryEmail: getPrimaryEmail({
      email_addresses: input.emailAddresses,
      primary_email_address_id: input.primaryEmailAddressId
    }),
    firstName: input.firstName ?? undefined,
    lastName: input.lastName ?? undefined,
    imageUrl: input.imageUrl ?? undefined,
    isDeleted: false,
    lastSyncedAt: now
  });

  for (const tenantRole of input.tenantRoles.validTenantRoles) {
    activeTenantIds.add(tenantRole.tenantId);
    tx.upsertTenantUserMembership({
      tenantId: tenantRole.tenantId,
      clerkUserId: input.clerkUserId,
      role: tenantRole.role,
      isActive: true
    });
  }

  return {
    upsertedMembershipCount: input.tenantRoles.validTenantRoles.length,
    deactivatedMembershipCount: tx.deactivateMembershipsForClerkUserExcludingTenants(
      input.clerkUserId,
      activeTenantIds
    )
  };
}

function processDelete(
  tx: ClerkWebhookTransactionClient,
  clerkUserId: string
): {
  readonly deactivatedMembershipCount: number;
} {
  tx.upsertClerkUser({
    id: clerkUserId,
    isDeleted: true,
    lastSyncedAt: new Date()
  });

  return {
    deactivatedMembershipCount: tx.deactivateMembershipsForClerkUser(clerkUserId)
  };
}

export async function runClerkWebhookTransaction<TResult>(
  operation: (tx: ClerkWebhookTransactionClient) => TResult | Promise<TResult>
): Promise<TResult> {
  return runTransactionWithRetry(runClerkWebhookTransactionRunner, async (tx) => Promise.resolve(operation(tx)));
}

export async function syncClerkWebhookEvent(input: unknown): Promise<SyncClerkWebhookEventResult> {
  const validatedInput = validateActionInput(clerkWebhookSyncInputSchema, input);
  const payloadChecksum = checksumPayload(validatedInput.payload);
  const parsedTenantRoles = validatedInput.eventType === 'user.deleted'
    ? {
      validTenantRoles: [],
      ignoredTenantIds: [],
      ignoredRoleTenantIds: []
    }
    : parseTenantRoles(validatedInput.data.private_metadata?.tenantRoles);

  return runClerkWebhookTransaction((tx) => {
    const clerkUserId = validatedInput.data.id;
    const idempotent = buildReceivedEvent(tx, {
      clerkEventId: validatedInput.clerkEventId,
      eventType: validatedInput.eventType,
      clerkUserId,
      payloadChecksum,
      tenantId: parsedTenantRoles.validTenantRoles[0]?.tenantId
    });

    if (idempotent) {
      return {
        clerkEventId: validatedInput.clerkEventId,
        eventType: validatedInput.eventType,
        clerkUserId,
        idempotent: true,
        ignoredTenantIds: [],
        ignoredRoleTenantIds: [],
        upsertedMembershipCount: 0,
        deactivatedMembershipCount: 0
      };
    }

    const membershipResult = validatedInput.eventType === 'user.deleted'
      ? {
        upsertedMembershipCount: 0,
        ...processDelete(tx, clerkUserId)
      }
      : processCreateOrUpdate(tx, {
        clerkUserId,
        firstName: validatedInput.data.first_name,
        lastName: validatedInput.data.last_name,
        imageUrl: validatedInput.data.image_url,
        emailAddresses: validatedInput.data.email_addresses,
        primaryEmailAddressId: validatedInput.data.primary_email_address_id,
        tenantRoles: parsedTenantRoles
      });

    tx.markClerkWebhookEventStatus(validatedInput.clerkEventId, 'processed');

    return {
      clerkEventId: validatedInput.clerkEventId,
      eventType: validatedInput.eventType,
      clerkUserId,
      idempotent: false,
      ignoredTenantIds: parsedTenantRoles.ignoredTenantIds,
      ignoredRoleTenantIds: parsedTenantRoles.ignoredRoleTenantIds,
      upsertedMembershipCount: membershipResult.upsertedMembershipCount,
      deactivatedMembershipCount: membershipResult.deactivatedMembershipCount
    };
  });
}
