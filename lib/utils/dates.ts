/**
 * @introduction Utils — TODO: short one-line summary of dates.ts
 *
 * @description TODO: longer description for dates.ts. Keep it short — one or two sentences.
 * Domain: utils
 * Public: TODO (yes/no)
 */
/**
 * formatInstallationTime — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function formatInstallationTime(minutes: number | null): string | null {
    if (minutes === null) {
        return null
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
        return `${remainingMinutes} min`
    }

    if (remainingMinutes === 0) {
        return `${hours} hr`
    }

    return `${hours} hr ${remainingMinutes} min`
}

/**
 * toHHmm — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function toHHmm(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}
