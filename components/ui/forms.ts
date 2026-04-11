/**
 * @introduction Components — TODO: short one-line summary of forms.ts
 *
 * @description TODO: longer description for forms.ts. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { FieldErrors, FieldPath, FieldValues, Resolver, UseFormClearErrors, UseFormSetError } from 'react-hook-form'
import { type z } from 'zod'

/**
 * applyZodErrors — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function applyZodErrors<TFieldValues extends FieldValues>(
    error: z.ZodError,
    setError: UseFormSetError<TFieldValues>,
    clearErrors?: UseFormClearErrors<TFieldValues>
): void {
    clearErrors?.()

    for (const issue of error.issues) {
        const path = issue.path.join('.')
        const message = issue.message

        if (!path) {
            setError('root.server' as FieldPath<TFieldValues>, {
                type: issue.code,
                message,
            })
            continue
        }

        setError(path as FieldPath<TFieldValues>, {
            type: issue.code,
            message,
        })
    }
}

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

/**
 * zodResolver — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
                    (key): key is string | number =>
                        typeof key === 'string' || typeof key === 'number'
                ),
                {
                    type: issue.code,
                    message: issue.message,
                }
            )
        }

        return {
            values: {} as Record<string, never>,
            errors,
        }
    }
}
