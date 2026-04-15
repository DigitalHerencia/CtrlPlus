'use client'


import { UserButton } from '@clerk/nextjs'


export function UserMenu() {
    return (
        <UserButton
            appearance={{
                elements: {
                    userButtonTrigger:
                        'rounded-full border border-neutral-700 transition-colors hover:border-blue-500 hover:bg-neutral-900',
                    avatarBox:
                        'h-9 w-9 rounded-full bg-blue-600 text-neutral-100 transition-colors hover:bg-blue-500',
                    userButtonAvatarBox:
                        'h-9 w-9 rounded-full bg-blue-600 text-neutral-100 transition-colors hover:bg-blue-500',
                    userButtonPopoverCard:
                        'border border-neutral-700 bg-neutral-950/80 text-neutral-100',
                    userButtonPopoverActionButton: 'hover:bg-blue-600 hover:text-neutral-100',
                },
            }}
        />
    )
}
