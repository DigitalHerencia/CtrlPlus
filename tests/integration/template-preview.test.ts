import { describe, expect, it } from 'vitest';

import { createTemplatePreviewAction } from '../../lib/actions/visualizer';
import { ActionInputValidationError } from '../../lib/actions/shared';
import { PermissionError } from '../../lib/auth/require-permission';
import { TenantAccessError } from '../../lib/tenancy/require-tenant';

const viewerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_viewer',
  'x-clerk-user-email': 'viewer@example.com',
  'x-clerk-org-id': 'org_acme',
} as const;

describe('template preview action integration', () => {
  it('returns a preview payload for users with catalog read permission', async () => {
    const preview = await createTemplatePreviewAction({
      headers: viewerHeaders,
      tenantId: 'tenant_acme',
      payload: {
        templateStyle: 'sport',
        wrapName: 'Acme Sport Stripe',
        primaryColor: '#001122',
        accentColor: '#22ccff',
        vehicleName: 'Transit Van',
      },
    });

    expect(preview.html).toContain('template-sport');
    expect(preview.html).toContain('Acme Sport Stripe');
    expect(preview.svgDataUrl.startsWith('data:image/svg+xml,')).toBe(true);
  });

  it('rejects users without tenant membership', async () => {
    await expect(
      createTemplatePreviewAction({
        headers: {
          host: 'acme.localhost:3000',
          'x-clerk-user-id': 'user_unknown',
          'x-clerk-user-email': 'unknown@example.com',
          'x-clerk-org-id': 'org_acme',
        },
        tenantId: 'tenant_acme',
        payload: {
          templateStyle: 'minimal',
          wrapName: 'Unknown User Request',
          primaryColor: '#001122',
          accentColor: '#22ccff',
          vehicleName: 'Transit Van',
        },
      }),
    ).rejects.toThrowError(PermissionError);
  });

  it('rejects tenant ids that do not match host-derived tenancy', async () => {
    await expect(
      createTemplatePreviewAction({
        headers: viewerHeaders,
        tenantId: 'tenant_beta',
        payload: {
          templateStyle: 'luxury',
          wrapName: 'Cross Tenant Attempt',
          primaryColor: '#102030',
          accentColor: '#304050',
          vehicleName: 'Transit Van',
        },
      }),
    ).rejects.toThrowError(TenantAccessError);
  });

  it('rejects malformed payloads with deterministic validation errors', async () => {
    await expect(
      createTemplatePreviewAction({
        headers: viewerHeaders,
        tenantId: 'tenant_acme',
        payload: {
          templateStyle: 'sport',
          wrapName: '',
          primaryColor: '',
          accentColor: '',
          vehicleName: '',
        },
      }),
    ).rejects.toThrowError(ActionInputValidationError);
  });
});

