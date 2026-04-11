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

export function toHHmm(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}
