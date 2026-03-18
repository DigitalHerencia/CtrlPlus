import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import { type z } from 'zod'

type ResolverError = {
    type: string
    message: string
}

function setNestedError(
    target: Record<string, unknown>,
    path: Array<string | number>,
    error: ResolverError
) {
    if (path.length === 0) {
        target.root = error
        return
    }

    let current = target

    path.forEach((segment, index) => {
        const key = String(segment)

        if (index === path.length - 1) {
            current[key] = error
            return
        }

        const existing = current[key]
        if (!existing || typeof existing !== 'object') {
            current[key] = {}
        }

        current = current[key] as Record<string, unknown>
    })
}

export function zodResolver<TFieldValues extends FieldValues>(
    schema: z.ZodType<TFieldValues>
): Resolver<TFieldValues> {
    return async (values) => {
        const parsed = await schema.safeParseAsync(values)

        if (parsed.success) {
            return {
                values: parsed.data,
                errors: {},
            }
        }

        const errors: FieldErrors<TFieldValues> = {}

        for (const issue of parsed.error.issues) {
            setNestedError(
                errors,
                issue.path.filter(
                    (k): k is string | number => typeof k === 'string' || typeof k === 'number'
                ),
                {
                    type: issue.code,
                    message: issue.message,
                }
            )
        }

        // React Hook Form expects values to be an empty object of type Record<string, never> when errors exist
        return {
            values: {} as Record<string, never>,
            errors,
        }
    }
}
