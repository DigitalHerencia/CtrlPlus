import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');
const authShellPath = path.resolve(process.cwd(), 'features/auth/presentation/auth-shell.tsx');

describe('auth page copy conventions', () => {
  it('keeps sign-in content aligned with design copy standards', async () => {
    const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
    const [signInPage, authShell] = await Promise.all([readFile(signInPath, 'utf8'), readFile(authShellPath, 'utf8')]);

    expect(signInPage).toContain("eyebrow: 'Sign In'");
    expect(signInPage).toContain("title: 'Welcome back to CTRL+.'");
    expect(signInPage).toContain('Create Account');
    expect(signInPage).toContain('Explore Features');
    expect(signInPage).toContain('Need an account to continue?');
    expect(signInPage).toContain('signUpUrl="/sign-up"');
    expect(authShell).toContain('<p className="eyebrow">{eyebrow}</p>');
  });

  it('keeps sign-up content aligned with design copy standards', async () => {
    const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');
    const [signUpPage, authShell] = await Promise.all([readFile(signUpPath, 'utf8'), readFile(authShellPath, 'utf8')]);

    expect(signUpPage).toContain("eyebrow: 'Sign Up'");
    expect(signUpPage).toContain("title: 'Create your CTRL+ account.'");
    expect(signUpPage).toContain('Explore Features');
    expect(signUpPage).toContain('Contact Team');
    expect(signUpPage).toContain('Already have an account?');
    expect(signUpPage).toContain('signInUrl="/sign-in"');
    expect(authShell).toContain('<p className="eyebrow">{eyebrow}</p>');
  });
});
