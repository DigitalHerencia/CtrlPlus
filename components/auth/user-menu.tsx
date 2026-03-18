/**
 * User Menu Component
 *
 * Dropdown menu with user profile, sign-out, and account settings.
 * Uses Clerk's UserButton component with custom appearance.
 */

'use client'

import { UserButton } from '@clerk/nextjs'

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
