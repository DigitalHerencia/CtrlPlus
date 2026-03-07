import { SignupForm } from "@/components/auth/signup-form";
import Image from "next/image";

export default function SignupPage() {
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
      <div className="flex flex-col items-center justify-center gap-6 bg-neutral-950 p-6 md:p-16">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
