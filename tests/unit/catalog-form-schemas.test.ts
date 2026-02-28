import { describe, expect, it } from 'vitest';

import {
  wrapCatalogEditorFormSchema,
  wrapCatalogListControlsFormSchema,
} from '../../lib/shared/schemas/catalog/schema';

describe('catalog form schemas', () => {
  it('accepts valid list controls values', () => {
    const parsed = wrapCatalogListControlsFormSchema.parse({
      q: 'matte',
      minPriceCents: '5000',
      maxPriceCents: '12000',
      sort: 'updatedAt',
      direction: 'desc',
      pageSize: '24',
    });

    expect(parsed).toEqual({
      q: 'matte',
      minPriceCents: '5000',
      maxPriceCents: '12000',
      sort: 'updatedAt',
      direction: 'desc',
      pageSize: '24',
    });
  });

  it('rejects list controls when minimum price exceeds maximum price', () => {
    const result = wrapCatalogListControlsFormSchema.safeParse({
      q: '',
      minPriceCents: '9000',
      maxPriceCents: '1000',
      sort: 'updatedAt',
      direction: 'desc',
      pageSize: '12',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['minPriceCents']);
    }
  });

  it('rejects editor form values with fractional cents', () => {
    const result = wrapCatalogEditorFormSchema.safeParse({
      name: 'Matte Black',
      description: '',
      priceCents: '10.5',
      isPublished: 'false',
    });

    expect(result.success).toBe(false);
  });

  it('accepts editor form values without publish state', () => {
    const parsed = wrapCatalogEditorFormSchema.parse({
      name: 'Satin Gray',
      description: 'Fleet-ready option',
      priceCents: '29999',
    });

    expect(parsed).toEqual({
      name: 'Satin Gray',
      description: 'Fleet-ready option',
      priceCents: '29999',
    });
  });
});
