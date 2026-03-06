"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { setupUserTenant } from "@/lib/auth/actions/setup-tenant"
import { cn } from "@/lib/utils"
import { useSignUp } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const { signUp } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [awaitingVerification, setAwaitingVerification] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const finalizeAndRedirect = async () => {
    const finalizeResult = await signUp.finalize()

    if (finalizeResult.error) {
      setError(finalizeResult.error.message || "Unable to finalize sign-up")
      return false
    }

    await setupUserTenant()
    router.push("/catalog")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setError("")
    setIsLoading(true)

    try {
      if (awaitingVerification) {
        if (!verificationCode.trim()) {
          setError("Please enter the verification code.")
          return
        }

        const verifyResult = await signUp.verifications.verifyEmailCode({
          code: verificationCode.trim()
        })

        if (verifyResult.error) {
          setError(verifyResult.error.message || "Invalid verification code")
          return
        }

        if (signUp.status === "complete" || !!signUp.createdSessionId) {
          const finalized = await finalizeAndRedirect()
          if (finalized) return
        }

        setError(`Verification is not complete yet (status: ${signUp.status}).`)
        return
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long")
        return
      }

      const passwordResult = await signUp.password({
        emailAddress: email,
        password
      })

      if (passwordResult.error) {
        setError(passwordResult.error.message || "Sign up failed. Please try again.")
        return
      }

      if (signUp.status === "complete" || !!signUp.createdSessionId) {
        const finalized = await finalizeAndRedirect()
        if (finalized) return
      }

      // Check if email verification is needed
      if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields?.includes("email_address")
      ) {
        const sendResult = await signUp.verifications.sendEmailCode()

        if (sendResult.error) {
          setError(sendResult.error.message || "Could not send verification code")
          return
        }

        setAwaitingVerification(true)
        setError("")
        return
      }

      setError("Sign-up requires additional verification steps in Clerk.")
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> }
      setError(error.errors?.[0]?.message || "Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-10 inline-flex items-center scale-200">
            <span className="text-lg sm:text-xl font-black tracking-normal text-neutral-100 border-2 border-white px-3 py-1.5 leading-none hover:scale-110">
              CTRL+
            </span>
          </Link>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-blue-600 mb-1">
            Get Started Today
          </h1>
          <p className="text-sm text-balance text-neutral-100">
            Create and manage your projects online.
          </p>
        </div>
        {awaitingVerification && (
          <div className="border border-blue-800/50 bg-blue-950/40 p-3 text-sm text-neutral-100">
            We sent a verification code to your email. Enter it below to complete sign-up.
          </div>
        )}
        {error && (
          <div className="animate-in fade-in border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {awaitingVerification ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 items-start">
              <Field>
                <Input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Verification code"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <button
                type="button"
                className="text-sm text-neutral-100 font-semibold hover:text-blue-600 transition-all underline-offset-4 hover:underline"
                onClick={async () => {
                  if (isLoading) return
                  setIsLoading(true)
                  setError("")
                  const sendResult = await signUp.verifications.sendEmailCode()
                  if (sendResult.error) {
                    setError(sendResult.error.message || "Could not resend code")
                  }
                  setIsLoading(false)
                }}
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
            <div className="flex flex-col gap-3 items-start">
              <Button
                className="w-full bg-blue-600 py-2.5 font-semibold text-neutral-100 transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify code"}
              </Button>
              <button
                type="button"
                className="text-sm text-neutral-100 hover:text-blue-600 underline-offset-4 hover:underline"
                onClick={async () => {
                  await signUp.reset()
                  setAwaitingVerification(false)
                  setVerificationCode("")
                  setPassword("")
                  setError("")
                }}
                disabled={isLoading}
              >
                Start over
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Must be at least 8 characters long."
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Button
              className="mt-6 w-full bg-blue-600 py-2.5 font-semibold text-neutral-100 transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="flex items-center justify-center gap-1 text-sm text-neutral-100">
              <span>Already have an account?</span>
              <Link
                href="/sign-in"
                className="font-semibold text-blue-600 transition-all underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
            <div id="clerk-captcha" />
          </div>
        )}
      </FieldGroup>
    </form>
  )
}
