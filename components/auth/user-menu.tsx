'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { UserButton } from '@clerk/nextjs'

/**
 * UserMenu — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function UserMenu() {
    return (
        <UserButton
            appearance={{
                elements: {
                    avatarBox: 'h-9 w-9',
                    userButtonPopoverCard:
                        'border border-neutral-700 bg-neutral-950/80 text-neutral-100',
                    userButtonPopoverActionButton: 'hover:bg-blue-600 hover:text-neutral-100',
                },
            }}
        />
    )
}
