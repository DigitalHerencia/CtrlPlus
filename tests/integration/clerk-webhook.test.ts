import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { POST } from '../../app/api/clerk/webhook-handler/route';
import { tenantScopedPrisma } from '../../lib/db/prisma';
import { resetLogSink, setLogSink, type StructuredLogEntry } from '../../lib/observability/structured-logger';

const webhookSecret = 'whsec_dGVzdF9jbGVya193ZWJob29rX3NlY3JldA==';

function signPayload(payload: string, eventId: string, timestampSeconds: number): string {
  const encodedSecret = webhookSecret.startsWith('whsec_') ? webhookSecret.slice('whsec_'.length) : webhookSecret;
  const key = Buffer.from(encodedSecret, 'base64');
  const signaturePayload = `${eventId}.${timestampSeconds.toString()}.${payload}`;
  const signature = createHmac('sha256', key).update(signaturePayload).digest('base64');
  return `v1,${signature}`;
}

function createSignedWebhookRequest(input: {
  readonly payload: string;
  readonly eventId: string;
  readonly signature?: string;
}): Request {
  const timestampSeconds = Math.floor(Date.now() / 1000);

  return new Request('http://localhost/api/clerk/webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'svix-id': input.eventId,
      'svix-timestamp': timestampSeconds.toString(),
      'svix-signature': input.signature ?? signPayload(input.payload, input.eventId, timestampSeconds)
    },
    body: input.payload
  });
}

