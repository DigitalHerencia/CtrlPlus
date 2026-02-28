import { z, type ZodType } from 'zod';

export class ActionInputValidationError extends Error {
  readonly statusCode: number;

  readonly code: string;

  readonly details: readonly string[];

  constructor(details: readonly string[]) {
    super('Invalid action input');
    this.name = 'ActionInputValidationError';
    this.statusCode = 400;
    this.code = 'INPUT_VALIDATION_FAILED';
    this.details = details;
  }
}

function normalizePath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return 'input';
  }

  return path
    .map((segment) => {
      if (typeof segment === 'number') {
        return `[${segment.toString()}]`;
      }

      if (typeof segment === 'symbol') {
        return segment.toString();
      }

      return segment;
    })
    .join('.');
}

function getDeterministicDetails(error: z.ZodError): readonly string[] {
  return error.issues
    .map((issue) => `${normalizePath(issue.path)}: ${issue.message}`)
    .sort((left, right) => left.localeCompare(right));
}

export function validateActionInput<TInput>(schema: ZodType<TInput>, input: unknown): TInput {
  const result = schema.safeParse(input);
  if (result.success) {
    return result.data;
  }

  throw new ActionInputValidationError(getDeterministicDetails(result.error));
}

export const headerSchema = z.record(z.string(), z.string().optional());
