import { type WebhookEvent, verifyWebhook } from '@clerk/nextjs/webhooks';

import { syncClerkWebhookEvent } from '../../../../lib/actions/clerk';
import { ActionInputValidationError } from '../../../../lib/actions/shared';
import { createLogContext, logEvent } from '../../../../lib/observability/structured-logger';

type SupportedClerkWebhookType = 'user.created' | 'user.updated' | 'user.deleted';
type VerifyWebhookRequest = Parameters<typeof verifyWebhook>[0];
type VerifyWebhookOptions = NonNullable<Parameters<typeof verifyWebhook>[1]>;

function isSupportedClerkWebhookType(eventType: WebhookEvent['type']): eventType is SupportedClerkWebhookType {
  return eventType === 'user.created' || eventType === 'user.updated' || eventType === 'user.deleted';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'unknown_error';
}

function requestHeadersToObject(request: Request): Readonly<Record<string, string>> {
  return Object.fromEntries(request.headers.entries());
}

export async function POST(request: Request): Promise<Response> {
  const payload = await request.text();
  const requestHeaders = requestHeadersToObject(request);
  const baseLogContext = createLogContext({
    headers: requestHeaders,
    source: 'webhook.clerk'
  });
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim();
  if (!signingSecret) {
    logEvent({
      level: 'error',
      event: 'clerk.webhook.missing_signing_secret',
      context: baseLogContext
    });

    return Response.json(
      {
        error: 'Clerk webhook signing secret is not configured'
      },
      {
        status: 500
      }
    );
  }

  const verificationRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: payload
  });

  let webhookEvent: WebhookEvent;
  try {
    webhookEvent = await verifyWebhook(
      verificationRequest as VerifyWebhookRequest,
      {
        signingSecret
      } as VerifyWebhookOptions
    );
  } catch (error) {
    logEvent({
      level: 'warn',
      event: 'clerk.webhook.invalid_signature',
      context: baseLogContext,
      data: {
        payload,
        svixId: request.headers.get('svix-id'),
        svixSignature: request.headers.get('svix-signature'),
        reason: getErrorMessage(error)
      }
    });

    return Response.json(
      {
        error: 'Invalid Clerk signature'
      },
      {
        status: 400
      }
    );
  }

  const clerkEventId = request.headers.get('svix-id');
  if (!clerkEventId) {
    logEvent({
      level: 'warn',
      event: 'clerk.webhook.missing_event_id',
      context: baseLogContext,
      data: {
        payload
      }
    });

    return Response.json(
      {
        error: 'Missing Clerk event id'
      },
      {
        status: 400
      }
    );
  }

  logEvent({
    event: 'clerk.webhook.received',
    context: baseLogContext,
    data: {
      clerkEventId,
      eventType: webhookEvent.type,
      payload
    }
  });

  if (!isSupportedClerkWebhookType(webhookEvent.type)) {
    logEvent({
      event: 'clerk.webhook.ignored_event_type',
      context: baseLogContext,
      data: {
        clerkEventId,
        eventType: webhookEvent.type
      }
    });

    return Response.json({
      received: true,
      ignored: true
    });
  }

  try {
    const result = await syncClerkWebhookEvent({
      clerkEventId,
      eventType: webhookEvent.type,
      payload,
      data: webhookEvent.data
    });

    if (result.ignoredTenantIds.length > 0 || result.ignoredRoleTenantIds.length > 0) {
      logEvent({
        level: 'warn',
        event: 'clerk.webhook.membership_ignored',
        context: baseLogContext,
        data: {
          clerkEventId,
          ignoredTenantIds: result.ignoredTenantIds,
          ignoredRoleTenantIds: result.ignoredRoleTenantIds
        }
      });
    }

    logEvent({
      event: result.idempotent ? 'clerk.webhook.idempotent_skip' : 'clerk.webhook.processed',
      context: baseLogContext,
      data: {
        clerkEventId,
        eventType: webhookEvent.type,
        idempotent: result.idempotent,
        clerkUserId: result.clerkUserId,
        upsertedMembershipCount: result.upsertedMembershipCount,
        deactivatedMembershipCount: result.deactivatedMembershipCount
      }
    });

    return Response.json({
      received: true,
      idempotent: result.idempotent
    });
  } catch (error) {
    if (error instanceof ActionInputValidationError) {
      logEvent({
        level: 'warn',
        event: 'clerk.webhook.invalid_payload',
        context: baseLogContext,
        data: {
          clerkEventId,
          validationErrors: error.details,
          payload
        }
      });

      return Response.json(
        {
          error: 'Invalid Clerk payload'
        },
        {
          status: 400
        }
      );
    }

    logEvent({
      level: 'error',
      event: 'clerk.webhook.sync_failed',
      context: baseLogContext,
      data: {
        clerkEventId,
        payload,
        reason: getErrorMessage(error)
      }
    });

    return Response.json(
      {
        error: 'Unable to process Clerk webhook'
      },
      {
        status: 500
      }
    );
  }
}