describe('clerk webhook sync integration', () => {
  const entries: StructuredLogEntry[] = [];

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SIGNING_SECRET = webhookSecret;
    tenantScopedPrisma.reset();
    entries.length = 0;
    setLogSink((entry) => {
      entries.push(entry);
    });
  });

  afterEach(() => {
    resetLogSink();
    delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  });

  it('handles user.created and user.updated by upserting user and memberships', async () => {
    const createPayload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'user_sync_1',
        first_name: 'Alex',
        last_name: 'Driver',
        image_url: 'https://cdn.example.com/avatar.png',
        primary_email_address_id: 'email_primary_1',
        email_addresses: [
          {
            id: 'email_primary_1',
            email_address: 'Alex.Driver@Example.com'
          }
        ],
        private_metadata: {
          tenantRoles: {
            tenant_acme: 'manager',
            tenant_beta: 'viewer',
            tenant_unknown: 'owner'
          }
        }
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const createdResponse = await POST(
      createSignedWebhookRequest({
        payload: createPayload,
        eventId: 'evt_clerk_create_1'
      })
    );

    expect(createdResponse.status).toBe(200);
    expect(await createdResponse.json()).toEqual({
      received: true,
      idempotent: false
    });

    const createdUser = tenantScopedPrisma.getClerkUserById('user_sync_1');
    expect(createdUser).not.toBeNull();
    expect(createdUser?.isDeleted).toBe(false);
    expect(createdUser?.primaryEmail).toBe('alex.driver@example.com');

    const createdMemberships = tenantScopedPrisma.listTenantUserMembershipsByClerkUser('user_sync_1');
    expect(createdMemberships).toHaveLength(2);
    expect(createdMemberships.find((membership) => membership.tenantId === 'tenant_acme')).toMatchObject({
      role: 'manager',
      isActive: true
    });
    expect(createdMemberships.find((membership) => membership.tenantId === 'tenant_beta')).toMatchObject({
      role: 'viewer',
      isActive: true
    });

    const updatedPayload = JSON.stringify({
      type: 'user.updated',
      data: {
        id: 'user_sync_1',
        first_name: 'Alexis',
        last_name: 'Driver',
        image_url: 'https://cdn.example.com/avatar-2.png',
        primary_email_address_id: 'email_primary_2',
        email_addresses: [
          {
            id: 'email_primary_2',
            email_address: 'Alexis.Driver@Example.com'
          }
        ],
        private_metadata: {
          tenantRoles: {
            tenant_beta: 'owner'
          }
        }
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const updatedResponse = await POST(
      createSignedWebhookRequest({
        payload: updatedPayload,
        eventId: 'evt_clerk_update_1'
      })
    );

    expect(updatedResponse.status).toBe(200);
    expect(await updatedResponse.json()).toEqual({
      received: true,
      idempotent: false
    });

    const updatedUser = tenantScopedPrisma.getClerkUserById('user_sync_1');
    expect(updatedUser?.firstName).toBe('Alexis');
    expect(updatedUser?.primaryEmail).toBe('alexis.driver@example.com');

    const updatedMemberships = tenantScopedPrisma.listTenantUserMembershipsByClerkUser('user_sync_1');
    expect(updatedMemberships.find((membership) => membership.tenantId === 'tenant_beta')).toMatchObject({
      role: 'owner',
      isActive: true
    });
    expect(updatedMemberships.find((membership) => membership.tenantId === 'tenant_acme')).toMatchObject({
      role: 'manager',
      isActive: false
    });

    const ignoredMembershipLog = entries.find((entry) => entry.event === 'clerk.webhook.membership_ignored');
    expect(ignoredMembershipLog?.data).toMatchObject({
      ignoredTenantIds: ['tenant_unknown']
    });
  });

  it('handles duplicate webhook events idempotently', async () => {
    const payload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'user_duplicate_1',
        first_name: 'Dupe',
        last_name: 'Check',
        image_url: 'https://cdn.example.com/avatar.png',
        primary_email_address_id: 'email_duplicate_1',
        email_addresses: [
          {
            id: 'email_duplicate_1',
            email_address: 'dupe@example.com'
          }
        ],
        private_metadata: {
          tenantRoles: {
            tenant_acme: 'viewer'
          }
        }
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const eventId = 'evt_clerk_duplicate_1';
    const firstResponse = await POST(
      createSignedWebhookRequest({
        payload,
        eventId
      })
    );
    const secondResponse = await POST(
      createSignedWebhookRequest({
        payload,
        eventId
      })
    );

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(await secondResponse.json()).toEqual({
      received: true,
      idempotent: true
    });

    const webhookEvents = tenantScopedPrisma.listClerkWebhookEvents().filter((event) => event.clerkEventId === eventId);
    expect(webhookEvents).toHaveLength(1);
    expect(webhookEvents[0]?.status).toBe('processed');
  });

  it('rejects webhook payloads with invalid signatures', async () => {
    const payload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'user_invalid_1',
        first_name: 'Invalid',
        last_name: 'Sig',
        image_url: 'https://cdn.example.com/avatar.png',
        primary_email_address_id: 'email_invalid_1',
        email_addresses: [
          {
            id: 'email_invalid_1',
            email_address: 'invalid@example.com'
          }
        ],
        private_metadata: {
          tenantRoles: {
            tenant_acme: 'viewer'
          }
        }
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const response = await POST(
      createSignedWebhookRequest({
        payload,
        eventId: 'evt_clerk_invalid_1',
        signature: 'v1,invalid_signature'
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Invalid Clerk signature'
    });

    const invalidSignatureLog = entries.find((entry) => entry.event === 'clerk.webhook.invalid_signature');
    expect(invalidSignatureLog?.data).toMatchObject({
      payload: '[REDACTED]',
      svixSignature: '[REDACTED]'
    });
  });

  it('fails fast when the Clerk webhook signing secret is missing', async () => {
    delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    const payload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'user_missing_secret_1',
        private_metadata: {
          tenantRoles: {
            tenant_acme: 'viewer'
          }
        }
      },
      object: 'event'
    });

    const response = await POST(
      createSignedWebhookRequest({
        payload,
        eventId: 'evt_clerk_missing_secret_1'
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Clerk webhook signing secret is not configured'
    });

    const missingSecretLog = entries.find((entry) => entry.event === 'clerk.webhook.missing_signing_secret');
    expect(missingSecretLog).toBeDefined();
  });

  it('marks users deleted and deactivates memberships on user.deleted', async () => {
    const createPayload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'user_delete_1',
        first_name: 'Delete',
        last_name: 'Me',
        image_url: 'https://cdn.example.com/avatar.png',
        primary_email_address_id: 'email_delete_1',
        email_addresses: [
          {
            id: 'email_delete_1',
            email_address: 'delete.me@example.com'
          }
        ],
        private_metadata: {
          tenantRoles: {
            tenant_acme: 'manager',
            tenant_beta: 'viewer'
          }
        }
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const deletePayload = JSON.stringify({
      type: 'user.deleted',
      data: {
        id: 'user_delete_1'
      },
      object: 'event',
      event_attributes: {
        http_request: {
          client_ip: '127.0.0.1',
          user_agent: 'vitest'
        }
      }
    });

    const createResponse = await POST(
      createSignedWebhookRequest({
        payload: createPayload,
        eventId: 'evt_clerk_delete_create_1'
      })
    );
    expect(createResponse.status).toBe(200);

    const deleteResponse = await POST(
      createSignedWebhookRequest({
        payload: deletePayload,
        eventId: 'evt_clerk_delete_1'
      })
    );
    expect(deleteResponse.status).toBe(200);
    expect(await deleteResponse.json()).toEqual({
      received: true,
      idempotent: false
    });

    const user = tenantScopedPrisma.getClerkUserById('user_delete_1');
    expect(user?.isDeleted).toBe(true);

    const memberships = tenantScopedPrisma.listTenantUserMembershipsByClerkUser('user_delete_1');
    expect(memberships.every((membership) => membership.isActive === false)).toBe(true);

    const deleteEvent = tenantScopedPrisma.getClerkWebhookEventByEventId('evt_clerk_delete_1');
    expect(deleteEvent?.status).toBe('processed');
  });
});
