import Link from 'next/link';

export default function SignInPage() {
  return (
    <main>
      <h1>Sign in to CtrlPlus</h1>
      <p>
        Clerk integration is configured for user authentication without organization switching for
        this milestone.
      </p>
      <p>
        Continue with your email identity provider and return to the tenant dashboard when
        complete.
      </p>
      <p>
        Need an account? <Link href="/sign-up">Create one</Link>
      </p>
    </main>
  );
}
