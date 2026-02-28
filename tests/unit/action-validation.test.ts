import { z } from 'zod';
import { describe, expect, it } from 'vitest';

import {
  ActionInputValidationError,
  validateActionInput,
} from '../../lib/actions/shared';

describe('action input validation', () => {
  it('returns parsed values for valid input', () => {
    const schema = z.object({
      amountCents: z.number().int().positive(),
      customerEmail: z.email(),
    });

    const parsed = validateActionInput(schema, {
      amountCents: 2500,
      customerEmail: 'owner@example.com',
    });

    expect(parsed).toEqual({
      amountCents: 2500,
      customerEmail: 'owner@example.com',
    });
  });

  it('sorts validation details deterministically by normalized path', () => {
    const schema = z.object({
      zField: z.string().trim().min(3),
      aField: z.number().int().positive(),
    });

    let validationError: ActionInputValidationError | null = null;
    try {
      validateActionInput(schema, {
        zField: '',
        aField: 0,
      });
    } catch (error) {
      validationError = error as ActionInputValidationError;
    }

    expect(validationError).toBeInstanceOf(ActionInputValidationError);
    expect(validationError?.details).toEqual(
      [...(validationError?.details ?? [])].sort((left, right) => left.localeCompare(right)),
    );
    expect(validationError?.details.some((detail) => detail.startsWith('aField: '))).toBe(true);
    expect(validationError?.details.some((detail) => detail.startsWith('zField: '))).toBe(true);
  });

  it('normalizes nested array paths in deterministic error details', () => {
    const schema = z.object({
      payload: z.object({
        items: z.array(
          z.object({
            name: z.string().trim().min(2),
          }),
        ),
      }),
    });

    let validationError: ActionInputValidationError | null = null;
    try {
      validateActionInput(schema, {
        payload: {
          items: [{ name: '' }],
        },
      });
    } catch (error) {
      validationError = error as ActionInputValidationError;
    }

    expect(validationError).toBeInstanceOf(ActionInputValidationError);
    expect(validationError?.details[0]?.startsWith('payload.items.[0].name: ')).toBe(true);
  });

  it('uses input as the path for root-level issues', () => {
    let validationError: ActionInputValidationError | null = null;
    try {
      validateActionInput(z.string().min(2), '');
    } catch (error) {
      validationError = error as ActionInputValidationError;
    }

    expect(validationError).toBeInstanceOf(ActionInputValidationError);
    expect(validationError?.details[0]?.startsWith('input: ')).toBe(true);
  });
});

