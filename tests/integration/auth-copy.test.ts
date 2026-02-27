import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');
const authShellPath = path.resolve(process.cwd(), 'features/auth/presentation/auth-shell.tsx');
const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

describe('auth page copy and CTA contracts', () => {
  it('keeps sign-in content, CTA destinations, and AuthShell heading contract', async () => {
    const [signInPage, authShell] = await Promise.all([
      readFile(signInPath, 'utf8'),
      readFile(authShellPath, 'utf8')
    ]);

    expect(signInPage).toContain("eyebrow: 'Sign In'");
    expect(signInPage).toContain("title: 'Welcome back to CTRL+.'");
    expect(signInPage).toContain('href="/sign-up"');
    expect(signInPage).toContain('href="/features"');
    expect(signInPage).toContain('Create Account');
    expect(signInPage).toContain('signUpUrl="/sign-up"');
    expect(authShell).toContain('<h1 className={styles.marketingTitle}>{title}</h1>');
    expect(authShell).toContain('<p className="eyebrow">{eyebrow}</p>');
  });

  it('keeps sign-up content, CTA destinations, and AuthShell heading contract', async () => {
    const [signUpPage, authShell] = await Promise.all([
      readFile(signUpPath, 'utf8'),
      readFile(authShellPath, 'utf8')
    ]);

    expect(signUpPage).toContain("eyebrow: 'Sign Up'");
    expect(signUpPage).toContain("title: 'Create your CTRL+ account.'");
    expect(signUpPage).toContain('href="/sign-in"');
    expect(signUpPage).toContain('href="/features"');
    expect(signUpPage).toContain('href="/contact"');
    expect(signUpPage).toContain('signInUrl="/sign-in"');
    expect(authShell).toContain('<h1 className={styles.marketingTitle}>{title}</h1>');
    expect(authShell).toContain('<p className="eyebrow">{eyebrow}</p>');
  });
});
