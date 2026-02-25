import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');

describe('auth route file conventions', () => {
  it('uses the correct sign-in and sign-up catch-all segment names', async () => {
    const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
    const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

    await expect(readFile(signInPath, 'utf8')).resolves.toContain('export default function SignInPage');
    await expect(readFile(signUpPath, 'utf8')).resolves.toContain('export default function SignUpPage');
  });

  it('does not regress to the invalid sign-up segment name', async () => {
    const invalidPath = path.join(appRoot, 'sign-up', '[[...sign-out]]', 'page.tsx');

    await expect(readFile(invalidPath, 'utf8')).rejects.toThrowError();
  });

  it('keeps Clerk path routing aligned with the route segments', async () => {
    const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
    const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

    const [signInPage, signUpPage] = await Promise.all([
      readFile(signInPath, 'utf8'),
      readFile(signUpPath, 'utf8')
    ]);

    expect(signInPage).toContain('path="/sign-in"');
    expect(signInPage).toContain('routing="path"');
    expect(signInPage).toContain('signUpUrl="/sign-up"');

    expect(signUpPage).toContain('path="/sign-up"');
    expect(signUpPage).toContain('routing="path"');
    expect(signUpPage).toContain('signInUrl="/sign-in"');
  });
});
