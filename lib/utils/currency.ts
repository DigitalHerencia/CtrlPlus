/**
 * @introduction Utils — TODO: short one-line summary of currency.ts
 *
 * @description TODO: longer description for currency.ts. Keep it short — one or two sentences.
 * Domain: utils
 * Public: TODO (yes/no)
 */
/**
 * formatPrice — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(priceInCents / 100)
}
