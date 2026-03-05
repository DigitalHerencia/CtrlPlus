/**
 * Clerk Sign-Up Component Wrapper
 *
 * Wraps Clerk's SignUp component with shadcn styling.
 */

"use client";

import { SignUp } from "@clerk/nextjs";

export function ClerkSignUpWrapper() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Get started with CTRL+ today
        </p>
      </div>

      <SignUp
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
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}
