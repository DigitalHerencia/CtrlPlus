import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');

describe('auth page copy conventions', () => {
  it('keeps sign-in content aligned with design copy standards', async () => {
    const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
    const signInPage = await readFile(signInPath, 'utf8');

    expect(signInPage).toContain('<p className="eyebrow">Sign In</p>');
    expect(signInPage).toContain('Welcome back to CTRL+.');
    expect(signInPage).toContain('Create Account');
    expect(signInPage).toContain('Explore Features');
    expect(signInPage).toContain('Need an account to continue?');
    expect(signInPage).toContain('signUpUrl="/sign-up"');
  });

  it('keeps sign-up content aligned with design copy standards', async () => {
    const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');
    const signUpPage = await readFile(signUpPath, 'utf8');

    expect(signUpPage).toContain('<p className="eyebrow">Sign Up</p>');
    expect(signUpPage).toContain('Create your CTRL+ account.');
    expect(signUpPage).toContain('Explore Features');
    expect(signUpPage).toContain('Contact Team');
    expect(signUpPage).toContain('Already have an account?');
    expect(signUpPage).toContain('signInUrl="/sign-in"');
  });
});
