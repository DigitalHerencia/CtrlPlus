import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');
const authPanelsPath = path.resolve(process.cwd(), 'components/shared-ui/auth/auth-panels.tsx');
const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

describe('auth page copy and CTA contracts', () => {
  it('keeps sign-in content, CTA destinations, and AuthShell heading contract', async () => {
    const [signInPage, authPanels] = await Promise.all([
      readFile(signInPath, 'utf8'),
      readFile(authPanelsPath, 'utf8'),
    ]);

    expect(signInPage).toContain("eyebrow: 'Sign In'");
    expect(signInPage).toContain("title: 'Welcome back to CTRL+.'");
    expect(signInPage).toMatch(/href=['"]\/sign-up['"]/);
    expect(signInPage).toMatch(/href=['"]\/features['"]/);
    expect(signInPage).toContain('Create Account');
    expect(signInPage).toMatch(/signUpUrl=['"]\/sign-up['"]/);
    expect(authPanels).toContain('export function AuthMarketingPanel');
    expect(authPanels).toContain('{eyebrow}');
    expect(authPanels).toContain('{title}');
  });

  it('keeps sign-up content, CTA destinations, and AuthShell heading contract', async () => {
    const [signUpPage, authPanels] = await Promise.all([
      readFile(signUpPath, 'utf8'),
      readFile(authPanelsPath, 'utf8'),
    ]);

    expect(signUpPage).toContain("eyebrow: 'Sign Up'");
    expect(signUpPage).toContain("title: 'Create your CTRL+ account.'");
    expect(signUpPage).toMatch(/href=['"]\/sign-in['"]/);
    expect(signUpPage).toMatch(/href=['"]\/features['"]/);
    expect(signUpPage).toMatch(/href=['"]\/contact['"]/);
    expect(signUpPage).toMatch(/signInUrl=['"]\/sign-in['"]/);
    expect(authPanels).toContain('export function AuthMarketingPanel');
    expect(authPanels).toContain('{eyebrow}');
    expect(authPanels).toContain('{title}');
  });
});
