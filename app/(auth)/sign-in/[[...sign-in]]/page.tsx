import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-6 bg-neutral-950 p-6 md:p-16">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden items-center justify-center overflow-hidden bg-neutral-900 lg:flex">
        <Image
          src="/sub-zero-truck-portrait.png"
          alt="Premium Vehicle Wrap"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
