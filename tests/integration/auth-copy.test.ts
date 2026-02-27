import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const appRoot = path.resolve(process.cwd(), 'app', '(auth)');

const signInPath = path.join(appRoot, 'sign-in', '[[...sign-in]]', 'page.tsx');
const signUpPath = path.join(appRoot, 'sign-up', '[[...sign-up]]', 'page.tsx');

describe('auth page copy and CTA contracts', () => {
  it('keeps sign-in page structure with primary heading, CTA destinations, and sign-up cross-link', async () => {
    const signInPage = await readFile(signInPath, 'utf8');

    expect(signInPage).toMatch(/<h1\b[^>]*>[\s\S]*?<\/h1>/);
    expect(signInPage).toContain('href="/sign-up"');
    expect(signInPage).toContain('signUpUrl="/sign-up"');

    expect(signInPage).toContain('href="/features"');
    expect(signInPage).toContain('Create Account');
  });

  it('keeps sign-up page structure with primary heading, CTA destinations, and sign-in cross-link', async () => {
    const signUpPage = await readFile(signUpPath, 'utf8');

    expect(signUpPage).toMatch(/<h1\b[^>]*>[\s\S]*?<\/h1>/);
    expect(signUpPage).toContain('href="/sign-in"');
    expect(signUpPage).toContain('signInUrl="/sign-in"');

    expect(signUpPage).toContain('href="/features"');
    expect(signUpPage).toContain('href="/contact"');
  });
});
