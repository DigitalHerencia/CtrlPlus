"use client";

import { LogoMark } from "@/components/shared/logo-mark";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sanitizePostAuthRedirect } from "@/lib/auth/redirect";
import { cn } from "@/lib/utils";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps extends React.ComponentProps<"form"> {
  redirectUrl?: string;
}

export function LoginForm({ className, redirectUrl, ...props }: LoginFormProps) {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingSecondFactor, setAwaitingSecondFactor] = useState(false);
  const [secondFactorMethod, setSecondFactorMethod] = useState<"email_code" | "phone_code" | null>(
    null,
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nextUrl = sanitizePostAuthRedirect(redirectUrl);

  const finalizeAndRedirect = async () => {
    const finalizeResult = await signIn.finalize();

    if (finalizeResult.error) {
      setError(finalizeResult.error.message || "Unable to finalize sign-in");
      return false;
    }

    router.push(nextUrl);
    return true;
  };

  const sendSecondFactorCode = async () => {
    const supportsEmailCode = signIn.supportedSecondFactors.some(
      (factor) => factor.strategy === "email_code",
    );

    if (supportsEmailCode) {
      const sendResult = await signIn.mfa.sendEmailCode();
      if (sendResult.error) {
        setError(sendResult.error.message || "Could not send email verification code");
        return false;
      }

      setSecondFactorMethod("email_code");
      return true;
    }

    const supportsPhoneCode = signIn.supportedSecondFactors.some(
      (factor) => factor.strategy === "phone_code",
    );

    if (supportsPhoneCode) {
      const sendResult = await signIn.mfa.sendPhoneCode();
      if (sendResult.error) {
        setError(sendResult.error.message || "Could not send phone verification code");
        return false;
      }

      setSecondFactorMethod("phone_code");
      return true;
    }

    setError("No supported verification method found. Please contact support.");
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      if (awaitingSecondFactor) {
        if (!verificationCode.trim()) {
          setError("Please enter the verification code.");
          return;
        }

        const verifyResult =
          secondFactorMethod === "phone_code"
            ? await signIn.mfa.verifyPhoneCode({ code: verificationCode.trim() })
            : await signIn.mfa.verifyEmailCode({ code: verificationCode.trim() });

        if (verifyResult.error) {
          setError(verifyResult.error.message || "Invalid verification code");
          return;
        }

        if (signIn.status === "complete" || !!signIn.createdSessionId) {
          const finalized = await finalizeAndRedirect();
          if (finalized) return;
        }

        setError(`Verification is not complete yet (status: ${signIn.status}).`);
        return;
      }

      const passwordResult = await signIn.password({
        identifier: email,
        password,
      });

      if (passwordResult.error) {
        setError(passwordResult.error.message || "Invalid email or password");
        return;
      }

      if (signIn.status === "complete" || !!signIn.createdSessionId) {
        const finalized = await finalizeAndRedirect();
        if (finalized) return;
      }

      if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
        const sent = await sendSecondFactorCode();
        if (sent) {
          setAwaitingSecondFactor(true);
          setError("");
        }
        return;
      }

      setError(
        `Sign-in requires additional steps in Clerk (${signIn.status}). Please complete verification.`,
      );
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-10 inline-flex items-center">
            <LogoMark className="scale-150" />
          </Link>
          <h1 className="mb-1 text-4xl font-bold tracking-tight text-blue-600 uppercase">
            Welcome Back
          </h1>
          <p className="text-sm text-balance text-neutral-100">Sign in to manage your account.</p>
        </div>
        {awaitingSecondFactor && (
          <div className="border border-blue-800/50 bg-blue-950/40 p-3 text-sm text-neutral-100">
            We sent a verification code to your{" "}
            {secondFactorMethod === "phone_code" ? "phone" : "email"}. Enter it below to complete
            sign-in.
          </div>
        )}
        {error && (
          <div className="animate-in fade-in border border-neutral-700 bg-neutral-900 p-3 text-sm text-neutral-100">
            {error}
          </div>
        )}
        {awaitingSecondFactor ? (
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-3">
              <Field>
                <Input
                  id="verificationCode"
                  type="text"
                  className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
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
                className="text-sm font-semibold text-neutral-100 underline-offset-4 transition-all hover:text-blue-600 hover:underline"
                onClick={async () => {
                  if (isLoading) return;
                  setIsLoading(true);
                  setError("");
                  const sent = await sendSecondFactorCode();
                  if (sent) {
                    setError("");
                  }
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
            <div className="flex flex-col items-start gap-3">
              <Button
                className="w-full bg-blue-600 py-2.5 font-semibold text-neutral-100 transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : awaitingSecondFactor ? "Verify code" : "Login"}
              </Button>
              <button
                type="button"
                className="text-sm text-neutral-100 underline-offset-4 transition-all hover:text-blue-600 hover:underline"
                onClick={async () => {
                  await signIn.reset();
                  setAwaitingSecondFactor(false);
                  setSecondFactorMethod(null);
                  setVerificationCode("");
                  setPassword("");
                  setError("");
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
              <FieldLabel className="text-neutral-100" htmlFor="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                className="px-2 py-1"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="text-neutral-100" htmlFor="password">
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-600 underline-offset-4 transition-all hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                className="px-2 py-1"
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
              {isLoading ? "Signing in..." : awaitingSecondFactor ? "Verify code" : "Login"}
            </Button>
            <div className="flex items-center justify-center gap-1 text-sm text-neutral-100">
              <span>Don&apos;t have an account?</span>
              <Link
                href={
                  redirectUrl
                    ? `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`
                    : "/sign-up"
                }
                className="font-semibold text-blue-600 underline-offset-4 transition-all hover:underline"
              >
                Sign up
              </Link>
            </div>
            <div id="clerk-captcha" />
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
