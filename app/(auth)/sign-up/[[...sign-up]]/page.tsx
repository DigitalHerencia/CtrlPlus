import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main>
      <h1>Create your CtrlPlus account</h1>
      <p>
        This authentication flow provisions a single-user identity through Clerk and intentionally
        skips organization setup.
      </p>
      <p>Complete sign-up to access your tenant workspace.</p>
      <p>
        Already registered? <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}
