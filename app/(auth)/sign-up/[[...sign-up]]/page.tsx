import { SignupForm } from "@/components/auth/signup-form";
import Image from "next/image";

interface SignupPageProps {
  searchParams: Promise<{
    redirect_url?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-neutral-900 lg:flex">
        <Image
          src="/chilitos-truck-portrait.png"
          alt="Premium Vehicle Wrap"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-6 bg-neutral-900 p-6 md:p-16">
        <div className="w-full max-w-sm">
          <SignupForm redirectUrl={redirectUrl} />
        </div>
      </div>
    </div>
  );
}
