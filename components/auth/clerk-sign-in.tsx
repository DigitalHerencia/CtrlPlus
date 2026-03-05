/**
 * Clerk Sign-In Component Wrapper
 *
 * Wraps Clerk's SignIn component with shadcn styling.
 */

"use client";

import { SignIn } from "@clerk/nextjs";

export function ClerkSignInWrapper() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Sign in to your CTRL+ account
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border-neutral-200 dark:border-neutral-800",
            headerTitle: "text-neutral-900 dark:text-neutral-100",
            headerSubtitle: "text-neutral-600 dark:text-neutral-400",
            socialButtonsBlockButton:
              "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900",
            formButtonPrimary:
              "bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200",
            formFieldInput:
              "border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100",
            footerActionLink:
              "text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
