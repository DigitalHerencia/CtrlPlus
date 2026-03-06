/**
 * User Menu Component
 *
 * Dropdown menu with user profile, sign-out, and account settings.
 * Uses Clerk's UserButton component with custom appearance.
 */

"use client"

import { UserButton } from "@clerk/nextjs"

export function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-9 w-9 rounded-full",
          userButtonPopoverCard: "shadow-lg",
          userButtonPopoverActionButton: "hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }
      }}
    />
  )
}
