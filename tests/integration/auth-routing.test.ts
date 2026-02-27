import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');

const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

describe('auth route integration contracts', () => {
  it('keeps sign-in and sign-up pages on the expected catch-all route segments', async () => {
    await expect(access(signInPath)).resolves.toBeUndefined();
    await expect(access(signUpPath)).resolves.toBeUndefined();

    const invalidSignUpSegmentPath = path.join(appRoot, 'sign-up', '[[...sign-out]]', 'page.tsx');
    await expect(access(invalidSignUpSegmentPath)).rejects.toThrowError();
  });

  it('renders Clerk auth components with stable path routing contracts', async () => {
    const [signInPage, signUpPage] = await Promise.all([
      readFile(signInPath, 'utf8'),
      readFile(signUpPath, 'utf8')
    ]);

    expect(signInPage).toMatch(/<SignIn\b/);
    expect(signInPage).toContain('path="/sign-in"');
    expect(signInPage).toContain('routing="path"');
    expect(signInPage).toContain('signUpUrl="/sign-up"');

    expect(signUpPage).toMatch(/<SignUp\b/);
    expect(signUpPage).toContain('path="/sign-up"');
    expect(signUpPage).toContain('routing="path"');
    expect(signUpPage).toContain('signInUrl="/sign-in"');
  });
});
