import { describe, expect, it } from 'vitest';

import {
  TEMPLATE_STYLES,
  createTemplatePreview
} from '../../features/visualizer/template-preview';
import { createTemplatePreviewAction } from '../../lib/actions/create-template-preview';
import { AuthError } from '../../lib/auth/require-auth';

describe('template preview engine', () => {
  it('generates preview HTML + SVG data url for each template style', () => {
    for (const style of TEMPLATE_STYLES) {
      const preview = createTemplatePreview({
        templateStyle: style,
        wrapName: 'Satin Carbon',
        primaryColor: '#111111',
        accentColor: '#22ccff',
        vehicleName: 'Ford Transit'
      });

      expect(preview.html).toContain(`template-${style}`);
      expect(preview.html).toContain('Satin Carbon');
      expect(preview.svgDataUrl.startsWith('data:image/svg+xml,')).toBe(true);
    }
  });

  it('escapes unsafe content in rendered markup', () => {
    const preview = createTemplatePreview({
      templateStyle: 'minimal',
      wrapName: '<script>alert(1)</script>',
      primaryColor: '#000000',
      accentColor: '#ffffff',
      vehicleName: '<b>unsafe</b>'
    });

    expect(preview.html).not.toContain('<script>');
    expect(preview.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(preview.html).toContain('&lt;b&gt;unsafe&lt;/b&gt;');
  });

  it('requires an authenticated user for preview generation action', async () => {
    await expect(
      createTemplatePreviewAction({
        headers: {
          host: 'acme.localhost:3000'
        },
        tenantId: 'tenant_acme',
        payload: {
          templateStyle: 'sport',
          wrapName: 'Ocean Blue',
          primaryColor: '#001122',
          accentColor: '#11aadd',
          vehicleName: 'Mercedes Sprinter'
        }
      })
    ).rejects.toThrowError(AuthError);
  });
});
