import { z } from 'zod';

export const authSessionSchema = z.object({
  userId: z.string().min(1),
  tenantId: z.string().min(1),
  permissions: z.array(z.string().min(1))
});

const clerkTenantRolesSchema = z.record(z.string().min(1), z.string().min(1));

const clerkPrivateMetadataSchema = z
  .object({
    tenantRoles: clerkTenantRolesSchema.optional()
  })
  .passthrough();

const clerkUserDataSchema = z.object({
  id: z.string().min(1),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  primary_email_address_id: z.string().nullable().optional(),
  email_addresses: z.array(
    z.object({
      id: z.string().min(1),
      email_address: z.string().email()
    })
  ),
  private_metadata: clerkPrivateMetadataSchema.optional()
});

const clerkUserDeletedDataSchema = z.object({
  id: z.string().min(1)
});

export const clerkWebhookEventTypeSchema = z.enum(['user.created', 'user.updated', 'user.deleted']);

export const clerkWebhookSyncInputSchema = z.discriminatedUnion('eventType', [
  z.object({
    clerkEventId: z.string().min(1),
    eventType: z.literal('user.created'),
    payload: z.string().min(1),
    data: clerkUserDataSchema
  }),
  z.object({
    clerkEventId: z.string().min(1),
    eventType: z.literal('user.updated'),
    payload: z.string().min(1),
    data: clerkUserDataSchema
  }),
  z.object({
    clerkEventId: z.string().min(1),
    eventType: z.literal('user.deleted'),
    payload: z.string().min(1),
    data: clerkUserDeletedDataSchema
  })
]);
